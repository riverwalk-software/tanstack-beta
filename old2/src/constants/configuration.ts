import { Duration } from "effect"

const RANDOM_SEED = 0 as const
const EVENTUAL_CONSISTENCY_DELAY = Duration.minutes(1)
const AUTH_COOKIE_PREFIX = "auth" as const
const IS_DEV =
  import.meta.env?.DEV || process.env["NODE_ENV"] === ("development" as const)
const DEFAULT_COOKIE_OPTIONS = {
  httpOnly: false,
  path: "/",
  sameSite: "lax",
  secure: !IS_DEV,
} as const

export {
  RANDOM_SEED,
  EVENTUAL_CONSISTENCY_DELAY,
  AUTH_COOKIE_PREFIX,
  IS_DEV,
  DEFAULT_COOKIE_OPTIONS,
}
