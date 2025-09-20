import { Button } from "@repo/platform-ui"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <Button>Hello</Button>
}
