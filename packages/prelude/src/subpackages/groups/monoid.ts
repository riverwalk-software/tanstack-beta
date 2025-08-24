import { match } from "ts-pattern";

export function neutral<A>(type: "list"): readonly A[];
export function neutral(type: "string"): string;
export function neutral<A>(
  type: "list" | "string",
): number | readonly A[] | string {
  return match(type)
    .with("list", () => [])
    .with("string", () => "")
    .exhaustive();
}
