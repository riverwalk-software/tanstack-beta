import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import type { SessionData } from "@/utils/authentication";
import { AUTH_CALLBACK_ROUTE } from "@/utils/constants";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({
    context: {
      authenticationData: { isAuthenticated, sessionData },
    },
    location,
  }): Promise<{ sessionData: SessionData }> => {
    if (!isAuthenticated)
      throw redirect({
        to: AUTH_CALLBACK_ROUTE,
        search: {
          redirect: location.href,
        },
      });

    return { sessionData };
  },
  component: AuthenticatedPathlessLayout,
});

function AuthenticatedPathlessLayout() {
  return <Outlet />;
}
