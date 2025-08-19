import { useParams } from "@tanstack/react-router";
import { createStore } from "@xstate/store";
import { useSelector } from "@xstate/store/react";
import * as Immutable from "immutable";
import { useCallback, useEffect } from "react";
import { type Chapter, useCourse } from "@/utils/schools";
import type { UserStoreSlugs } from "@/utils/userStore";

const compoundSlug = (chapterSlug: string, lectureSlug: string) =>
  `${chapterSlug}-${lectureSlug}`;
const store = createStore({
  context: { openChapters: Immutable.Set<string>() },
  on: {
    open: (context, event: { chapterSlug: string; lectureSlug: string }) => ({
      ...context,
      openChapters: context.openChapters.add(
        compoundSlug(event.chapterSlug, event.lectureSlug),
      ),
    }),
    close: (context, event: { chapterSlug: string; lectureSlug: string }) => ({
      ...context,
      openChapters: context.openChapters.remove(
        compoundSlug(event.chapterSlug, event.lectureSlug),
      ),
    }),
    clear: (context) => ({
      ...context,
      openChapters: context.openChapters.clear(),
    }),
  },
});

export const useChapterCursor = (): Return => {
  const slugs = useParams({
    from: "/_authenticated/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug/",
  });
  const { chapterSlug, lectureSlug } = slugs;
  const {
    course: { chapters },
  } = useCourse(slugs);
  const currentChapter = chapters.find(
    (chapter) => chapter.slug === chapterSlug,
  )!;
  const openChapters = useSelector(
    store,
    (state) => state.context.openChapters,
  );
  const openChapter = useCallback(
    (params: { chapterSlug: string }) =>
      store.trigger.open({ ...params, lectureSlug }),
    [lectureSlug],
  );
  const closeChapter = useCallback(
    (params: { chapterSlug: string }) =>
      store.trigger.close({ ...params, lectureSlug }),
    [lectureSlug],
  );
  const clearOpenChapters = useCallback(() => store.trigger.clear(), []);
  const contains = useCallback(
    ({ chapterSlug }: { chapterSlug: string }) =>
      openChapters.has(compoundSlug(chapterSlug, lectureSlug)),
    [openChapters, lectureSlug],
  );

  useEffect(() => {
    clearOpenChapters();
    store.trigger.open({ chapterSlug, lectureSlug }); // Uses `store.trigger.open` instead of `openChapter` to establish `lectureSlug` dependency
  }, [clearOpenChapters, chapterSlug, lectureSlug]);

  const state = {
    current: {
      chapter: currentChapter,
      slugs,
    },
    chapters,
  } satisfies State;
  const mutations = {
    openChapter,
    closeChapter,
    clearOpenChapters,
    contains,
  } satisfies Mutations;
  return { ...state, ...mutations };
};

interface State {
  current: {
    chapter: Chapter;
    slugs: UserStoreSlugs;
  };
  chapters: Chapter[];
}
interface Mutations {
  openChapter: (params: { chapterSlug: string }) => void;
  closeChapter: (params: { chapterSlug: string }) => void;
  clearOpenChapters: () => void;
  contains: (params: { chapterSlug: string }) => boolean;
}
interface Return extends State, Mutations {}
