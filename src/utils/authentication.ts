import { queryOptions } from "@tanstack/react-query";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import ms from "ms";
import { auth } from "@/lib/auth";
import { UNAUTHENTICATED } from "./httpResponses";

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

const getAuthenticationDataMw = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const { headers } = getWebRequest();
    const sessionData = await auth.api.getSession({ headers });
    const authenticationData =
      sessionData === null
        ? {
            isAuthenticated: false as const,
            sessionData: null,
          }
        : {
            isAuthenticated: true as const,
            sessionData,
          };
    return next({
      context: {
        authenticationData,
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

export const getSessionDataFn = createServerFn()
  .middleware([getAuthenticationDataMw])
  .handler(
    async ({
      context: {
        authenticationData: { isAuthenticated, sessionData },
      },
    }): Promise<SessionData> => {
      if (!isAuthenticated) throw new UNAUTHENTICATED();
      return sessionData;
    },
  );

export const authenticationQueryOptions = queryOptions({
  queryKey: ["authentication"],
  queryFn: getAuthenticationDataFn,
  gcTime: ms("30m"),
  retry: false,
  staleTime: Infinity,
});
