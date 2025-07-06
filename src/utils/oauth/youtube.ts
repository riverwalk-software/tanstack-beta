import { queryOptions } from "@tanstack/react-query";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { Context, Effect } from "effect";
import { match } from "ts-pattern";
import {
  type YoutubeChannel,
  type YoutubeChannels,
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

const BASE_URL = "https://www.googleapis.com";
export type YoutubeAuthorizationData =
  | {
      isAuthorized: false;
      channelsData: null;
    }
  | {
      isAuthorized: true;
      channelsData: YoutubeChannelsData;
    };

type YoutubeChannelsData =
  | {
      channelCount: "zero";
      channels: null;
      // videosData: null;
    }
  | {
      channelCount: "one";
      channels: YoutubeChannel;
      // videosData: YoutubeVideosData;
    }
  | {
      channelCount: "multiple";
      channels: YoutubeChannels;
      // videosData: null;
    };

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
              console.log("accessToken", accessToken);
              const channels = yield* getYoutubeChannelsData(accessToken!);
              const channelsData = yield* Effect.succeed(
                match(channels.length)
                  .with(0, () => ({
                    channelCount: "zero" as const,
                    channels: null,
                  }))
                  .with(1, () => ({
                    channelCount: "one" as const,
                    channels: channels[0],
                  }))
                  .otherwise(() => ({
                    channelCount: "multiple" as const,
                    channels: channels,
                  })),
              );
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
    console.log("youtubeAuthorizationData", youtubeAuthorizationData);
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
    const base = yield* Effect.succeed(BASE_URL);
    const path = yield* Effect.succeed("/youtube/v3/channels");
    const searchParams = yield* Effect.sync(() =>
      strictParse(YoutubeChannelsListRequestSchema, {
        maxResults: 50,
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

export const youtubeAuthorizationDataQueryOptions = queryOptions({
  queryKey: ["youtubeAuthorizationData"],
  queryFn: async () => getYoutubeAuthorizationDataFn(),
  retry: false,
  staleTime: Infinity,
  gcTime: Infinity,
});
