import { queryOptions } from "@tanstack/react-query";
import { getUserCoursesFn } from "../logic/userCoursesLogic";

export const userCoursesQueryOptions = ({ schoolId }: { schoolId: number }) => {
  return queryOptions({
    queryKey: ["userCourses", { schoolId }],
    queryFn: () => getUserCoursesFn({ data: { schoolId } }),
  });
};
