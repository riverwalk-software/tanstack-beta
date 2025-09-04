import { TEST_USER } from "@constants"
import { Unit } from "@prelude"
import { createServerFn } from "@tanstack/react-start"
import { getWebRequest } from "@tanstack/react-start/server"
import { Effect, pipe } from "effect"
import { auth } from "@/lib/auth"

const main = createServerFn({ method: "POST" }).handler((): Promise<Unit> => {
  const program = Effect.gen(function* () {
    const { email, name, password } = TEST_USER
    const { headers } = getWebRequest()
    yield* Effect.promise(() =>
      auth.api.signUpEmail({
        headers,
        body: {
          email,
          name,
          password,
          rememberMe: true,
        },
      }),
    )
  })
  const runnable = pipe(program)
  return Effect.runPromise(runnable)
})

main()
