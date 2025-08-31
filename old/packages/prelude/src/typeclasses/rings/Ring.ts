import type { Real } from "../../types/numbers/reals/Real"

export const subtract =
  (minuend: Real) =>
  (subtrahend: Real): Real =>
    minuend - subtrahend
