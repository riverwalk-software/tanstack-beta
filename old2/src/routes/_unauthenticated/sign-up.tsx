import { SignUpForm } from "@authentication"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_unauthenticated/sign-up")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
}
