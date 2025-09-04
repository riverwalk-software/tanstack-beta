import { Duration } from "effect"

const RANDOM_SEED = 0 as const
const EVENTUAL_CONSISTENCY_DELAY = Duration.minutes(1)
const AUTH_COOKIE_PREFIX = "auth" as const
const IS_DEV = import.meta.env?.DEV || process.env["NODE_ENV"] === "development"

export { RANDOM_SEED, EVENTUAL_CONSISTENCY_DELAY, AUTH_COOKIE_PREFIX, IS_DEV }
