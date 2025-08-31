import { Console, type Context, Effect, pipe } from "effect"
import { SERVICE_UNAVAILABLE } from "../lib/errors"

export const effectRunPromise = <A, R>({
  program,
  context,
}: {
  program: Effect.Effect<A, never, R>
  context: Context.Context<R>
}): Promise<A> =>
  pipe(
    program,
    Effect.provide(context),
    Effect.catchAllDefect(defect =>
      pipe(
        Console.error(`Unexpected defect: ${defect}`),
        Effect.andThen(Effect.fail(new SERVICE_UNAVAILABLE())),
      ),
    ),
    Effect.runPromise,
  )

export const effectRunPromise2 = <A>({
  program,
}: {
  program: Effect.Effect<A, never, never>
}): Promise<A> =>
  pipe(
    program,
    Effect.catchAllDefect(defect =>
      pipe(
        Console.error(`Unexpected defect: ${defect}`),
        Effect.andThen(Effect.fail(new SERVICE_UNAVAILABLE())),
      ),
    ),
    Effect.runPromise,
  )
