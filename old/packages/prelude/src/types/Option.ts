import { match } from "ts-pattern"
import type z from "zod"

export type Option<A> =
  | {
      _tag: "None"
    }
  | {
      _tag: "Some"
      value: A
    }

export type SafeParse = <A extends z.ZodType>(
  schema: A,
) => (x: unknown) => Option<z.infer<A>>

export const safeParse: SafeParse = schema => x => {
  const result = schema.safeParse(x)
  return !result.success
    ? { _tag: "None" }
    : { _tag: "Some", value: result.data }
}

export const isNone = <A>(maybeX: Option<A>): boolean =>
  match(maybeX)
    .with({ _tag: "None" }, () => true)
    .otherwise(() => false)

export const isSome = <A>(maybeX: Option<A>): boolean => !isNone(maybeX)

export const getOrElse =
  <A>(x: A) =>
  (maybeX: Option<A>): A =>
    match(maybeX)
      .with({ _tag: "None" }, () => x)
      .otherwise(({ value }) => value)
