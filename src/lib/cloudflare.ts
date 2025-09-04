import { IS_DEV } from "@constants"
import { Context, Effect } from "effect"

let cachedEnv: CloudflareBindings | null

// This gets called once at startup when running locally
const initDevEnv = async () => {
  const { getPlatformProxy } = await import("wrangler")
  const proxy = await getPlatformProxy()
  cachedEnv = proxy.env as unknown as CloudflareBindings
}

if (IS_DEV) {
  await initDevEnv()
}

/**
 * Will only work when being accessed on the server. CF bindings are not available in the browser.
 * @returns
 */
function getCloudflareBindings(): CloudflareBindings {
  if (IS_DEV) {
    if (!cachedEnv) {
      throw new Error(
        "Dev bindings not initialized yet. Call initDevEnv() first.",
      )
    }
    return cachedEnv
  }

  return process.env as unknown as CloudflareBindings
}

class Cloudflare extends Context.Tag("CloudflareService")<
  Cloudflare,
  { readonly bindings: Effect.Effect<CloudflareBindings> }
>() {}

const CloudflareLive = Effect.provideService(Cloudflare, {
  bindings: Effect.sync(getCloudflareBindings),
})

export { Cloudflare, CloudflareLive }
