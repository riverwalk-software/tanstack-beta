/**
 * @vitest-environment jsdom
 */

import { Arbitrary, Option } from "effect"
import { assert, property } from "effect/FastCheck"
import { constant, pipe } from "effect/Function"
import { Cookie } from "packages/cookies/src/core/cookie-core"
import { getCookie, setCookie } from "packages/cookies/src/state/cookie-state"
import { describe, it } from "vitest"

const CookieArbitrary = Arbitrary.make(Cookie)

describe("cookieState", () => {
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
})
