import { Console, type Context, Effect, pipe } from "effect";
import { SERVICE_UNAVAILABLE } from "../lib/errors";

export const effectRunPromise = <A, E, R>({
  program,
  context,
}: {
  program: Effect.Effect<A, E, R>;
  context: Context.Context<R>;
}): Promise<A> =>
  pipe(
    program,
    Effect.provide(context),
    Effect.catchAllDefect((defect) =>
      pipe(
        Console.error(`Unexpected defect: ${defect}`),
        Effect.andThen(Effect.fail(new SERVICE_UNAVAILABLE())),
      ),
    ),
    Effect.runPromise,
  );
