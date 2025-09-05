import { Context } from "effect"

// const isDev =
//   typeof import.meta.env !== "undefined"
//     ? import.meta.env.DEV
//     : process.env["NODE_ENV"] === "development"
let cachedEnv: CloudflareBindings | null

const initDevEnv = async () => {
  const { getPlatformProxy } = await import("wrangler")
  const proxy = await getPlatformProxy()
  cachedEnv = proxy.env as unknown as CloudflareBindings
}

if (isDev) {
  await initDevEnv()
}

export function getCloudflareBindings(): CloudflareBindings {
  if (isDev) {
    if (!cachedEnv) {
      throw new Error(
        "Dev bindings not initialized yet. Call initDevEnv() first.",
      )
    }
    return cachedEnv
  }

  return process.env as unknown as CloudflareBindings
}

export class CloudflareBindingsService extends Context.Tag(
  "CloudflareBindingsService",
)<CloudflareBindingsService, CloudflareBindings>() {}

// export function getDurableObject<
//   T extends Rpc.DurableObjectBranded | undefined,
// >(durableObject: DurableObjectNamespace<T>, name: string) {
//   const id = durableObject.idFromName(name);
//   const stub = durableObject.get(id);
//   return stub;
// }
