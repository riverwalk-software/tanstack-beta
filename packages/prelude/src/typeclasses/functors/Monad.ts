import { pipe } from "../../logic/combinators"
import type { List } from "../../types/lists/list"
import { mapList } from "./Functor"

export const flatten = <A>(xss: readonly List<A>[]): List<A> => xss.flat()

export const flatMap =
  <A, B>(f: (a: A) => readonly B[]) =>
  (xs: List<A>): readonly B[] =>
    pipe(xs, mapList(f), flatten)
