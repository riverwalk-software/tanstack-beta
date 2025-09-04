import { Arbitrary, Effect, Equivalence, Option } from "effect"
import { assert, property } from "effect/FastCheck"
import { constant, pipe } from "effect/Function"
import { Cookie } from "packages/cookies/src/core/cookie-core"
import {
  CookieJar,
  cookieContext,
  getCookie,
  setCookie,
} from "packages/cookies/src/state/cookie-state"
import { beforeEach, describe, it } from "vitest"

const CookieArbitrary = Arbitrary.make(Cookie)

describe("cookieState", () => {
  // (Property frameworks may run examples sequentially inside a single test invocation,
  // but we also isolate between vitest test cases.)
  beforeEach(() => {
    const program = Effect.gen(function* () {
      const cookieJar = yield* CookieJar
      return yield* cookieJar.clear()
    })
    const runnable = Effect.provide(program, cookieContext)
    Effect.runSync(runnable)
  })

  it("absence", () => {
    assert(
      property(CookieArbitrary, ({ name }) =>
        pipe(name, getCookie, Option.isNone),
      ),
    )
  })

  it("consistency", () => {
    assert(
      property(CookieArbitrary, ({ name, value }) =>
        pipe(
          setCookie({ name, value }),
          constant(name),
          getCookie,
          Option.contains(value),
        ),
      ),
    )
  })

  it("idempotency", () => {
    assert(
      property(CookieArbitrary, ({ name, value }) => {
        setCookie({ name, value })
        const result1 = getCookie(name)
        setCookie({ name, value })
        const result2 = getCookie(name)
        return Option.getEquivalence(Equivalence.string)(result1, result2)
      }),
    )
  })
})

// Absence before set
// ∀ fresh name n. get(n) = None
// Idempotence of set
// ∀ c. set(c); set(c); get(c.name) = Some(c.value)
// Overwrite last‑wins
// ∀ c1,c2 same name. set(c1); set(c2); get(name)=Some(c2.value)
// Independence / commutativity for distinct names
// ∀ c1,c2 with c1.name≠c2.name. Order of set(c1), set(c2) doesn’t change each final value.
// Boundary acceptance (optional)
// Names/values at max length still round‑trip.
// Schema preservation (optional lightweight)
// After set, retrieved value still matches pattern (guards against accidental downstream mutation / encoding).
