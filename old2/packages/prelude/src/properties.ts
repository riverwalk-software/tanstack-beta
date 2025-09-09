// oxlint-disable require-param
// oxlint-disable require-returns
//

import { flow } from "effect"
import { constant, identity } from "effect/Function"

// import { apply } from "effect/Function"

const isEven = (n: number): boolean => {
  const EVEN_DIVISOR = 2
  return n % EVEN_DIVISOR === 0
}

type Reader<R, A> = (r: R) => A

const map =
  <A, B>(f: (a: A) => B) =>
  <R>(fa: Reader<R, A>): Reader<R, B> =>
  (r: R) =>
    f(fa(r))

const of =
  <A>(a: A) =>
  <R>(): Reader<R, A> =>
  (_: R) =>
    a

const apply =
  <R, A, B>(ff: Reader<R, (a: A) => B>) =>
  (fa: Reader<R, A>): Reader<R, B> =>
  (r: R) =>
    ff(r)(fa(r))

const liftA2 =
  <A, B, C>(f: (a: A) => (b: B) => C) =>
  <R>(fa: Reader<R, A>) =>
  (fb: Reader<R, B>): Reader<R, C> =>
    apply<R, B, C>(map<A, (b: B) => C>(f)<R>(fa))(fb)

type Eq<A> = (x: A) => (y: A) => boolean

const id = <A>(x: A) => x
const compose =
  <A, B, C>(g: (b: B) => C) =>
  (f: (a: A) => B) =>
  (a: A) =>
    g(f(a))

// Boolean ops (curried)
const not = (b: boolean) => !b
const or = (p: boolean) => (q: boolean) => p || q

// Tuple Readers
const fst = <A, B>(t: [A, B]) => t[0]
const snd = <A, B>(t: [A, B]) => t[1]

// Lifted boolean combinators for Readers
const notR = <R>(p: Reader<R, boolean>): Reader<R, boolean> => map(not)<R>(p)
const orR =
  <R>(p: Reader<R, boolean>) =>
  (q: Reader<R, boolean>): Reader<R, boolean> =>
    liftA2(or)<R>(p)(q)

// ---------- Predicates ----------

/**
 * 1) involution: f ∘ f = id
 * involution(f)(eqA) :: Reader<A, boolean>
 * Checks:  f(f(x)) == x
 */
const involution =
  <A>(f: (a: A) => A) =>
  (eqA: Eq<A>): Reader<A, boolean> => {
    const ff = compose<A, A, A>(f)(f) // x -> f(f(x))
    const eq = liftA2(eqA)<A>(ff)(id) // x -> eqA(ff(x))(x)
    return eq
  }

/**
 * 2) fixity: fixed point predicate for a given f
 * fixity(f)(eqA) :: Reader<A, boolean>
 * Checks:  f(x) == x
 */
const fixity =
  <A>(f: (a: A) => A) =>
  (eqA: Eq<A>): Reader<A, boolean> =>
    liftA2(eqA)<A>(f)(id)

/**
 * 3) idempotency: f ∘ f = f
 * idempotency(f)(eqA) :: Reader<A, boolean>
 * Checks:  f(f(x)) == f(x)
 */
const idempotency =
  <A>(f: (a: A) => A) =>
  (eqA: Eq<A>): Reader<A, boolean> => {
    const ff = compose<A, A, A>(f)(f) // x -> f(f(x))
    return liftA2(eqA)<A>(ff)(f)
  }

/**
 * 4) determinism: equal inputs imply equal outputs (extensional)
 * determinism(f)(eqA)(eqB) :: Reader<[A, A], boolean>
 * Checks:  eqA(a1)(a2)  ==>  eqB(f(a1))(f(a2))
 * (implemented as  (!eqA(a1,a2)) || eqB(f(a1), f(a2))  )
 */

const meme = (() => {})()

const totality = <A, B>(f: (x: A) => B): ((y: A) => void) =>
  flow(f, constant(meme))
const determinism =
  <A, B>(f: (a: A) => B) =>
  (eqA: Eq<A>) =>
  (eqB: Eq<B>): Reader<[A, A], boolean> => {
    const inEq = liftA2(eqA)<[A, A]>(fst)(snd) // [a1,a2] -> eqA(a1)(a2)
    const outEq = liftA2(eqB)<[A, A]>(map(f)<[A, A]>(fst))(
      // [a1,a2] -> eqB(f(a1))(f(a2))
      map(f)<[A, A]>(snd),
    )
    return orR(notR(inEq))(outEq) // implication
  }

// inverse
// involution f => inverse f f
// commutative
// idempotent
// associative
// bounded
// metaproperty: diagram commutativity/equational laws / confluence

interface Semigroup<A> {
  combine: (x: A) => (y: A) => A
}

interface Monoid<A> extends Semigroup<A> {
  unit: A
}

interface Group<A> extends Monoid<A> {
  inverse: (x: A) => A
}

const meme = flow(5, n => n + 1, identity)

type List<A> = A[]

// const involution = <A>(f: (a: A) => A): ((a: A) => boolean) =>
//   liftA2(equals)(flow(f, f), identity)

// const fixity = <A>(f: (a: A) => A): ((a: A) => boolean) =>
//   liftA2(equals)(f, identity)

// const determinism = <A, B>(f: (a: A) => B): ((a: A) => boolean) =>
//   liftA2(equals)(f, f)

// const idempotency = <A>(f: (a: A) => A): ((a: A) => boolean) =>
//   liftA2(equals)(flow(f, f), f)

export { isEven, involution, fixity, determinism, idempotency }
