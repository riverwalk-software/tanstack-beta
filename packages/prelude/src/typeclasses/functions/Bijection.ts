import { flow } from "../../logic/combinators"

export type Bijection<A, B> = {
  to: (a: A) => B
  from: (b: B) => A
}

export const conjugate =
  <A, B>({ to, from }: Bijection<A, B>) =>
  (f: (y: B) => B): ((x: A) => A) =>
    flow(to, f, from)
