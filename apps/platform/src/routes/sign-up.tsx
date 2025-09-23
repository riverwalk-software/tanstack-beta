import { createFileRoute } from "@tanstack/react-router"
import { SignUpForm } from "#authentication/components/sign-up-form.js"

export const Route = createFileRoute("/sign-up")({
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
