import { useSuspenseQuery } from "@tanstack/react-query";
import { userCourseQueryOptions } from "../machines/userCourseMachine";
import type { Course } from "../types/SchemaTypes";

/**
 * Custom React hook to fetch a user's course data for a specific school and course.
 *
 * Utilizes `useSuspenseQuery` from `@tanstack/react-query` to retrieve course information
 * based on the provided `schoolId` and `courseId`. The hook returns the course data
 * in a suspense-enabled manner, allowing for seamless integration with React Suspense.
 *
 * @param params - An object containing:
 *   @param schoolId - The unique identifier for the school.
 *   @param courseId - The unique identifier for the course.
 * @returns An object containing the fetched `course` of type `Course`.
 *
 * @example
 * ```tsx
 * const { course } = useUserCourse({ schoolId: 1, courseId: 42 });
 * ```
 */
export const useUserCourse = ({
  schoolId,
  courseId,
}: {
  schoolId: number;
  courseId: number;
}): { course: Course } => {
  const { data: course } = useSuspenseQuery(
    userCourseQueryOptions({ schoolId, courseId }),
  );
  return { course };
};
