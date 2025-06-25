import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import ms from "ms";
import { auth } from "@/lib/auth";
import { EVENTUAL_CONSISTENCY_DELAY_S } from "./constants";

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

const getSessionDataFn = createServerFn().handler(
  async (): Promise<AuthenticationData> => {
    const { headers } = getWebRequest();
    const sessionData = await auth.api.getSession({ headers });
    return sessionData === null
      ? {
          isAuthenticated: false,
          sessionData: null,
        }
      : {
          isAuthenticated: true,
          sessionData,
        };
  },
);

export const authenticationQueryOptions = queryOptions({
  queryKey: ["authentication"],
  queryFn: getSessionDataFn,
  staleTime: ms(`${EVENTUAL_CONSISTENCY_DELAY_S}s`),
  retry: false,
});
