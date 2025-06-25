import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { sessionDataAtom } from "@/utils/authentication";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context: { isAuthenticated }, location }) => {
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
  useAtomValue(sessionDataAtom); // Required to rerender on session change
  return <Outlet />;
}
