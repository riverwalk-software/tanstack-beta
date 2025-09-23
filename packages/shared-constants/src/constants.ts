import { Duration } from "effect"

const PRIVACY_POLICY_URL = "https://rockthejvm.com/policies/privacy" as const
const TERMS_OF_USE_URL = "https://rockthejvm.com/policies/terms" as const
const WEBSITE_NAME = "Rock the JVM" as const
const RANDOM_SEED = 0 as const
const EVENTUAL_CONSISTENCY_DELAY = Duration.minutes(1)

export {
  PRIVACY_POLICY_URL,
  TERMS_OF_USE_URL,
  WEBSITE_NAME,
  RANDOM_SEED,
  EVENTUAL_CONSISTENCY_DELAY,
}
