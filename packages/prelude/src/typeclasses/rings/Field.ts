import type { Integer } from "../../types/numbers/integers/Integer"
import type { NonZeroInteger } from "../../types/numbers/integers/NonZeroInteger"
import { Rational } from "../../types/numbers/rationals/Rational"
import type { NonZeroReal } from "../../types/numbers/reals/NonZeroReal"
import type { Real } from "../../types/numbers/reals/Real"

export const realDivide =
  (dividend: Real) =>
  (divisor: NonZeroReal): Real =>
    dividend / divisor

export const divide = (dividend: Integer, divisor: NonZeroInteger): Rational =>
  new Rational({
    numerator: dividend,
    denominator: divisor,
  })
