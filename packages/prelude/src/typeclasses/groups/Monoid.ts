import { match } from "ts-pattern"

export function neutral<A>(type: "list"): List<A>
export function neutral(type: "string"): string
export function neutral<A>(type: "list" | "string"): List<A> | string {
  return match(type)
    .with("list", () => [])
    .with("string", () => "")
    .exhaustive()
}
