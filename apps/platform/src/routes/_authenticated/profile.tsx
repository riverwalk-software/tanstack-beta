import { Button } from "@repo/platform-ui"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { authClient } from "#lib/auth-client.js"

export const Route = createFileRoute("/_authenticated/profile")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isPending, refetch } = authClient.useSession()
  return (
    <>
      <div>Profile {isPending ? "Loading..." : data?.user.role}</div>
      <Button
        onClick={async () => {
          const { data: sessionData } = await authClient.getSession()
          if (sessionData === null) return
          const { data, error } = await authClient.admin.setRole({
            userId: sessionData.user.id,
            role: "admin",
          })
          if (error) {
            console.error("setRole failed:", error)
            alert(error.message ?? "Role change failed")
            return
          }
          refetch() // pull fresh session so UI updates
        }}
      >
        Set Admin Role
      </Button>
      <Button
        onClick={async () => {
          const { data: sessionData } = await authClient.getSession()
          if (sessionData === null) return
          const { data, error } = await authClient.admin.setRole({
            userId: sessionData.user.id,
            role: "user",
          })
          if (error) {
            console.error("setRole failed:", error)
            alert(error.message ?? "Role change failed")
            return
          }
          refetch() // pull fresh session so UI updates
        }}
      >
        Set User Role
      </Button>
      <PolarPortal />
    </>
  )
}

function PolarPortal() {
  const navigate = useNavigate()
  return (
    <Button
      onClick={async () => {
        const { data, error } = await authClient.customer.portal()
        if (error) {
          toast.error(error.message)
        }
        navigate({ href: data?.url || "/" })
      }}
    >
      Customer Portal
    </Button>
  )
}
