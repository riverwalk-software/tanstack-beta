import { String, Unit } from "@prelude"
import { Context, Effect, Option, Schema } from "effect"
import Cookies from "js-cookie"
import { DEFAULT_COOKIE_OPTIONS } from "packages/cookies/src/constants"
import {
  Cookie,
  CookieName,
  CookieValue,
} from "packages/cookies/src/core/cookie-core"

const cookies = Cookies.withAttributes(DEFAULT_COOKIE_OPTIONS)

class CookieJar extends Context.Tag("CookieJarService")<
  CookieJar,
  {
    readonly get: (name: String) => Effect.Effect<String | undefined>
    readonly set: (name: String, value: String) => Effect.Effect<Unit>
  }
>() {}

const context = Context.empty().pipe(
  Context.add(CookieJar, {
    get: name => Effect.sync(() => cookies.get(name)),
    set: (name, value) => Effect.sync(() => cookies.set(name, value)),
  }),
)

const getCookie = (name: CookieName): Option.Option<CookieValue> => {
  const program = Effect.gen(function* () {
    const cookieJar = yield* CookieJar
    const maybeValue = yield* cookieJar.get(name)
    return Option.fromNullable(maybeValue).pipe(
      Option.map(Schema.decodeSync(CookieValue)),
    )
  })
  const runnable = Effect.provide(program, context)
  return Effect.runSync(runnable)
}

const setCookie = ({ name, value }: Cookie): Unit => {
  const program = Effect.gen(function* () {
    const cookieJar = yield* CookieJar
    return yield* cookieJar.set(name, value)
  })
  const runnable = Effect.provide(program, context)
  Effect.runSync(runnable)
}

export { getCookie, setCookie }
