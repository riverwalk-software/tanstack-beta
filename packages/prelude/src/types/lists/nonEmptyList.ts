import { match } from "ts-pattern"
import { size } from "../../typeclasses/functors/Foldable"
import type { Option } from "../Option"
import type { List } from "./list"

declare const NonEmptyListBrand: unique symbol
type NonEmptyListBrand = typeof NonEmptyListBrand

export type NonEmptyList<A> = readonly [A, ...List<A>] & {
  readonly _brand: NonEmptyListBrand
}

// export const makeNonEmptyList =
//   <A>(head: A) =>
//   (tail: List<A>): NonEmptyList<A> =>
//     [head, ...tail] as unknown as NonEmptyList<A>

export const makeNonEmptyList = <A>(xs: A): Option<NonEmptyList<A>> =>
  match(size(xs))
    .returnType<Option<NonEmptyList<A>>>()
    .with(0, () => ({ _tag: "None" }))
    .otherwise(() => ({ _tag: "Some", value: xs as NonEmptyList<A> }))

export const isNonEmptyList = <A>(xs: List<A>): xs is NonEmptyList<A> =>
  xs.length > 0

export const head = <A>(xs: NonEmptyList<A>): A => xs[0]
export const tail = <A>(xs: NonEmptyList<A>): List<A> => xs.slice(1)
