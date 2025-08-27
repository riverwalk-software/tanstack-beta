import { match, P } from "ts-pattern"
import { flatten } from "../typeclasses/functors/Monad"
import type { List } from "../types/lists/list"
import type { Natural } from "../types/numbers/naturals/Natural"
import { pipe } from "./combinators"

export const replicate =
  <A>(n: Natural) =>
  (x: A): List<A> =>
    Array.from({ length: n }, () => x)

export const intersperse =
  <A>(delimiter: A) =>
  (xs: List<A>): List<A> =>
    match(xs)
      .returnType<List<A>>()
      .when(
        xs => xs.length === 0,
        () => [],
      )
      .otherwise(([head, ...tail]) => [head, ...prependToAll(delimiter)(tail)])

const prependToAll =
  <A>(delimiter: A) =>
  (xs: List<A>): List<A> =>
    match(xs)
      .returnType<List<A>>()
      .with(
        P._,
        xs => xs.length === 0,
        () => [],
      )
      .otherwise(([head, ...tail]) => [
        delimiter,
        head,
        ...prependToAll(delimiter)(tail),
      ])

export const intercalateList =
  <A>(delimiter: A[]) =>
  (xss: List<A>[]): List<A> =>
    pipe(xss, intersperse(delimiter), flatten)

export const intercalate =
  (delimiter: string) =>
  (strings: readonly string[]): string =>
    strings.join(delimiter)
