import { useSuspenseQuery } from "@tanstack/react-query";
import type { Course } from "../../../types/SchemaTypes";
import { courseQueryOptions } from "../machines/courseMachine";

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
