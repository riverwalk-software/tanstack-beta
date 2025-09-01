import { FileSystem } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { Effect, Number, Option, pipe, Schema } from "effect"
import { type ReactElement, useCallback, useState } from "react"

const FILE_PATH = "count.txt" as const

const getCount: () => Promise<number> = () => {
  const program = Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const file = yield* fs.readFileString(FILE_PATH, "utf8")
    return pipe(
      file,
      Number.parse,
      Option.getOrElse(() => 0),
    )
  })
  return Effect.runPromise(
    program.pipe(
      Effect.catchTags({
        SystemError: () => Effect.succeed(0),
        BadArgument: () => Effect.succeed(0),
      }),
      Effect.provide(NodeContext.layer),
    ),
  )
}

const getCountFn = createServerFn({
  method: "GET",
}).handler(getCount)

const incrementBy = (addend: number): Promise<void> => {
  const program = Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const augend = yield* Effect.promise(getCount)
    yield* fs.writeFileString(FILE_PATH, `${augend + addend}`)
  })
  return Effect.runPromise(program.pipe(Effect.provide(NodeContext.layer)))
}

const incrementByFn = createServerFn({ method: "POST" })
  .validator(Schema.decodeUnknownSync(Schema.Number))
  .handler(({ data: augend }) => incrementBy(augend))

const Home = (): ReactElement => {
  const router = useRouter()
  const state = Route.useLoaderData()
  const [isPending, setIsPending] = useState(false)
  const onClickMemo = useCallback(async () => {
    setIsPending(true)
    try {
      await incrementByFn({ data: 1 })
      await router.invalidate()
    } finally {
      setIsPending(false)
    }
  }, [router])
  return (
    <button disabled={isPending} onClick={onClickMemo} type="button">
      Add 1 to {state}?
    </button>
  )
}

export const Route = createFileRoute("/")({
  component: Home,
  loader: () => getCountFn(),
})
