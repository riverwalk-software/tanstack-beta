import { useSuspenseQuery } from "@tanstack/react-query";
import { coursesQueryOptions } from "../machines/coursesMachine";
import type { CourseWithFirstChapterAndLecture } from "../types/SchemaTypes";

export const useCourses = ({
  schoolSlug,
}: {
  schoolSlug: string;
}): { courses: CourseWithFirstChapterAndLecture[] } => {
  const { data: courses } = useSuspenseQuery(
    coursesQueryOptions({ schoolSlug }),
  );
  return { courses };
};
