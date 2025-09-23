import { createFileRoute } from "@tanstack/react-router"
import { SignInForm } from "#authentication/components/sign-in-form.js"

export const Route = createFileRoute("/_unauthenticated/sign-in")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm />
      </div>
    </div>
  )
}
