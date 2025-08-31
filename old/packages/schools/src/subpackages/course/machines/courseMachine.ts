import { queryOptions } from "@tanstack/react-query"
import { getCourseFn } from "../logic/courseLogic"
import type { GetCourse } from "../types/GetCourse"

export const courseQueryOptions = ({ schoolSlug, courseSlug }: GetCourse) =>
  queryOptions({
    queryKey: ["course", { schoolSlug, courseSlug }],
    queryFn: () => getCourseFn({ data: { schoolSlug, courseSlug } }),
  })
