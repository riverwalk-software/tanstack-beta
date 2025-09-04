import { Duration } from "effect"

const RANDOM_SEED = 0 as const
const EVENTUAL_CONSISTENCY_DELAY = Duration.minutes(1)
const AUTH_COOKIE_PREFIX = "auth" as const

export { RANDOM_SEED, EVENTUAL_CONSISTENCY_DELAY, AUTH_COOKIE_PREFIX }
