import { useSuspenseQuery } from "@tanstack/react-query";
import { coursesQueryOptions } from "../machines/coursesMachine";
import type { Course } from "../types/SchemaTypes";

export const useCourses = ({
  schoolSlug,
}: {
  schoolSlug: string;
}): { courses: Course[] } => {
  const { data: courses } = useSuspenseQuery(
    coursesQueryOptions({ schoolSlug }),
  );
  return { courses };
};
