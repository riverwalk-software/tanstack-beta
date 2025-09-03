import { NonEmptyString, NonEmptyTrimmedString } from "@prelude"
import { Schema } from "effect"
import { COOKIE } from "packages/cookies/src/constants"

const CookieName = NonEmptyTrimmedString.pipe(
  Schema.maxLength(COOKIE.MAX_LENGTH.name),
  Schema.pattern(COOKIE.REGEX.name),
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
