import { useSuspenseQuery } from "@tanstack/react-query";
import { courseQueryOptions } from "../machines/courseMachine";
import type { Course } from "../types/SchemaTypes";

export const useCourse = ({
  schoolSlug,
  courseSlug,
}: {
  schoolSlug: string;
  courseSlug: string;
}): { course: Course } => {
  const { data: course } = useSuspenseQuery(
    courseQueryOptions({ schoolSlug, courseSlug }),
  );
  return { course };
};
