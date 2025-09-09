import { flow } from "effect"

interface Isomorphism<A, B> {
  to: (a: A) => B
  from: (b: B) => A
}

const conjugate =
  <A, B>({ to, from }: Isomorphism<A, B>) =>
  (f: (b: B) => B): ((a: A) => A) =>
    flow(to, f, from)

const mapTo =
  <A, B, C>({ from }: Isomorphism<A, B>) =>
  (f: (a: A) => C): ((b: B) => C) =>
    flow(from, f)

const mapFrom =
  <A, B, C>({ from }: Isomorphism<A, B>) =>
  (f: (c: C) => B): ((c: C) => A) =>
    flow(f, from)

const compose =
  <A, B, C>(ab: Isomorphism<A, B>) =>
  (bc: Isomorphism<B, C>): Isomorphism<A, C> => ({
    to: flow(ab.to, bc.to),
    from: flow(bc.from, ab.from),
  })

const myMap = <A, B, C>(ab: Isomorphism<A, B>) => map
// export interface Bijective<A, B> {
//   to: (a: A) => B
//   from: (b: B) => A
// }

// export const identity = <A>(): Bijective<A, A> => ({
//   to: x => x,
//   from: x => x,
// })

// export const inverse = <A, B>(ab: Bijective<A, B>): Bijective<B, A> => ({
//   to: ab.from,
//   from: ab.to,
// })

// export const compose = <A, B, C>(
//   ab: Bijective<A, B>,
//   bc: Bijective<B, C>,
// ): Bijective<A, C> => ({
//   to: a => bc.to(ab.to(a)),
//   from: c => ab.from(bc.from(c)),
// })

// // Some useful lifts (optional)
// export const array = <A, B>(
//   ab: Bijective<A, B>,
// ): Bijective<readonly A[], readonly B[]> => ({
//   to: as => as.map(ab.to),
//   from: bs => bs.map(ab.from),
// })
