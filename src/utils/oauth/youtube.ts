import { queryOptions } from "@tanstack/react-query";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { Context, Effect } from "effect";
import {
  type YoutubeChannelsData,
  YoutubeChannelsListRequestSchema,
  YoutubeChannelsListResponseSchema,
} from "@/routes/api/oauth/google/callback";
import {
  AccessTokenDataService,
  getAccessTokenDataMw,
} from "../authentication";
import { ServerFnError } from "../errors";
import { RequestHeadersSchema, strictParse, upstream } from "../httpResponses";
import { youtubeScopes } from "./google";

export type YoutubeAuthorizationData =
  | {
      isAuthorized: false;
      channelsData: null;
    }
  | {
      isAuthorized: true;
      channelsData: YoutubeChannelsData;
    };

// const isYoutubeAuthorizedMw = createMiddleware({ type: "function" })
//   .middleware([getEnvironmentMw, getSessionDataMw])
//   .server(async ({ next, context: { cloudflareBindings, sessionData } }) => {
//     const context = Context.empty().pipe(
//       Context.add(SessionDataService, sessionData),
//       Context.add(CloudflareBindingsService, cloudflareBindings),
//     );
//     const program = Effect.gen(function* () {
//       const scopeString = yield* getScopeString();
//       return yield* verifyScopeString(scopeString);
//     });
//     const runnable = Effect.provide(program, context);
//     Effect.catchTags(runnable, {
//       INTERNAL_SERVER_ERROR: (error) => {
//         throw error;
//       },
//     });
//     const isYoutubeAuthorized = await Effect.runPromise(runnable);
//     return next<{ isYoutubeAuthorized: boolean }>({
//       context: {
//         isYoutubeAuthorized,
//       },
//     });
//   });

const getYoutubeAuthorizationDataMw = createMiddleware({
  type: "function",
})
  .middleware([getAccessTokenDataMw])
  .server(async ({ next, context: { accessTokenData } }) => {
    const context = Context.empty().pipe(
      Context.add(AccessTokenDataService, accessTokenData),
    );
    const program = Effect.gen(function* () {
      const isYoutubeAuthorized = yield* verifyAcceptedScopes();
      const { accessToken } = yield* AccessTokenDataService;
      return yield* Effect.if(
        isYoutubeAuthorized && accessToken !== undefined,
        {
          onFalse: () =>
            Effect.succeed({
              isAuthorized: false as const,
              channelsData: null,
            }),
          onTrue: () =>
            Effect.gen(function* () {
              const channelsData = yield* getYoutubeChannelsData(accessToken!);
              return yield* Effect.succeed({
                isAuthorized: true as const,
                channelsData,
              });
            }),
        },
      );
    });
    const runnable = Effect.provide(program, context);
    Effect.catchTags(runnable, {
      BAD_GATEWAY: () => {
        throw new ServerFnError("SERVICE_UNAVAILABLE");
      },
      SERVICE_UNAVAILABLE: () => {
        throw new ServerFnError("SERVICE_UNAVAILABLE");
      },
    });
    const youtubeAuthorizationData = await Effect.runPromise(runnable);
    console.log(youtubeAuthorizationData);
    return next<{ youtubeAuthorizationData: YoutubeAuthorizationData }>({
      context: {
        youtubeAuthorizationData,
      },
    });
  });

const verifyAcceptedScopes = () =>
  Effect.gen(function* () {
    const { acceptedScopes } = yield* AccessTokenDataService;
    return yield* Effect.sync(() =>
      youtubeScopes.every((youtubeScope) =>
        acceptedScopes.includes(youtubeScope),
      ),
    );
  });

const getYoutubeChannelsData = (accessToken: string) =>
  Effect.gen(function* () {
    const base = yield* Effect.succeed("https://www.googleapis.com");
    const path = yield* Effect.succeed("/youtube/v3/channels");
    const searchParams = yield* Effect.sync(() =>
      strictParse(YoutubeChannelsListRequestSchema, {
        part: ["id"],
      }),
    );
    const headers = yield* Effect.sync(() =>
      strictParse(RequestHeadersSchema, {
        authorization: {
          scheme: "Bearer",
          credentials: accessToken,
        },
      }),
    );
    return yield* upstream({
      urlParts: { base, path, searchParams },
      headers,
      method: "get",
      schema: YoutubeChannelsListResponseSchema,
    });
  });

const getYoutubeAuthorizationDataFn = createServerFn()
  .middleware([getYoutubeAuthorizationDataMw])
  .handler(
    async ({
      context: { youtubeAuthorizationData },
    }): Promise<YoutubeAuthorizationData> => youtubeAuthorizationData,
  );

// const getAccessToken = createServerFn().handler(async () => {
//   const isYouTubeAuthorized = await isYoutubeAuthorizedFn();
//   if (!isYouTubeAuthorized) throw new Error("youtubeUnauthorized");
//   //   const response = auth.api.getAccessToken({
//   //       body: {
//   //     providerId: "google", // or any other provider id
//   //     accountId: "accountId", // optional, if you want to get the access token for a specific account
//   //     userId: "userId", // optional, if you don't provide headers with authenticated token
//   //   },
//   //   headers: // pass headers with authenticated token
//   // });
//   // return response;
// });

// const EntrySchema = z.object({
//   scope: z.string().nullable(),
// });

export const youtubeAuthorizationDataQueryOptions = queryOptions({
  queryKey: ["youtubeAuthorizationData"],
  queryFn: async () => getYoutubeAuthorizationDataFn(),
  retry: false,
  staleTime: Infinity,
  gcTime: Infinity,
});
