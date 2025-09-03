import { Option, pipe, Schema } from "effect"
import Cookies from "js-cookie"
import { DEFAULT_COOKIE_OPTIONS } from "packages/cookies/src/constants"
import {
  CookieDomain,
  CookieName,
  CookieValue,
} from "packages/cookies/src/domain/cookie-domain"

const cookies = Cookies.withAttributes(DEFAULT_COOKIE_OPTIONS)

const getCookie = (name: CookieName): Option.Option<CookieValue> =>
  pipe(
    cookies.get(name),
    Option.fromNullable,
    Option.map(Schema.decodeSync(CookieValue)),
  )

const setCookie = ({ name, value }: CookieDomain): void => {
  cookies.set(name, value)
}

export { getCookie, setCookie }
