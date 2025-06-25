import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({
    context: { authenticationData: isAuthenticated },
    location,
  }) => {
    if (!isAuthenticated)
      throw redirect({
        to: "/signin",
        search: {
          redirect: location.href,
        },
      });
  },
  component: AuthenticatedPathlessLayout,
});

function AuthenticatedPathlessLayout() {
  return <Outlet />;
}
