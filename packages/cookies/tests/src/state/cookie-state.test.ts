/**
 * @vitest-environment jsdom
 */

import { Arbitrary, Option } from "effect"
import { equals } from "effect/Equal"
import { assert, property } from "effect/FastCheck"
import { constant, pipe } from "effect/Function"
import { CookieDomain } from "packages/cookies/src/domain/cookie-domain"
import { getCookie, setCookie } from "packages/cookies/src/state/cookie-state"
import { describe, it } from "vitest"

const CookieDomainArbitrary = Arbitrary.make(CookieDomain)

describe("cookieState", () => {
  it("consistency", () => {
    assert(
      property(CookieDomainArbitrary, ({ name, value }) => {
        setCookie({ name, value })
        return pipe(
          getCookie(name),
          Option.match({
            onNone: constant(false),
            onSome: equals(value),
          }),
        )
      }),
    )
  })
})
