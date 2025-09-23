import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { getWebRequest } from "@tanstack/react-start/server"
import { Context, Effect, pipe } from "effect"
import { auth } from "#lib/auth.js"

type SessionData = typeof auth.$Infer.Session
type AuthenticationData = SessionData | null

class AuthenticationService extends Context.Tag("AuthenticationService")<
  AuthenticationService,
  { readonly data: (headers: Headers) => Effect.Effect<AuthenticationData> }
>() {}

const AuthenticationDataLive = Effect.provideService(AuthenticationService, {
  data: (headers: Headers) =>
    Effect.gen(function* () {
      const nullableSessionData = yield* Effect.promise(() =>
        auth.api.getSession({ headers }),
      )
      return nullableSessionData
    }),
})

const getAuthenticationDataFn = createServerFn().handler(
  (): Promise<AuthenticationData> => {
    const program = Effect.gen(function* () {
      const { headers } = getWebRequest()
      const authenticationData = yield* AuthenticationService
      return yield* authenticationData.data(headers)
    })
    const runnable = pipe(program, AuthenticationDataLive)
    return Effect.runPromise(runnable)
  },
)

const authenticationDataQueryOptions = queryOptions({
  queryKey: ["authenticationData"],
  queryFn: getAuthenticationDataFn,
  staleTime: Infinity,
  gcTime: Infinity,
  subscribed: false,
})

export {
  authenticationDataQueryOptions,
  type SessionData,
  type AuthenticationData,
}
