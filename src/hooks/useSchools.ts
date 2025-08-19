import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { SERVICE_UNAVAILABLE } from "@/utils/errors";
import { type Course, courseQueryOptions } from "@/utils/schools";
import type { UserStoreSlugs } from "@/utils/userStore";
import * as Zipper from "@/utils/zipper";

const useCourseLecturesWithChapters = (slugs: {
  schoolSlug: string;
  courseSlug: string;
}): CourseLectureWithChapter[] => {
  const {
    data: { chapters },
  } = useSuspenseQuery(courseQueryOptions(slugs));
  return chapters.flatMap((chapter) =>
    chapter.lectures.map((lecture) => ({
      chapter,
      lecture,
    })),
  );
};

export const useCourseZipper = (slugs: UserStoreSlugs): Return => {
  const courseLecturesWithChapters = useCourseLecturesWithChapters(slugs);
  const { lectureSlug } = slugs;
  const currentIndex = courseLecturesWithChapters.findIndex(
    (courseLectureWithChapter) =>
      courseLectureWithChapter.lecture.slug === lectureSlug,
  );
  const courseZipper = Zipper.fromArrayAt(
    courseLecturesWithChapters,
    currentIndex,
  );
  if (courseZipper === undefined) throw new SERVICE_UNAVAILABLE();
  const state = {
    previous: courseZipper.left.peek(),
    current: courseZipper.focus,
    next: courseZipper.right.peek(),
  } satisfies State;
  const mutations = {} satisfies Mutations;
  return useMemo(() => ({ ...state, ...mutations }), [state, mutations]);
};

interface State {
  previous: CourseLectureWithChapter | undefined;
  current: CourseLectureWithChapter;
  next: CourseLectureWithChapter | undefined;
}
interface Mutations {}
interface Return extends State, Mutations {}

interface CourseLectureWithChapter {
  chapter: Course["chapters"][number];
  lecture: Course["chapters"][number]["lectures"][number];
}
