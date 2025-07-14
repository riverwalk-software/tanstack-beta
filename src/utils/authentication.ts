import { queryOptions } from "@tanstack/react-query";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { Context } from "effect";
import { auth } from "@/lib/auth";
import { ServerFnError } from "./errors";

export type SessionData = typeof auth.$Infer.Session;
export type AuthenticationData =
  | {
      isAuthenticated: false;
      sessionData: null;
    }
  | {
      isAuthenticated: true;
      sessionData: SessionData;
    };

const getAuthenticationDataMw = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const { headers } = getWebRequest();
  const sessionData = await auth.api.getSession({ headers });
  const authenticationData =
    sessionData === null
      ? ({
          isAuthenticated: false,
          sessionData,
        } as const)
      : ({
          isAuthenticated: true,
          sessionData,
        } as const);
  return next<{ authenticationData: AuthenticationData }>({
    context: {
      authenticationData,
    },
  });
});

export const getSessionDataMw = createMiddleware({ type: "function" })
  .middleware([getAuthenticationDataMw])
  .server(
    async ({
      next,
      context: {
        authenticationData: { isAuthenticated, sessionData },
      },
    }) => {
      if (!isAuthenticated) throw new ServerFnError("UNAUTHENTICATED");
      return next<{ sessionData: SessionData }>({
        context: {
          sessionData,
        },
      });
    },
  );

const getAuthenticationDataFn = createServerFn()
  .middleware([getAuthenticationDataMw])
  .handler(
    async ({ context: { authenticationData } }): Promise<AuthenticationData> =>
      authenticationData,
  );

export const authenticationDataQueryOptions = queryOptions({
  queryKey: ["authenticationData"],
  queryFn: getAuthenticationDataFn,
  staleTime: Infinity,
  gcTime: Infinity,
  subscribed: false,
});

export class SessionDataService extends Context.Tag("SessionDataService")<
  SessionDataService,
  SessionData
>() {}

export class AccessTokenDataService extends Context.Tag(
  "AccessTokenDataService",
)<AccessTokenDataService, AccessTokenData>() {}
export interface AccessTokenData {
  accessToken: string | undefined;
  acceptedScopes: string[];
}

export const getAccessTokenDataMw = createMiddleware({ type: "function" })
  .middleware([getSessionDataMw])
  .server(
    async ({
      next,
      context: {
        sessionData: { user },
      },
    }) => {
      const { accessToken, scopes: acceptedScopes } =
        await auth.api.getAccessToken({
          body: {
            providerId: "google",
            userId: user.id,
          },
        });
      return next<{ accessTokenData: AccessTokenData }>({
        context: {
          accessTokenData: {
            accessToken,
            acceptedScopes,
          },
        },
      });
    },
  );
