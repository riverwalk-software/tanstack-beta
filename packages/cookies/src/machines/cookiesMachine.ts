import Cookies from "js-cookie";
import { DEFAULT_COOKIE_OPTIONS } from "@/lib/constants";

export const cookies = Cookies.withAttributes(DEFAULT_COOKIE_OPTIONS);
