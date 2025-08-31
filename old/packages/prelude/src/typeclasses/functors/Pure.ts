import type { List } from "../../types/lists/list"

export const pure = <A>(x: A): List<A> => [x]
