import { createServerFileRoute } from "@tanstack/react-start/server";
import { Context, Effect, Either } from "effect";
import { z } from "zod";
import { getSessionDataFn, SessionDataService } from "@/utils/authentication";
import { EnvironmentService, getEnvironmentFn } from "@/utils/environment";
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings";
import {
  BAD_REQUEST,
  buildUrl,
  effectToRedirect,
  NO_CONTENT,
  RequestHeadersSchema,
  strictParse,
  UNAUTHENTICATED,
  UNAUTHORIZED,
  upstream,
} from "@/utils/httpResponses";
import {
  scopeDelimiter,
  YoutubeDataScopeSchema,
  youtubeScopes,
} from "@/utils/oauth/google";
import { checkIfExpired, ttlSToMs } from "@/utils/time";

export const ServerRoute = createServerFileRoute(
  "/api/oauth/google/callback",
).methods((api) => ({
  GET: api.handler(async ({ request }) => {
    const sessionData = await getSessionDataFn();
    const environment = await getEnvironmentFn();
    const cloudflareBindings = getCloudflareBindings();
    const program = Effect.gen(function* () {
      const { code, state } = yield* getSearchParams(request.url);
      const sessionId = yield* getSessionId(state);
      const userId = yield* getUserId(sessionId);
      const { tokens, scopes } = yield* exchangeCodeForTokensAndScopes(code);
      yield* verifyScopes(scopes);
      const channelIds = yield* getYoutubeChannelIds(tokens.access.token);
      yield* storeTokens({ channelIds, tokens, userId });
      return yield* Effect.succeed(new NO_CONTENT());
    });
    const context = Context.empty().pipe(
      Context.add(EnvironmentService, environment),
      Context.add(SessionDataService, sessionData),
      Context.add(CloudflareBindingsService, cloudflareBindings),
    );
    const runnable = Effect.provide(program, context);
    return effectToRedirect({ request, effect: runnable, path: "/youtube" });
  }),
}));

const getSearchParams = (requestUrlString: string) =>
  Effect.gen(function* () {
    const requestUrl = yield* Effect.sync(() => new URL(requestUrlString));
    const maybeError = yield* Effect.sync(() =>
      requestUrl.searchParams.get("error"),
    );
    yield* Effect.if(maybeError === null, {
      onTrue: () => Effect.void,
      onFalse: () => Effect.fail(new UNAUTHORIZED()),
    });
    const code = yield* Effect.sync(() => requestUrl.searchParams.get("code")!);
    const state = yield* Effect.sync(
      () => requestUrl.searchParams.get("state")!,
    );
    return { code, state };
  });

const getSessionId = (state: string) =>
  Effect.gen(function* () {
    const { OAUTH_STORE } = yield* CloudflareBindingsService;
    // const oauthStore = yield* Effect.sync(() =>
    //   getDurableObject(OAUTH_STORE, state),
    // );
    // const maybeSessionId = yield* Effect.promise(() =>
    //   oauthStore.getSessionId(),
    // );
    const maybeSessionId = yield* Effect.promise(() => OAUTH_STORE.get(state));
    return yield* Either.fromNullable(
      maybeSessionId,
      () => new BAD_REQUEST({ message: "Invalid or expired state argument." }),
    );
  });

const getUserId = (sessionId: string) =>
  Effect.gen(function* () {
    const { DB } = yield* CloudflareBindingsService;
    const maybeUnknownEntry = yield* Effect.promise(() =>
      DB.prepare("SELECT userId, expiresAt FROM session where id = ?")
        .bind(sessionId)
        .first(),
    );
    const unknownEntry = yield* Either.fromNullable(
      maybeUnknownEntry,
      () =>
        new UNAUTHENTICATED({
          message: "Your session is no longer valid. Please log in again.",
        }),
    );
    const { userId, expiresAt } = yield* Effect.sync(() =>
      SessionEntrySchema.parse(unknownEntry),
    );
    const isExpired = yield* Effect.sync(() => checkIfExpired(expiresAt));
    yield* Effect.if(isExpired, {
      onFalse: () => Effect.void,
      onTrue: () =>
        Effect.fail(
          new UNAUTHENTICATED({
            message: "Your session has expired. Please log in again.",
          }),
        ),
    });
    return userId;
  });

const exchangeCodeForTokensAndScopes = (code: string) =>
  Effect.gen(function* () {
    const {
      variables: { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI },
      secrets: { GOOGLE_CLIENT_SECRET },
    } = yield* EnvironmentService;
    const url = "https://oauth2.googleapis.com/token";
    const body = yield* Effect.sync(() =>
      strictParse(GoogleCodeExchangePostBodySchema, {
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        code,
        redirectUri: GOOGLE_REDIRECT_URI,
      }),
    );
    const headers = yield* Effect.sync(() =>
      strictParse(RequestHeadersSchema, {
        "content-type": "application/x-www-form-urlencoded",
      }),
    );
    return yield* upstream({
      body,
      headers,
      method: "post",
      schema: TokensResponseSchema,
      url,
    });
  });

const verifyScopes = (acceptedScopes: string[]) =>
  Effect.gen(function* () {
    const allScopesAccepted = yield* Effect.sync(() =>
      youtubeScopes.every((scope) => acceptedScopes.includes(scope)),
    );
    yield* Effect.if(allScopesAccepted, {
      onFalse: () =>
        Effect.fail(
          new UNAUTHORIZED({
            message: "You have not granted all required scopes.",
          }),
        ),
      onTrue: () => Effect.void,
    });
  });

const getYoutubeChannelIds = (accessToken: string) =>
  Effect.gen(function* () {
    const base = yield* Effect.succeed("https://www.googleapis.com");
    const path = yield* Effect.succeed("/youtube/v3/channels");
    const searchParams = yield* Effect.sync(() =>
      strictParse(YoutubeChannelsListRequestSchema, {
        part: ["id"],
      }),
    );
    const url = yield* Effect.sync(() =>
      buildUrl({ base, path, searchParams }),
    );
    const headers = yield* Effect.sync(() =>
      strictParse(RequestHeadersSchema, {
        authorization: {
          scheme: "Bearer",
          credentials: accessToken,
        },
      }),
    );
    const { youtubeChannels: channels } = yield* upstream({
      url,
      headers,
      method: "get",
      schema: YoutubeChannelsListResponseSchema,
    });
    const youtubeChannelsIds = yield* Effect.sync(() =>
      channels.map(({ id }) => id),
    );
    return youtubeChannelsIds;
  });

const storeTokens = ({
  channelIds,
  tokens,
  userId,
}: {
  userId: string;
  channelIds: string[];
  tokens: z.infer<typeof TokensResponseSchema>["tokens"];
}) =>
  Effect.gen(function* () {
    const { USER_STORE } = yield* CloudflareBindingsService;
    // const userStore = yield* Effect.sync(() =>
    //   getDurableObject(USER_STORE, userId),
    // );
    // yield* Effect.promise(() =>
    //   userStore.set({
    //     google: { youtubeChannelIds: channelIds, tokens },
    //   }),
    // );
    const previousValue = yield* Effect.promise(() =>
      USER_STORE.get<UserValueSchema>(userId, { type: "json" }),
    );
    yield* Effect.promise(() =>
      USER_STORE.put(
        userId,
        JSON.stringify({
          ...(previousValue ?? {}),
          google: {
            youtubeChannelIds: channelIds,
            tokens,
          },
        } as UserValueSchema),
      ),
    );
  });

export const TokensResponseSchema = z
  .object({
    access_token: z.string().nonempty(),
    expires_in: z.number().int().positive().transform(ttlSToMs),
    refresh_token: z.string().nonempty(),
    refresh_token_expires_in: z
      .number()
      .int()
      .positive()
      .transform(ttlSToMs)
      .optional(),
    scope: z
      .string()
      .nonempty()
      .transform((scopeString) => scopeString.split(scopeDelimiter))
      .transform((scopes) =>
        scopes.map((scope) => YoutubeDataScopeSchema.parse(scope)),
      )
      .transform((scopes) => new Set(scopes))
      .transform((scopes) => Array.from(scopes)),
  })
  .transform((schema) => ({
    accessToken: schema.access_token,
    accessTokenTtl: schema.expires_in,
    refreshToken: schema.refresh_token,
    refreshTokenTtl: schema.refresh_token_expires_in,
    scopes: schema.scope,
  }))
  .transform((schema) => ({
    tokens: {
      access: {
        token: schema.accessToken,
        expiresAt: schema.accessTokenTtl,
      },
      refresh: {
        token: schema.refreshToken,
        expiresAt: schema.refreshTokenTtl,
      },
    },
    scopes: schema.scopes,
  }));

export type TokensResponse = z.infer<typeof TokensResponseSchema>;

const SessionEntrySchema = z.object({
  userId: z.string().nonempty(),
  expiresAt: z.coerce.date().transform((date) => date.getTime()),
});

const GoogleCodeExchangePostBodySchema = z
  .object({
    clientId: z.string().nonempty(),
    clientSecret: z.string().nonempty(),
    code: z.string().nonempty(),
    redirectUri: z.string().url(),
  })
  .transform((data) => ({
    client_id: data.clientId,
    client_secret: data.clientSecret,
    code: data.code,
    grant_type: "authorization_code",
    redirect_uri: data.redirectUri,
  }));

const YoutubeChannelsListPartSchema = z.enum([
  "auditDetails",
  "brandingSettings",
  "contentDetails",
  "contentOwnerDetails",
  "id",
  "localizations",
  "snippet",
  "statistics",
  "status",
  "topicDetails",
]);

export const YoutubeChannelsListRequestSchema = z
  .object({
    maxResults: z
      .number()
      .int()
      .positive()
      .max(50)
      .default(1)
      .transform(String),
  })
  .transform((schema) => ({
    ...schema,
    mine: "true",
    part: ["id", "snippet", "contentDetails"] as z.infer<
      typeof YoutubeChannelsListPartSchema
    >[],
  }))
  .transform((schema) => ({
    ...schema,
    part: schema.part.join(","),
  }));

const YoutubeChannelSchema = z.object({
  id: z.string().nonempty(),
  snippet: z.object({
    title: z.string().nonempty(),
  }),
  contentDetails: z.object({
    relatedPlaylists: z.object({
      likes: z.string(),
      favorites: z.string(),
      uploads: z.string(),
    }),
  }),
});

export const YoutubeChannelsListResponseSchema = z
  .object({
    items: z.array(YoutubeChannelSchema).default([]),
  })
  .transform(({ items }) => items);

export type YoutubeChannel = z.infer<typeof YoutubeChannelSchema>;
export type YoutubeChannels = YoutubeChannel[];

export interface UserValueSchema {
  google?: {
    youtubeChannelIds: string[];
    tokens: TokensResponse["tokens"];
  };
}
