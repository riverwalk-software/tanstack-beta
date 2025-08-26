import { pipe } from "../../logic/combinators"
import { map } from "./functor"

export const filter =
  <A>(predicate: (a: A) => boolean) =>
  (xs: readonly A[]): readonly A[] =>
    xs.filter(predicate)

export const catMaybes = <A>(maybes: readonly (A | null)[]): readonly A[] =>
  maybes.filter(maybe => maybe !== null)

export const mapMaybe =
  <A, B>(maybeTransformer: (a: A) => B | null) =>
  (xs: readonly A[]): readonly B[] =>
    pipe(xs, map(maybeTransformer), catMaybes)
