import { Button } from "@repo/platform-ui"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getCloudflareBindings } from "#lib/cloudflare.js"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

const memeFn = createServerFn().handler(async () => {
  const { SESSION_STORE } = getCloudflareBindings()
  const key = "MYTEST2"
  await SESSION_STORE.delete(key)
})

function RouteComponent() {
  return (
    <Button
      onClick={async () => {
        await memeFn()
      }}
    >
      Break the world
    </Button>
  )
}
