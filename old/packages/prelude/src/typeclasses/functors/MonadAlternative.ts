import { flow, Schema } from "effect"
import type { List } from "../../types/lists/list"
import {
  type Natural,
  NaturalSchema,
} from "../../types/numbers/naturals/Natural"
import { combinePlusList } from "./Alt"
import { foldRight, size } from "./Foldable"
import { flatMap } from "./Monad"
import { empty } from "./Plus"
import { pure } from "./Pure"

export const filter = <A>(p: (a: A) => boolean): ((xs: List<A>) => List<A>) =>
  flatMap(x => (p(x) ? pure(x) : empty()))

export const msum: <A>(xss: List<A>[]) => List<A> = foldRight(combinePlusList)(
  empty(),
)

export const count = // Requires foldable
  <A>(p: (a: A) => boolean): ((xs: List<A>) => Natural) =>
    flow(filter(p), size, Schema.decodeSync(NaturalSchema))

// guard

// sumM :: (Foldable t, MonadPlus m, Num a) => (a -> Bool) -> t a -> m a
// sumM p xs = pure (sum ys)
// where ys = [ x | x <- toList xs, p x ]

// groupBy
