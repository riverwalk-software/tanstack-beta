import type { Constrain } from "@tanstack/react-router";
import {
  type AnyFunctionMiddleware,
  createMiddleware,
  createServerFn,
} from "@tanstack/react-start";
import { match } from "ts-pattern";
import { getSessionDataMw } from "./authentication";
import { UNAUTHORIZED } from "./errors";

export const isAuthorizedMw = (requiredRole: Role) =>
  match(requiredRole)
    .with("guest", () =>
      unauthenticatedMw.server(async ({ next }) => {
        return next();
      }),
    )
    .with("authenticated", () =>
      authenticatedMw.server(async ({ next, context: { sessionData } }) => {
        return next({
          context: {
            sessionData,
          },
        });
      }),
    )
    .with("courseOwner", () =>
      authenticatedMw.server(
        async ({ next, context: { sessionData } }) =>
          await next({
            context: {
              sessionData,
            },
          }),
      ),
    )
    .with("admin", () =>
      authenticatedMw.server(async ({ next, context: { sessionData } }) => {
        throw new UNAUTHORIZED();
        // return next({
        //   context: {
        //     sessionData,
        //   },
        // });
      }),
    )
    .exhaustive();

type Role = "guest" | "authenticated" | "courseOwner" | "admin";

const unauthenticatedMw = createMiddleware({
  type: "function",
});

const authenticatedMw = createMiddleware({
  type: "function",
}).middleware([getSessionDataMw]);

const myCreateServerFn = <
  TNewMiddlewares extends readonly AnyFunctionMiddleware[],
>({
  requiredRole,
  method = "GET",
  middlewares = [],
}: {
  requiredRole: Role;
  method?: "GET" | "POST";
  middlewares?: Constrain<TNewMiddlewares, readonly AnyFunctionMiddleware[]>;
}) =>
  createServerFn({ method }).middleware([
    isAuthorizedMw(requiredRole),
    ...middlewares,
  ]);

myCreateServerFn({ requiredRole: "authenticated" }).handler(async () => {});
