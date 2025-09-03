const DEFAULT_COOKIE_OPTIONS = {
  httpOnly: false,
  path: "/",
  sameSite: "lax",
  secure: !import.meta.env.DEV,
} as const
const COOKIE = {
  MAX_LENGTH: {
    name: 50,
    value: 3500,
  },
  REGEX: {
    name: /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/,
    value:
      /^"?[\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]*"?$/,
  },
} as const

export { DEFAULT_COOKIE_OPTIONS, COOKIE }
