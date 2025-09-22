import { Button } from "@repo/platform-ui"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getCloudflareBindings } from "#lib/cloudflare.js"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

const memeFn = createServerFn().handler(async () => {
  const { SESSION_STORE } = getCloudflareBindings()
  await SESSION_STORE.put("MYTEST", "HELLO WORLD")
  const result = await SESSION_STORE.get("MYTEST")
  return result
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
