import { match } from "ts-pattern"
import type { List } from "../../types/lists/list"
import type { Option } from "../../types/Option"

export const mapList =
  <A, B>(f: (a: A) => B) =>
  (xs: List<A>): List<B> =>
    xs.map(f)

// export const mapString =
//   <A>(f: (a: string) => A) =>
//   (s: string): string =>

export const mapOption =
  <A, B>(f: (a: A) => B) =>
  (maybeX: Option<A>): Option<B> =>
    match(maybeX)
      .returnType<Option<B>>()
      .with({ _tag: "None" }, () => ({ _tag: "None" }))
      .otherwise(({ value }) => ({
        _tag: "Some",
        value: f(value),
      }))
