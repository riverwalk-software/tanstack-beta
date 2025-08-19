import { useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { match, P } from "ts-pattern";
import * as ListZipper from "@/utils/listZipper";
import {
  type Chapter, type Lecture,
  useCourse
} from "@/utils/schools";
import type { UserStoreSlugs } from "@/utils/userStore";

export const useLectureCursor = (): Return => {
  const slugs = useParams({
    from: "/_authenticated/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug/",
  });
  const {
    course: { chapters },
  } = useCourse(slugs);
  const { chapterSlug, lectureSlug } = slugs;
  const currentChapterIndex = chapters.findIndex(
    (chapter) => chapter.slug === chapterSlug,
  );
  const chapterListZipper = useMemo(
    () => ListZipper.fromArrayAt(chapters, currentChapterIndex)!,
    [chapters, currentChapterIndex],
  );
  const currentLectureIndex = chapterListZipper.focus.lectures.findIndex(
    (lecture) => lecture.slug === lectureSlug,
  );
  const lectureListZipper = ListZipper.fromArrayAt(
    chapterListZipper.focus.lectures,
    currentLectureIndex,
  )!;
  const previousChapterAndLecture = match({
    previousLecture: lectureListZipper.left.peek(),
    previousChapter: chapterListZipper.left.peek(),
  })
    .returnType<ChapterAndLecture | undefined>()
    .with(
      { previousLecture: P.nonNullable, previousChapter: P._ },
      ({ previousLecture }) => ({
        lecture: previousLecture,
        chapter: chapterListZipper.focus,
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
        lecture: previousChapter.lectures[previousChapter.lectures.length - 1],
        chapter: previousChapter,
      }),
    )
    .otherwise(() => undefined);

  const nextChapterAndLecture = match({
    nextLecture: lectureListZipper.right.peek(),
    nextChapter: chapterListZipper.right.peek(),
  })
    .returnType<ChapterAndLecture | undefined>()
    .with(
      { nextLecture: P.nonNullable, nextChapter: P._ },
      ({ nextLecture }) => ({
        lecture: nextLecture,
        chapter: chapterListZipper.focus,
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
    previous:
      previousChapterAndLecture === undefined
        ? undefined
        : {
            ...previousChapterAndLecture,
            slugs: {
              ...slugs,
              chapterSlug: previousChapterAndLecture.chapter.slug,
              lectureSlug: previousChapterAndLecture.lecture.slug,
            },
          },
    current: {
      chapter: chapterListZipper.focus,
      lecture: lectureListZipper.focus,
      slugs,
    },
    next:
      nextChapterAndLecture === undefined
        ? undefined
        : {
            ...nextChapterAndLecture,
            slugs: {
              ...slugs,
              chapterSlug: nextChapterAndLecture.chapter.slug,
              lectureSlug: nextChapterAndLecture.lecture.slug,
            },
          },
  } satisfies State;
  const mutations = {} satisfies Mutations;
  return { ...state, ...mutations };
};

interface State {
  previous: CourseCursor | undefined;
  current: CourseCursor;
  next: CourseCursor | undefined;
}
interface Mutations {}
interface Return extends State, Mutations {}

interface ChapterAndLecture {
  chapter: Chapter;
  lecture: Lecture;
}

interface CourseCursor extends ChapterAndLecture {
  slugs: UserStoreSlugs;
}
