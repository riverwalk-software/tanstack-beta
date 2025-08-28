import type { List } from "../../types/lists/list"
import type { Real } from "../../types/numbers/reals/Real"
import { foldLeft } from "../functors/Foldable"

export const zero: Real = 0
export const one: Real = 1
export const add =
  (augend: Real) =>
  (addend: Real): Real =>
    augend + addend
export const multiply =
  (multiplier: Real) =>
  (multiplicand: Real): Real =>
    multiplier * multiplicand
export const sum = (ns: List<Real>): Real => foldLeft(add)(zero)(ns)
export const product = (ns: List<Real>): Real => foldLeft(multiply)(one)(ns)
