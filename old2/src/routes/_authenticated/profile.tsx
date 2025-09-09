import {
  ChangeEmailForm,
  ChangePasswordForm,
  CreateOrganizationForm,
} from "@authentication"
import { Button } from "@components"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/_authenticated/profile")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-background flex min-h-svh items-center justify-center gap-68 p-6 md:p-10">
      <ChangeEmailForm />
      <ChangePasswordForm />
      <CreateOrganizationForm />
      <PolarPortal />
    </div>
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
