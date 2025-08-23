import { queryOptions } from "@tanstack/react-query";
import { getCourseFn } from "../logic/courseLogic";

export const courseQueryOptions = ({
  schoolSlug,
  courseSlug,
}: {
  schoolSlug: string;
  courseSlug: string;
}) => {
  return queryOptions({
    queryKey: ["course", { schoolSlug, courseSlug }],
    queryFn: () => getCourseFn({ data: { schoolSlug, courseSlug } }),
  });
};
