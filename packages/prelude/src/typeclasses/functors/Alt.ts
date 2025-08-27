import { match } from "ts-pattern"
import type { Option } from "../../types/Option"
import { size } from "./Foldable"

export const combinePlus =
  <A>(x: Option<A>) =>
  (y: Option<A>): Option<A> =>
    match(x)
      .with({ _tag: "None" }, () => y)
      .otherwise(() => x)

export const combinePlusList =
  <A>(xs: List<A>) =>
  (ys: List<A>): List<A> =>
    match(size(xs))
      .with(0, () => ys)
      .otherwise(() => xs)
