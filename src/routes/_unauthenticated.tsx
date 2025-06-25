import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { z } from "zod";

const SearchParamsSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/_unauthenticated")({
  validateSearch: SearchParamsSchema,
  beforeLoad: async ({
    context: {
      authenticationData: { isAuthenticated },
    },
    search,
  }) => {
    if (isAuthenticated) throw redirect({ to: search?.redirect ?? "/" });
  },
  component: UnauthenticatedPathlessLayout,
});

function UnauthenticatedPathlessLayout() {
  return <Outlet />;
}
