import type { List } from "@prelude"
import { queryOptions } from "@tanstack/react-query"
import { Option, Order, pipe } from "effect"
import { sort } from "effect/Array"
import { getSchoolsFn } from "../logic/schoolsLogic"

export const schoolsQueryOptions = ({
  schoolSlugs: maybeSchoolSlugs,
}: {
  schoolSlugs: Option.Option<List<string>>
}) => {
  const maybeSortedSchoolSlugs = pipe(
    maybeSchoolSlugs,
    Option.map(schoolSlugs => sort(Order.string)(schoolSlugs)),
  )
  return queryOptions({
    queryKey: ["schools", { schoolSlugs: maybeSortedSchoolSlugs }],
    queryFn: () =>
      Option.match(maybeSortedSchoolSlugs, {
        onNone: () => getSchoolsFn({ data: {} }),
        onSome: schoolSlugs => getSchoolsFn({ data: { schoolSlugs } }),
      }),
  })
}
