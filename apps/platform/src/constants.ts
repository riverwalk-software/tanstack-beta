const IS_DEV =
  import.meta.env?.DEV || process.env["NODE_ENV"] === ("development" as const)
const DEFAULT_COOKIE_OPTIONS = {
  httpOnly: false,
  path: "/",
  sameSite: "lax",
  secure: !IS_DEV,
} as const
const AUTH_COOKIE_PREFIX = "auth" as const

export { IS_DEV, DEFAULT_COOKIE_OPTIONS, AUTH_COOKIE_PREFIX }
