import { useMemo } from "react";
import { match, P } from "ts-pattern";
import { type Chapter, type Lecture, useCourse } from "@/lib/schools";
import type { UserStoreSlugs } from "@/lib/userStore";
import * as ListZipper from "@/utils/listZipper";

export const useChapterAndLectureCursor = ({
  slugs,
}: {
  slugs: UserStoreSlugs;
}): Return => {
  const {
    course: { chapters },
  } = useCourse(slugs);
  const { chapterSlug, lectureSlug } = slugs;
  const currentChapterIndex = useMemo(
    () => chapters.findIndex((chapter) => chapter.slug === chapterSlug),
    [chapterSlug, chapters],
  );
  const chapterListZipper = useMemo(
    () => ListZipper.fromArrayAt(chapters, currentChapterIndex)!,
    [chapters, currentChapterIndex],
  );
  const currentLectureIndex = useMemo(
    () =>
      chapterListZipper.focus.lectures.findIndex(
        (lecture) => lecture.slug === lectureSlug,
      ),
    [lectureSlug, chapterListZipper.focus.lectures],
  );
  const lectureListZipper = useMemo(
    () =>
      ListZipper.fromArrayAt(
        chapterListZipper.focus.lectures,
        currentLectureIndex,
      )!,
    [chapterListZipper.focus.lectures, currentLectureIndex],
  );
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

  const previous = useMemo(
    () =>
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
    [previousChapterAndLecture, slugs],
  );
  const current = useMemo(
    () => ({
      chapter: chapterListZipper.focus,
      lecture: lectureListZipper.focus,
      slugs,
    }),
    [chapterListZipper.focus, lectureListZipper.focus, slugs],
  );
  const next = useMemo(
    () =>
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
    [nextChapterAndLecture, slugs],
  );
  return { previous, current, next, chapters };
};

interface ChapterAndLecture {
  chapter: Chapter;
  lecture: Lecture;
}

interface ExtendedChapterAndLecture extends ChapterAndLecture {
  slugs: UserStoreSlugs;
}

interface Return {
  previous: ExtendedChapterAndLecture | undefined;
  current: ExtendedChapterAndLecture;
  next: ExtendedChapterAndLecture | undefined;
  chapters: Chapter[];
}
