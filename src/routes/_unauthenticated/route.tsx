import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { HOME_ROUTE } from "@/utils/constants";

const SearchParamsSchema = z
  .object({
    redirect: z.string(),
  })
  .partial();

export const Route = createFileRoute("/_unauthenticated")({
  validateSearch: SearchParamsSchema,
  beforeLoad: async ({
    context: {
      authenticationData: { isAuthenticated },
    },
    search,
  }) => {
    if (isAuthenticated) throw redirect({ to: search.redirect ?? HOME_ROUTE });
  },
  component: UnauthenticatedPathlessLayout,
});

function UnauthenticatedPathlessLayout() {
  return <Outlet />;
}
