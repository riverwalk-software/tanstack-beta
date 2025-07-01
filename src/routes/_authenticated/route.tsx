import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import type { SessionData } from "@/utils/authentication";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({
    context: {
      authenticationData: { isAuthenticated, sessionData },
    },
    location,
  }): Promise<{ sessionData: SessionData }> => {
    if (!isAuthenticated)
      throw redirect({
        to: "/signin",
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
