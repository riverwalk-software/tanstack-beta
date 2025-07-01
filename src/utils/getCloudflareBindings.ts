import { createMiddleware } from "@tanstack/react-start";
import { Context } from "effect";

let cachedEnv: CloudflareBindings | null = null;

// This gets called once at startup when running locally
const initDevEnv = async () => {
  const { getPlatformProxy } = await import("wrangler");
  const proxy = await getPlatformProxy();
  cachedEnv = proxy.env as unknown as CloudflareBindings;
};

if (import.meta.env.DEV) {
  await initDevEnv();
}

export function getCloudflareBindings(): CloudflareBindings {
  if (import.meta.env.DEV) {
    if (!cachedEnv) {
      throw new Error(
        "Dev bindings not initialized yet. Call initDevEnv() first.",
      );
    }
    return cachedEnv;
  }

  return process.env as unknown as CloudflareBindings;
}

export const getCloudflareBindingsMw = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  if (import.meta.env.DEV) {
    if (cachedEnv === null) {
      throw new Error(
        "Dev bindings not initialized yet. Call initDevEnv() first.",
      );
    }
  }
  return next({
    context: {
      cloudflareBindings: process.env as unknown as CloudflareBindings,
    },
  });
});

export class CloudflareBindingsService extends Context.Tag(
  "CloudflareBindingsService",
)<CloudflareBindingsService, CloudflareBindings>() {}

export function getDurableObject<
  T extends Rpc.DurableObjectBranded | undefined,
>(durableObject: DurableObjectNamespace<T>, name: string) {
  const id = durableObject.idFromName(name);
  const stub = durableObject.get(id);
  return stub;
}
