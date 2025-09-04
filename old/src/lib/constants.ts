import { Schema } from "effect"
import type { FileRouteTypes } from "@/routeTree.gen.ts"

export const PASSWORD_LENGTH = {
  MINIMUM: 16,
  MAXIMUM: 64,
}
export const SLUG_LENGTH = {
  MINIMUM: 1,
  MAXIMUM: 100,
}
export const AUTH_COOKIE_PREFIX = "auth" as const
export const AUTH_COOKIE_NAMES = [
  "session_token",
  "session_data",
  "dont_remember",
] as const
export const PRIVACY_POLICY_LINK =
  "https://rockthejvm.com/policies/privacy" as const
export const TERMS_OF_USE_LINK =
  "https://rockthejvm.com/policies/terms" as const
export const SITE_NAME = "Rock the JVM" as const
export const SITE_DOMAIN = "tanstack-beta.andrei-023.workers.dev" as const
export const SITE_URL = `https://${SITE_DOMAIN}` as const
// export const SNAPGEN_PATH = "/api/snapgen";
export const TEST_USER = {
  name: "Andrei Georgescu",
  email: "andrei@riverwalk.dev",
  password: "andrei@riverwalk.dev",
} as const
export const HOME_ROUTE: RouteType = "/" as const
export const AUTH_CALLBACK_ROUTE: RouteType = "/signin" as const
type RouteType = FileRouteTypes["fullPaths"]
export const VIDEO_LIBRARY_ID = 478_043 as const
export const TEST_PRODUCT_SLUG = "Test-Product" as const
export const SLUG_SCHEMA = Schema.String.pipe(
  Schema.minLength(SLUG_LENGTH.MINIMUM),
  Schema.maxLength(SLUG_LENGTH.MAXIMUM),
)
