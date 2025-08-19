import { useParams } from "@tanstack/react-router";
import { type Course, useCourses } from "@/utils/schools";
import type { UserStoreSlugs } from "@/utils/userStore";

export const useCourseCursor = (): Return => {
  const slugs = useParams({
    from: "/_authenticated/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug/",
  });
  const { courseSlug } = slugs;
  const { courses } = useCourses(slugs);
  const currentCourse = courses.find((course) => course.slug === courseSlug)!;

  const state = {
    current: {
      course: currentCourse,
      slugs,
    },
    courses,
  } satisfies State;
  const mutations = {} satisfies Mutations;
  return { ...state, ...mutations };
};

interface State {
  current: SchoolCursor;
  courses: Course[];
}
interface Mutations {}
interface Return extends State, Mutations {}

interface SchoolCursor {
  course: Course;
  slugs: UserStoreSlugs;
}
