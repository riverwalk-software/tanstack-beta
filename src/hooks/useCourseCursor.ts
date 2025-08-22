import { useMemo } from "react";
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

  const previousCourse = courseListZipper.left.peek();
  const currentCourse = courseListZipper.focus;
  const nextCourse = courseListZipper.right.peek();

  return {
    previous:
      previousCourse === undefined
        ? undefined
        : {
            course: previousCourse,
            slugs: {
              schoolSlug,
              courseSlug: previousCourse.slug,
            },
          },
    current: {
      course: currentCourse,
      slugs: {
        schoolSlug,
        courseSlug: currentCourse.slug,
      },
    },
    next:
      nextCourse === undefined
        ? undefined
        : {
            course: nextCourse,
            slugs: {
              schoolSlug,
              courseSlug: nextCourse.slug,
            },
          },
    courses,
  };
};

interface Return {
  previous: CourseAndSlugs | undefined;
  current: CourseAndSlugs;
  next: CourseAndSlugs | undefined;
  courses: Course[];
}

interface CourseAndSlugs {
  course: Course;
  slugs: Omit<UserStoreSlugs, "chapterSlug" | "lectureSlug">;
}
