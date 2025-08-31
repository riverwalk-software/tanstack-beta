import { Option, pipe } from "effect"
import Cookies from "js-cookie"
import { DEFAULT_COOKIE_OPTIONS } from "../constants/DEFAULT_COOKIE_OPTIONS"

const cookies = Cookies.withAttributes(DEFAULT_COOKIE_OPTIONS)

export const getCookie = (name: string): Option.Option<string> =>
  pipe(cookies.get(name), Option.fromNullable)

export const setCookie =
  (name: string) =>
  (value: string): void => {
    cookies.set(name, value)
  }
