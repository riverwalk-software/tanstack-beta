import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { match, P } from "ts-pattern";
import { SERVICE_UNAVAILABLE } from "@/utils/errors";
import { type Course, courseQueryOptions } from "@/utils/schools";
import type { UserStoreSlugs } from "@/utils/userStore";
import * as Zipper from "@/utils/zipper";

export const useCourseCursor = (slugs: UserStoreSlugs): Return => {
  const {
    data: { chapters },
  } = useSuspenseQuery(courseQueryOptions(slugs));
  const { chapterSlug, lectureSlug } = slugs;
  const currentChapterIndex = chapters.findIndex(
    (chapter) => chapter.slug === chapterSlug,
  );
  const chapterZipper = useMemo(
    () => Zipper.fromArrayAt(chapters, currentChapterIndex),
    [chapters, currentChapterIndex],
  );
  if (chapterZipper === undefined) throw new SERVICE_UNAVAILABLE();
  const currentLectureIndex = chapterZipper.focus.lectures.findIndex(
    (lecture) => lecture.slug === lectureSlug,
  );
  const lectureZipper = Zipper.fromArrayAt(
    chapterZipper.focus.lectures,
    currentLectureIndex,
  );
  if (lectureZipper === undefined) throw new SERVICE_UNAVAILABLE();

  const getPrevious = () =>
    match({
      previousLecture: lectureZipper.left.peek(),
      previousChapter: chapterZipper.left.peek(),
    })
      .returnType<ChapterAndLecture | undefined>()
      .with(
        { previousLecture: P.nonNullable, previousChapter: P._ },
        ({ previousLecture }) => ({
          lecture: previousLecture,
          chapter: chapterZipper.focus,
        }),
      )
      .with(
        {
          previousLecture: P._,
          previousChapter: P.when(
            (previousChapter): previousChapter is Chapter =>
              previousChapter !== undefined &&
              previousChapter.lectures.length > 0,
          ),
        },
        ({ previousChapter }) => ({
          lecture:
            previousChapter.lectures[previousChapter.lectures.length - 1],
          chapter: previousChapter,
        }),
      )
      .otherwise(() => undefined);

  const getNext = () =>
    match({
      nextLecture: lectureZipper.right.peek(),
      nextChapter: chapterZipper.right.peek(),
    })
      .returnType<ChapterAndLecture | undefined>()
      .with(
        { nextLecture: P.nonNullable, nextChapter: P._ },
        ({ nextLecture }) => ({
          lecture: nextLecture,
          chapter: chapterZipper.focus,
        }),
      )
      .with(
        {
          nextLecture: P._,
          nextChapter: P.when(
            (nextChapter): nextChapter is Chapter =>
              nextChapter !== undefined && nextChapter.lectures.length > 0,
          ),
        },
        ({ nextChapter }) => ({
          lecture: nextChapter.lectures[0],
          chapter: nextChapter,
        }),
      )
      .otherwise(() => undefined);

  const state = {
    previous: getPrevious(),
    current: {
      chapter: chapterZipper.focus,
      lecture: lectureZipper.focus,
    },
    next: getNext(),
  } satisfies State;
  const mutations = {} satisfies Mutations;
  return useMemo(() => ({ ...state, ...mutations }), [state, mutations]);
};

interface State {
  previous: ChapterAndLecture | undefined;
  current: ChapterAndLecture;
  next: ChapterAndLecture | undefined;
}
interface Mutations {}
interface Return extends State, Mutations {}

type Chapter = Course["chapters"][number];
type Lecture = Chapter["lectures"][number];

type ChapterAndLecture = {
  chapter: Chapter;
  lecture: Lecture;
};
