import { Console, Context, Effect } from "effect"

const runEffect = <A, R>({
  program,
  context,
}: {
  program: Effect.Effect<A, never, R>
  context: Context.Context<R>
}): Promise<A> =>
  program.pipe(
    Effect.provide(context),
    Effect.catchAllDefect(defect =>
      Console.error(`Unexpected defect: ${defect}`).pipe(
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
