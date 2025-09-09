import { IS_DEV } from "@constants"
import { Context, Effect } from "effect"

let cachedEnv: CloudflareBindings | null

// This gets called once at startup when running locally
const initDevEnv = async () => {
  const { getPlatformProxy } = await import("wrangler")
  const proxy = await getPlatformProxy()
  cachedEnv = proxy.env as unknown as CloudflareBindings
}

// Detect if we're already in a Workers/Miniflare runtime (wrangler dev, production worker, etc.).
// In those environments, bindings are injected automatically and we MUST NOT call getPlatformProxy().
const isWorkersLikeRuntime = (): boolean => {
  // WebSocketPair is a good heuristic; also check Miniflare global markers
  return (
    typeof (globalThis as any).WebSocketPair !== "undefined" ||
    (globalThis as any).MINIFLARE === true ||
    (globalThis as any).__MINIFLARE_ENV__ === true
  )
}

if (IS_DEV && !isWorkersLikeRuntime()) {
  try {
    await initDevEnv()
  } catch {
    // Swallow: during build/CLI tools (e.g. better-auth codegen) wrangler proxy isn't available.
    // We'll fall back to process.env (may not have bindings, but avoids crash).
  }
}

/**
 * Will only work when being accessed on the server. CF bindings are not available in the browser.
 * @returns
 */
function getCloudflareBindings(): CloudflareBindings {
  if (IS_DEV) {
    // In a workers-like runtime just use process.env (wrangler/miniflare injects bindings there via nodejs_compat)
    if (isWorkersLikeRuntime()) {
      return process.env as unknown as CloudflareBindings
    }
    if (cachedEnv) {
      return cachedEnv
    }
    // Last resort fallback so libraries importing at build time don't throw hard.
    return process.env as unknown as CloudflareBindings
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

export { Cloudflare, CloudflareLive, getCloudflareBindings }
