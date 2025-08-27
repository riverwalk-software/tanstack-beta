import type { NonZeroReal } from "../../types/numbers/reals/NonZeroReal"
import type { Real } from "../../types/numbers/reals/Real"

export const divide =
  (dividend: Real) =>
  (divisor: NonZeroReal): Real =>
    dividend / divisor
