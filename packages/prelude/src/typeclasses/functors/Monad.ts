import { pipe } from "../../logic/combinators"
import type { List } from "../../types/lists/list"
import { mapList } from "./Functor"

export const flatten = <A>(xss: List<List<A>>): List<A> => xss.flat()

export const flatMap =
  <A, B>(f: (a: A) => List<B>) =>
  (xs: List<A>): List<B> =>
    pipe(xs, mapList(f), flatten)
