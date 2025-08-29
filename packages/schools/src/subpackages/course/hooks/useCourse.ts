import { useSuspenseQuery } from "@tanstack/react-query"
import type { Course } from "../../../types/SchemaTypes"
import { courseQueryOptions } from "../machines/courseMachine"
import type { GetCourse } from "../types/GetCourse"

/**
 * React hook to fetch a single course by school and course slug.
 *
 * Returns the course object for the specified school and course.
 *
 * @param {Object} params - Parameters for fetching the course.
 * @param {string} params.schoolSlug - The slug of the school.
 * @param {string} params.courseSlug - The slug of the course.
 * @returns {{ course: Course }} An object containing the course.
 *
 * @example
 * const { course } = useCourse({ schoolSlug: "harvard", courseSlug: "cs50" });
 */
export const useCourse = ({
  schoolSlug,
  courseSlug,
}: GetCourse): { course: Course } => {
  const { data: course } = useSuspenseQuery(
    courseQueryOptions({ schoolSlug, courseSlug }),
  )
  return { course }
}
