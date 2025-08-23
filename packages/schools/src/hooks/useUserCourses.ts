import { useSuspenseQuery } from "@tanstack/react-query";
import { userCoursesQueryOptions } from "../machines/userCoursesMachine";
import type { Course } from "../types/SchemaTypes";

/**
 * Custom React hook to fetch a list of courses based on provided course id.
 *
 * Utilizes the `useSuspenseQuery` hook from `@tanstack/react-query` to perform
 * a suspense-enabled query using the `userCoursesQueryOptions` configuration.
 *
 * @param schoolId - The id of the school to query courses for.
 * @returns An object containing the fetched array of `Course` objects.
 */
export const useUserCourses = ({
  schoolId,
}: {
  schoolId: number;
}): { courses: Course[] } => {
  const { data: courses } = useSuspenseQuery(
    userCoursesQueryOptions({ schoolId }),
  );
  return { courses };
};
