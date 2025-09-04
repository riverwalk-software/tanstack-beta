import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { auth } from "@/lib/auth"

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({
    context: { authenticationData },
    location,
  }): Promise<{ sessionData: typeof auth.$Infer.Session }> => {
    if (authenticationData === null) {
      throw redirect({
        to: "/sign-in",
      })
    }

    return Promise.resolve({ sessionData: authenticationData })
  },
  component: AuthenticatedPathlessLayout,
})

function AuthenticatedPathlessLayout() {
  return <Outlet />
}
