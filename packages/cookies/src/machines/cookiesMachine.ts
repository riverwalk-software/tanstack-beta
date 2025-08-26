import Cookies from "js-cookie"
import { DEFAULT_COOKIE_OPTIONS } from "../constants/DEFAULT_COOKIE_OPTIONS"

export const cookies = Cookies.withAttributes(DEFAULT_COOKIE_OPTIONS)
