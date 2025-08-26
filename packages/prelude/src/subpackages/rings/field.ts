import { match } from "ts-pattern"

export const divide =
  (dividend: number) =>
  (divisor: number): DivisionResult =>
    match(divisor)
      .returnType<DivisionResult>()
      .with(0, () => ({ _tag: "DIVIDE_BY_ZERO" }))
      .otherwise(() => ({ _tag: "VALID", quotient: dividend / divisor }))

type DivisionResult =
  | { _tag: "VALID"; quotient: number }
  | { _tag: "DIVIDE_BY_ZERO" }
