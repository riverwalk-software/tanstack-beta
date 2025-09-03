import { NonEmptyTrimmedString } from "@prelude"
import { Schema } from "effect"

const CookieName = NonEmptyTrimmedString.pipe(Schema.brand("CookieName"))
type CookieName = typeof CookieName.Type

const CookieValue = NonEmptyTrimmedString.pipe(Schema.brand("CookieValue"))
type CookieValue = typeof CookieValue.Type

class CookieDomain extends Schema.Class<CookieDomain>("CookieDomain")({
  name: CookieName,
  value: CookieValue,
}) {}

export { CookieName, CookieValue, CookieDomain }
