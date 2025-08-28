import { Integer } from "../../types/numbers/integers/Integer"
import { NonZeroInteger } from "../../types/numbers/integers/NonZeroInteger"
import type { NonZeroRational } from "../../types/numbers/rationals/NonZeroRational"
import { Rational } from "../../types/numbers/rationals/Rational"
import type { NonZeroReal } from "../../types/numbers/reals/NonZeroReal"
import type { Real } from "../../types/numbers/reals/Real"

export const realDivide =
  (dividend: Real) =>
  (divisor: NonZeroReal): Real =>
    dividend / divisor

export const rationalDivide = (
  dividend: Rational,
  divisor: NonZeroRational,
): Rational =>
  new Rational({
    numerator: Integer(dividend.numerator * divisor.denominator),
    denominator: NonZeroInteger(dividend.denominator * divisor.numerator),
  })

export const safeDivide = (
  dividend: Integer,
  divisor: NonZeroInteger,
): Rational =>
  new Rational({
    numerator: dividend,
    denominator: divisor,
  })
