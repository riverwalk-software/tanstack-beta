// import { createServerFn } from "@tanstack/react-start"
// import { getRequest } from "@tanstack/react-start/server"
// import { Effect, pipe } from "effect"
// import { TEST_USER } from "#authentication/constants.js"
// import { auth } from "#lib/auth.js"

// const main = createServerFn({ method: "POST" }).handler((): Promise<void> => {
//   const program = Effect.gen(function* () {
//     const { email, name, password } = TEST_USER
//     const { headers } = getRequest()
//     yield* Effect.promise(() =>
//       auth.api.signUpEmail({
//         headers,
//         body: {
//           email,
//           name,
//           password,
//           rememberMe: true,
//         },
//       }),
//     )
//   })
//   const runnable = pipe(program)
//   return Effect.runPromise(runnable)
// })

// main()
