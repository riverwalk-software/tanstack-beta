import type { List } from "../../types/lists/list"

export const combineMultiply =
  <A, B>(f: List<(a: A) => B>) =>
  (xs: List<A>): B[] =>
    f.flatMap(f => xs.map(f))
