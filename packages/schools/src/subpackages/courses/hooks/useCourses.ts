import type { List } from "@prelude"
import { useSuspenseQuery } from "@tanstack/react-query"
import type { CourseWithFirstChapterAndLecture } from "../../../types/SchemaTypes"
import { coursesQueryOptions } from "../machines/coursesMachine"
import type { GetCourses } from "../types/GetCourses"

/**
 * React hook to fetch a list of courses for a given school.
 *
 * Returns a list of courses, each including its first chapter and lecture.
 *
 * @param {Object} params - Parameters for fetching courses.
 * @param {string} params.schoolSlug - The slug of the school to fetch courses for.
 * @returns {{ courses: List<CourseWithFirstChapterAndLecture> }} An object containing the list of courses.
 *
 * @example
 * const { courses } = useCourses({ schoolSlug: "harvard" });
 */
export const useCourses = ({
  schoolSlug,
}: GetCourses): { courses: List<CourseWithFirstChapterAndLecture> } => {
  const { data: courses } = useSuspenseQuery(
    coursesQueryOptions({ schoolSlug }),
  )
  return { courses }
}
