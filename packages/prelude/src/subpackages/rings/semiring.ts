import { foldLeft } from "../functors/foldable"

export const zero: number = 0
export const one: number = 1
export const add =
  (augend: number) =>
  (addend: number): number =>
    augend + addend
export const multiply =
  (multiplier: number) =>
  (multiplicand: number): number =>
    multiplier * multiplicand
export const sum = (ns: readonly number[]): number => foldLeft(add)(zero)(ns)
export const product = (ns: readonly number[]): number =>
  foldLeft(multiply)(one)(ns)
