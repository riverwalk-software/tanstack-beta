import { NonEmptyString, NonEmptyTrimmedString } from "@prelude"
import { Schema } from "effect"
import { COOKIE, RESERVED_COOKIE_NAMES } from "packages/cookies/src/constants"

const CookieName = NonEmptyTrimmedString.pipe(
  Schema.filter(name => !RESERVED_COOKIE_NAMES.test(name), {
    message: () => "Reserved cookie name",
  }),
  Schema.maxLength(COOKIE.MAX_LENGTH.name),
  Schema.pattern(COOKIE.REGEX.name, {
    message: () => "Invalid RFC 6265 cookie name",
  }),
  Schema.brand("CookieName"),
)
type CookieName = typeof CookieName.Type

const CookieValue = NonEmptyString.pipe(
  Schema.maxLength(COOKIE.MAX_LENGTH.value),
  Schema.pattern(COOKIE.REGEX.value),
  Schema.brand("CookieValue"),
)
type CookieValue = typeof CookieValue.Type

class Cookie extends Schema.Class<Cookie>("Cookie")({
  name: CookieName,
  value: CookieValue,
}) {}

export { CookieName, CookieValue, Cookie }
