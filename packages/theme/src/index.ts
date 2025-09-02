// oxlint-disable max-classes-per-file
import { Context, Effect } from "effect"

class Random extends Context.Tag("MyRandomService")<
  Random,
  { readonly next: Effect.Effect<number> }
>() {}

class Logger extends Context.Tag("MyLoggerService")<
  Logger,
  { readonly log: (message: string) => Effect.Effect<void> }
>() {}

const program = Effect.gen(function* () {
  const random = yield* Random
  const randomNumber = yield* random.next
  const logger = yield* Logger
  logger.log(`random number: ${randomNumber}`)
})

Effect.runSync(
  program.pipe(
    Effect.provideService(Random, { next: Effect.sync(Math.random) }),
    Effect.provideService(Logger, {
      log: message => Effect.sync(() => console.log(message)),
    }),
  ),
)
