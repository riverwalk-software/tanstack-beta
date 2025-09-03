/**
 * @vitest-environment jsdom
 */

import { Arbitrary, Option } from "effect"
import { assert, property } from "effect/FastCheck"
import { CookieDomain } from "packages/cookies/src/domain/cookie-domain"
import { getCookie, setCookie } from "packages/cookies/src/state/cookie-state"
import { describe, it } from "vitest"

const CookieDomainArbitrary = Arbitrary.make(CookieDomain)

describe("cookieState", () => {
  it("consistency", () => {
    assert(
      property(CookieDomainArbitrary, ({ name, value }) => {
        setCookie({ name, value })
        const stored = getCookie(name)
        return Option.match(stored, {
          onNone: () => false,
          onSome: v => v === value,
        })
      }),
    )
  })
})
