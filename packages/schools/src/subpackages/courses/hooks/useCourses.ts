import { useSuspenseQuery } from "@tanstack/react-query"
import type { CourseWithFirstChapterAndLecture } from "../../../types/SchemaTypes"
import { coursesQueryOptions } from "../machines/coursesMachine"

export const useCourses = ({
  schoolSlug,
}: {
  schoolSlug: string
}): { courses: CourseWithFirstChapterAndLecture[] } => {
  const { data: courses } = useSuspenseQuery(
    coursesQueryOptions({ schoolSlug }),
  )
  return { courses }
}
