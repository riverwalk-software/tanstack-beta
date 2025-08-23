import { queryOptions } from "@tanstack/react-query";
import { getUserCourseFn } from "../logic/userCourseLogic";

export const userCourseQueryOptions = ({
  schoolId,
  courseId,
}: {
  schoolId: number;
  courseId: number;
}) => {
  return queryOptions({
    queryKey: ["userCourse", { schoolId, courseId }],
    queryFn: () => getUserCourseFn({ data: { schoolId, courseId } }),
  });
};
