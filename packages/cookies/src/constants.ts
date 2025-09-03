const DEFAULT_COOKIE_OPTIONS = {
  httpOnly: false,
  path: "/",
  sameSite: "lax",
  secure: !import.meta.env.DEV,
} as const

export { DEFAULT_COOKIE_OPTIONS }
