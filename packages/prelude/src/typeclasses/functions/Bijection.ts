import { pipe } from "../../logic/combinators"

export type Bijection<A, B> = {
  to: (a: A) => B
  from: (b: B) => A
}

export const conjugate =
  <A, B>({ to, from }: Bijection<A, B>) =>
  (f: (b: B) => B) =>
  (a: A): A =>
    pipe(a, to, f, from)
