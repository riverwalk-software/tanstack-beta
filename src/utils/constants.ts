import type { FileRouteTypes } from "@/routeTree.gen.ts";

export const EVENTUAL_CONSISTENCY_DELAY_S = 60 * 1;
// export const IMGGEN_URL = "https://imggen.andrei-023.workers.dev";
export const MAXIMUM_PASSWORD_LENGTH = 64;
export const MINIMUM_PASSWORD_LENGTH = 16;
export const AUTH_COOKIE_PREFIX = "auth";
export const AUTH_COOKIE_NAMES = [
  "session_token",
  "session_data",
  "dont_remember",
];
export const PRIVACY_POLICY_LINK = "https://rockthejvm.com/policies/privacy";
export const TERMS_OF_USE_LINK = "https://rockthejvm.com/policies/terms";
export const SITE_NAME = "Rock the JVM";
export const SITE_DOMAIN = "tanstack-beta.andrei-023.workers.dev";
export const SITE_URL = `https://${SITE_DOMAIN}`;
// export const SNAPGEN_PATH = "/api/snapgen";
export const TEST_USER = {
  email: "andrei@riverwalk.dev",
  password: "andrei@riverwalk.dev",
};
export const HOME_ROUTE: RouteType = "/";
export const AUTH_CALLBACK_ROUTE: RouteType = "/signin";
type RouteType = FileRouteTypes["fullPaths"];
