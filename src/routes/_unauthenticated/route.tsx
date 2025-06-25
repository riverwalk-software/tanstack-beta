import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { z } from "zod";
import { sessionDataAtom } from "@/utils/authentication";

const SearchParamsSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/_unauthenticated")({
  validateSearch: SearchParamsSchema,
  beforeLoad: async ({ context: { isAuthenticated }, search }) => {
    if (isAuthenticated) throw redirect({ to: search?.redirect ?? "/" });
  },
  component: UnauthenticatedPathlessLayout,
});

function UnauthenticatedPathlessLayout() {
  useAtomValue(sessionDataAtom); // Required to rerender on session change
  return <Outlet />;
}
