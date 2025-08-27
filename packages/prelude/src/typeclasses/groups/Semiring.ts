import { match } from "ts-pattern"

export function combine<A>(xs: List<A>): (ys: List<A>) => List<A>
export function combine(xs: string): (ys: string) => string
export function combine<A>(
  xs: List<A> | string,
): ((ys: List<A>) => List<A>) | ((ys: string) => string) {
  return match(xs)
    .returnType<((ys: List<A>) => List<A>) | ((ys: string) => string)>()
    .when(
      (xs): xs is List<A> => Array.isArray(xs),
      xs => (ys: List<A>) => [...xs, ...ys],
    )
    .otherwise(xs => (ys: string) => xs + ys)
}
