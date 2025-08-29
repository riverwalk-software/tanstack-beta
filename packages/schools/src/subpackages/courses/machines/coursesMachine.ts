import { queryOptions } from "@tanstack/react-query"
import { getCoursesFn } from "../logic/coursesLogic"
import type { GetCourses } from "../types/GetCourses"

export const coursesQueryOptions = ({ schoolSlug }: GetCourses) =>
  queryOptions({
    queryKey: ["courses", { schoolSlug }],
    queryFn: () => getCoursesFn({ data: { schoolSlug } }),
  })
