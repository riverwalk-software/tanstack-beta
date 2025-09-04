import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { getWebRequest } from "@tanstack/react-start/server"
import { Context, Effect, pipe } from "effect"
import { auth } from "@/lib/auth"

type AuthenticationData = SessionData | null
type SessionData = typeof auth.$Infer.Session

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

// const getAuthenticationDataMw = createMiddleware({
//   type: "function",
// }).server(async ({ next }) => {
//   const { headers } = getWebRequest()
//   const maybeSessionData = await auth.api.getSession({ headers })
//   const authenticationData = match(maybeSessionData)
//     .with(
//       P.nullish,
//       sessionData =>
//         ({
//           isAuthenticated: false,
//           sessionData,
//         }) as const,
//     )
//     .otherwise(
//       sessionData =>
//         ({
//           isAuthenticated: true,
//           sessionData,
//         }) as const,
//     )
//   return next<{ authenticationData: AuthenticationData }>({
//     context: {
//       authenticationData,
//     },
//   })
// })

// const getSessionDataMw = createMiddleware({ type: "function" })
//   .middleware([getAuthenticationDataMw])
//   .server(
//     ({
//       next,
//       context: {
//         authenticationData: { isAuthenticated, sessionData },
//       },
//     }) => {
//       if (!isAuthenticated) {
//         throw new UNAUTHENTICATED()
//       }
//       return next<{ sessionData: SessionData }>({
//         context: {
//           sessionData,
//         },
//       })
//     },
//   )

// const getSessionDataServerMw = createMiddleware({
//   type: "request",
// }).server(async ({ next, request: { headers } }) => {
//   const sessionData = await auth.api.getSession({ headers })
//   if (!sessionData) {
//     throw new UNAUTHENTICATED()
//   }
//   return next<{ sessionData: SessionData }>({
//     context: {
//       sessionData,
//     },
//   })
// })

// class SessionDataService extends Context.Tag("SessionDataService")<
//   SessionDataService,
//   SessionData
// >() {}

// class AccessTokenDataService extends Context.Tag("AccessTokenDataService")<
//   AccessTokenDataService,
//   AccessTokenData
// >() {}
// interface AccessTokenData {
//   maybeAccessToken: string | undefined
//   acceptedScopes: string[]
// }

// const getAccessTokenDataMw = createMiddleware({ type: "function" })
//   .middleware([getSessionDataMw])
//   .server(
//     async ({
//       next,
//       context: {
//         sessionData: { user },
//       },
//     }) => {
//       const { accessToken, scopes: acceptedScopes } =
//         await auth.api.getAccessToken({
//           body: {
//             providerId: "google",
//             userId: user.id,
//           },
//         })
//       return next<{ accessTokenData: AccessTokenData }>({
//         context: {
//           accessTokenData: {
//             maybeAccessToken: accessToken,
//             acceptedScopes,
//           },
//         },
//       })
//     },
//   )

export { authenticationDataQueryOptions, type AuthenticationData }
