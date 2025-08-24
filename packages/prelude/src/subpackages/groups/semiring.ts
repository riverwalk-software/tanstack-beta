import { match } from "ts-pattern";

export function combine<A>(
  xs: readonly A[],
): (ys: readonly A[]) => readonly A[];
export function combine(xs: string): (ys: string) => string;
export function combine<A>(
  xs: readonly A[] | string,
): ((ys: readonly A[]) => readonly A[]) | ((ys: string) => string) {
  return match(xs)
    .when(
      (xs): xs is readonly A[] => Array.isArray(xs),
      (xs) => (ys: readonly A[]) => [...xs, ...ys],
    )
    .otherwise((xs) => (ys: string) => xs + ys);
}
