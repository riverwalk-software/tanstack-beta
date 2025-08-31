import { createMiddleware } from "@tanstack/react-start"
import { Match, Schema } from "effect"
import { getCustomerStateFn } from "../routes/_authenticated"
import { auth } from "./auth"
import { getSessionDataMw } from "./authentication"
import { UNAUTHORIZED } from "./errors"

const AuthorizationRole = Schema.Literal(
  "GUEST",
  "AUTHENTICATED",
  "COURSE_OWNER",
  "ADMIN",
)
export type AuthorizationRole = typeof AuthorizationRole.Type

const unauthenticatedMw: any = createMiddleware({
  type: "function",
})

const authenticatedMw = createMiddleware({
  type: "function",
}).middleware([getSessionDataMw])

export const isAuthorizedMw = (requiredRole: AuthorizationRole) =>
  Match.type<AuthorizationRole>().pipe(
    Match.when("GUEST", () =>
      unauthenticatedMw.server(({ next }) => {
        return next()
      }),
    ),
    Match.when("AUTHENTICATED", () =>
      authenticatedMw.server(({ next, context: { sessionData } }) => {
        return next({
          context: {
            sessionData,
          },
        })
      }),
    ),
    Match.when("COURSE_OWNER", () => {
      return authenticatedMw.server(
        async ({ next, context: { sessionData } }) => {
          const customerState = await getCustomerStateFn()
          const { activeSubscriptions, grantedBenefits } = customerState
          const orders = auth.api.orders()
          const webhooks = auth.api.polarWebhooks()
          return next({
            context: {
              sessionData,
            },
          })
        },
      )
    }),
    Match.when("ADMIN", () => {
      return authenticatedMw.server(() => {
        throw new UNAUTHORIZED()
        // return next({
        //   context: {
        //     sessionData,
        //   },
        // })
      })
    }),
    Match.exhaustive,
  )

//   .with("admin", () =>
//     authenticatedMw.server(({ next, context: { sessionData } }) => {
//       throw new UNAUTHORIZED()
//       // return next({
//       //   context: {
//       //     sessionData,
//       //   },
//       // });
//     }),
//   )
//   .exhaustive()

// const myCreateServerFn = <
//   TNewMiddlewares extends readonly AnyFunctionMiddleware[],
// >({
//   requiredRole,
//   method = "GET",
//   middlewares = [],
// }: {
//   requiredRole: Role
//   method?: "GET" | "POST"
//   middlewares?: Constrain<TNewMiddlewares, readonly AnyFunctionMiddleware[]>
// }) =>
//   createServerFn({ method }).middleware([
//     isAuthorizedMw(requiredRole),
//     ...middlewares,
//   ])

// myCreateServerFn({ requiredRole: "authenticated" }).handler(() => {})
