import { useMemo } from "react";
import { match, P } from "ts-pattern";
import { type Course, useCourses } from "@/lib/schools";
import type { UserStoreSlugs } from "@/lib/userStore";
import * as ListZipper from "@/utils/listZipper";

export const useCourseCursor = ({
  slugs,
}: {
  slugs: UserStoreSlugs;
}): Return => {
  const { schoolSlug } = slugs;
  const { courses } = useCourses(slugs);
  const currentCourseIndex = useMemo(
    () => courses.findIndex((course) => course.slug === slugs.courseSlug),
    [courses, slugs.courseSlug],
  );
  const courseListZipper = useMemo(
    () => ListZipper.fromArrayAt(courses, currentCourseIndex)!,
    [courses, currentCourseIndex],
  );

  const maybePreviousCourse = courseListZipper.left.peek();
  const currentCourse = courseListZipper.focus;
  const maybeNextCourse = courseListZipper.right.peek();

  return {
    maybePrevious: match(maybePreviousCourse)
      .with(P.nullish, () => undefined)
      .otherwise((previousCourse) => ({
        course: previousCourse,
        slugs: {
          schoolSlug,
          courseSlug: previousCourse.slug,
        },
      })),
    current: {
      course: currentCourse,
      slugs: {
        schoolSlug,
        courseSlug: currentCourse.slug,
      },
    },
    maybeNext: match(maybeNextCourse)
      .with(P.nullish, () => undefined)
      .otherwise((nextCourse) => ({
        course: nextCourse,
        slugs: {
          schoolSlug,
          courseSlug: nextCourse.slug,
        },
      })),
    courses,
  };
};

interface Return {
  maybePrevious: MaybeCourseAndSlugs;
  current: CourseAndSlugs;
  maybeNext: MaybeCourseAndSlugs;
  courses: Course[];
}

interface CourseAndSlugs {
  course: Course;
  slugs: Omit<UserStoreSlugs, "chapterSlug" | "lectureSlug">;
}

type MaybeCourseAndSlugs = CourseAndSlugs | undefined;
