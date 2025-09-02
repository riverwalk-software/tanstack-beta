import { Button } from "@components"
import { FileSystem } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { Effect, Number, Option, pipe, Schema } from "effect"
import { useCallback, useMemo, useState } from "react"

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

function Home() {
  const router = useRouter()
  const state = Route.useLoaderData()
  const [isPending, setIsPending] = useState(false)
  const onClickMemo = useMemo(
    () =>
      Effect.gen(function* () {
        setIsPending(true)
        yield* Effect.promise(() => incrementByFn({ data: 1 }))
        yield* Effect.promise(() => router.invalidate())
        setIsPending(false)
      }),
    [router],
  )
  const onClick = useCallback(
    () => Effect.runPromise(onClickMemo),
    [onClickMemo],
  )
  return (
    <Button disabled={isPending} onClick={onClick} type="button">
      Add 1 to {state}?
    </Button>
  )
}

export const Route = createFileRoute("/")({
  component: Home,
  loader: () => getCountFn(),
})
