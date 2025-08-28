import type { List } from "../../types/lists/list"

export const combineMultiply =
  <A, B>(fs: List<(a: A) => B>) =>
  (xs: List<A>): List<B> =>
    fs.flatMap(f => xs.map(f))
