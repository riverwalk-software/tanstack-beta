import * as Effect from "effect"
import { Brand, flow } from "effect"
import { refined } from "effect/Brand"
import { size } from "../../typeclasses/functors/Foldable"
import type { List } from "./list"

export type NonEmptyList<A> = readonly [A, ...List<A>] &
  Brand.Brand<"NonEmptyList">

export const NonEmptyList = <A>() =>
  refined<NonEmptyList<A>>(flow(size, Effect.Number.greaterThan(0)), n =>
    Brand.error(`Expected ${n} to be a non-empty List`),
  )

export const isNonEmptyList = <A>(xs: List<A>): xs is NonEmptyList<A> =>
  size(xs) > 0

export const head = <A>(xs: NonEmptyList<A>): A => xs[0]
export const tail = <A>(xs: NonEmptyList<A>): List<A> => xs.slice(1)
