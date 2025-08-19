import type { FileRouteTypes } from "@/routeTree.gen.ts";

export const EVENTUAL_CONSISTENCY_DELAY_S = 60 * 1;
// export const IMGGEN_URL = "https://imggen.andrei-023.workers.dev";
export const MAXIMUM_PASSWORD_LENGTH = 64;
export const MINIMUM_PASSWORD_LENGTH = 16;
export const AUTH_COOKIE_PREFIX = "auth" as const;
export const AUTH_COOKIE_NAMES = [
  "session_token",
  "session_data",
  "dont_remember",
] as const;
export const PRIVACY_POLICY_LINK =
  "https://rockthejvm.com/policies/privacy" as const;
export const TERMS_OF_USE_LINK =
  "https://rockthejvm.com/policies/terms" as const;
export const SITE_NAME = "Rock the JVM" as const;
export const SITE_DOMAIN = "tanstack-beta.andrei-023.workers.dev" as const;
export const SITE_URL = `https://${SITE_DOMAIN}` as const;
// export const SNAPGEN_PATH = "/api/snapgen";
export const TEST_USER = {
  email: "andrei@riverwalk.dev",
  password: "andrei@riverwalk.dev",
} as const;
export const HOME_ROUTE: RouteType = "/" as const;
export const AUTH_CALLBACK_ROUTE: RouteType = "/signin" as const;
type RouteType = FileRouteTypes["fullPaths"];
