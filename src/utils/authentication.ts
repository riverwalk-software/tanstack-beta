import { queryOptions } from "@tanstack/react-query";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { Context } from "effect";
import { auth } from "@/lib/auth";

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

const getSessionDataMw = createMiddleware({ type: "function" })
  .middleware([getAuthenticationDataMw])
  .server(
    async ({
      next,
      context: {
        authenticationData: { isAuthenticated, sessionData },
      },
    }) => {
      if (!isAuthenticated) throw new Error("unauthorized");
      return next({
        context: {
          sessionData,
        },
      });
    },
  );

export const getSessionDataFn = createServerFn()
  .middleware([getSessionDataMw])
  .handler(({ context: { sessionData } }) => sessionData);

export const authenticationQueryOptions = queryOptions({
  queryKey: ["authentication"],
  queryFn: getAuthenticationDataFn,
  retry: false,
  staleTime: Infinity,
  gcTime: Infinity,
});

export class SessionDataService extends Context.Tag("SessionDataService")<
  SessionDataService,
  SessionData
>() {}
