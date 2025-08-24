import { match } from "ts-pattern";

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

// export const intersperse =
//   <A>(delimiter: A) =>
//   (xs: readonly A[]): readonly A[] =>
//     match(xs)
//       .returnType<readonly A[]>()
//       .when(
//         (xs) => xs.length === 0,
//         () => [],
//       )
//       .when(
//         (xs) => xs.length === 1,
//         ([head, ..._tail]) => [head],
//       )
//       .otherwise(([head, ...tail]) => [
//         head,
//         delimiter,
//         ...flatMap((x: A) => [x, delimiter])(tail),
//       ]);

// export function intercalate(delimiter: string): (strings: readonly string[])
