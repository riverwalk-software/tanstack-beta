import type { FileRouteTypes } from "@/routeTree.gen.ts";

export const EVENTUAL_CONSISTENCY_DELAY_S = 60 * 1;
// export const IMGGEN_URL = "https://imggen.andrei-023.workers.dev";
export const MAXIMUM_PASSWORD_LENGTH = 64;
export const MINIMUM_PASSWORD_LENGTH = 16;
export const SITE_NAME = "TanStack Beta";
export const SITE_DOMAIN = "tanstack-beta.andrei-023.workers.dev";
export const SITE_URL = `https://${SITE_DOMAIN}`;
// export const SNAPGEN_PATH = "/api/snapgen";
export const TEST_USER = {
  name: "Test User",
  email: "test@email.com",
  password: "passwordpassword",
};
export const HOME_ROUTE: RouteType = "/";
export const AUTH_CALLBACK_ROUTE: RouteType = "/signin";
export type RouteType = FileRouteTypes["fullPaths"];
