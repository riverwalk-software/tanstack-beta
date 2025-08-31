import type { List } from "../../types/lists/list"
import { Natural } from "../../types/numbers/naturals/Natural"

export const foldLeft =
  <A, B>(reducer: (accumulator: B) => (current: A) => B) =>
  (initial: B) =>
  (foldable: List<A>) =>
    foldable.reduce(
      (accumulator, current) => reducer(accumulator)(current),
      initial,
    )

export const foldRight =
  <A, B>(reducer: (current: A) => (accumulator: B) => B) =>
  (initial: B) =>
  (foldable: List<A>) =>
    foldable.reduceRight(
      (accumulator, current) => reducer(current)(accumulator),
      initial,
    )

export const size = <A>(xs: List<A>): Natural => Natural(xs.length)

// exists p
// Conceptually: “Does any element satisfy p?” → any p via a fold.

// find p
// Conceptually: fold left-to-right, return the first Just x where p x; result is Maybe a.

// frequency (histogram): needs Foldable (+ a Map/HashMap constraint)
// Conceptually: fold and increment a counter per key/category.
