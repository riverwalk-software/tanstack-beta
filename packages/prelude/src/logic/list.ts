import { match, P } from "ts-pattern";
import { flatten } from "../subpackages/functors/monad";
import { pipe } from "./combinators";

export const replicate =
  <A>(n: number) =>
  (x: A): readonly A[] =>
    match(n)
      .returnType<readonly A[]>()
      .when(
        (n) => n >= 0,
        () => Array.from({ length: n }, () => x),
      )
      .otherwise(() => []);

export const intersperse =
  <A>(delimiter: A) =>
  (xs: readonly A[]): readonly A[] =>
    match(xs)
      .returnType<readonly A[]>()
      .when(
        (xs) => xs.length === 0,
        () => [],
      )
      .otherwise(([head, ...tail]) => [head, ...prependToAll(delimiter)(tail)]);

const prependToAll =
  <A>(delimiter: A) =>
  (xs: readonly A[]): readonly A[] =>
    match(xs)
      .returnType<readonly A[]>()
      .with(
        P._,
        (xs) => xs.length === 0,
        () => [],
      )
      .otherwise(([head, ...tail]) => [
        delimiter,
        head,
        ...prependToAll(delimiter)(tail),
      ]);

export const intercalateList =
  <A>(delimiter: A[]) =>
  (xss: readonly A[][]): readonly A[] =>
    pipe(xss, intersperse(delimiter), flatten);

export const intercalate =
  (delimiter: string) =>
  (strings: readonly string[]): string =>
    strings.join(delimiter);
