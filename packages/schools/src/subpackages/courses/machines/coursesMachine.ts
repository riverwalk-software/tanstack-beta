import { queryOptions } from "@tanstack/react-query"
import { getCoursesFn } from "../logic/coursesLogic"

export const coursesQueryOptions = ({ schoolSlug }: { schoolSlug: string }) =>
  queryOptions({
    queryKey: ["courses", { schoolSlug }],
    queryFn: () => getCoursesFn({ data: { schoolSlug } }),
  })
