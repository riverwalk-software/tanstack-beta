import { pipe } from "../../logic/combinators"
import { map } from "./functor"

export const flatten = <A>(xss: readonly (readonly A[])[]): readonly A[] =>
  xss.flat()
export const flatMap =
  <A, B>(transformer: (a: A) => readonly B[]) =>
  (xs: readonly A[]): readonly B[] =>
    pipe(xs, map(transformer), flatten)
