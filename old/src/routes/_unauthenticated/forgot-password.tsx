import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_unauthenticated/forgot-password")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_unauthenticated/forgot-password"!</div>
}

// https://www.better-auth.com/docs/authentication/email-password#request-password-reset
