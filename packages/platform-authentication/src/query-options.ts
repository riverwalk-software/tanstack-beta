const queryKey = ["authenticationData"] as const
// type SessionData = typeof authClient.$Infer.Session
// type AuthenticationData = SessionData | null

// class AuthenticationService extends Context.Tag("AuthenticationService")<
//   AuthenticationService,
//   { readonly data: (headers: Headers) => Effect.Effect<AuthenticationData> }
// >() {}

// const getAuthenticationDataFn = createServerFn().handler(
//   (): Promise<AuthenticationData> => {
//     const program = Effect.gen(function* () {
//       const { headers } = getWebRequest()
//       const authenticationData = yield* AuthenticationService
//       return yield* authenticationData.data(headers)
//     })
//     const runnable = pipe(program, AuthenticationDataLive)
//     return Effect.runPromise(runnable)
//   },
// )

// const authenticationDataQueryOptions = queryOptions({
//   queryKey,
//   queryFn: getAuthenticationDataFn,
//   staleTime: Infinity,
//   gcTime: Infinity,
//   subscribed: false,
// })

export { queryKey }
