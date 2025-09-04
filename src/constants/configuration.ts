import { Duration } from "effect"

const RANDOM_SEED = 0 as const
const EVENTUAL_CONSISTENCY_DELAY_S = Duration.seconds(1)

export { RANDOM_SEED, EVENTUAL_CONSISTENCY_DELAY_S }
