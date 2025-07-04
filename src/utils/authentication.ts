import { queryOptions } from "@tanstack/react-query";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { Context } from "effect";
import { auth } from "@/lib/auth";
import { ServerFnErrorCodes } from "./errors";

type SessionData = typeof auth.$Infer.Session;
type AuthenticationData =
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
      ? {
          isAuthenticated: false as const,
          sessionData,
        }
      : {
          isAuthenticated: true as const,
          sessionData,
        };
  return next<{ authenticationData: AuthenticationData }>({
    context: {
      authenticationData,
    },
  });
});

const getSessionDataMw = createMiddleware({ type: "function" })
  .middleware([getAuthenticationDataMw])
  .server(
    async ({
      next,
      context: {
        authenticationData: { isAuthenticated, sessionData },
      },
    }) => {
      if (!isAuthenticated) throw new Error(ServerFnErrorCodes.UNAUTHENTICATED);
      return next({
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

const authenticationDataQueryOptions = queryOptions({
  queryKey: ["authenticationData"],
  queryFn: getAuthenticationDataFn,
  retry: false,
  staleTime: Infinity,
  gcTime: Infinity,
});

class SessionDataService extends Context.Tag("SessionDataService")<
  SessionDataService,
  SessionData
>() {}

export {
  type SessionData,
  type AuthenticationData,
  getSessionDataMw,
  authenticationDataQueryOptions as authenticationQueryOptions,
  SessionDataService,
};
