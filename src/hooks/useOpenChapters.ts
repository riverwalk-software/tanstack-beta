import { useParams } from "@tanstack/react-router";
import { createStore } from "@xstate/store";
import { useSelector } from "@xstate/store/react";
import * as Immutable from "immutable";
import { useCallback, useEffect } from "react";
import { combineSlugs } from "@/utils/combineSlugs";

export const useOpenChapters = (): Return => {
  const slugs = useParams({
    from: "/_authenticated/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug/",
  });
  const { lectureSlug } = slugs;
  const state = useSelector(store, (state) => state.context.openChapters);

  useEffect(() => {
    store.trigger.clear();
    store.trigger.open({ chapterSlug: slugs.chapterSlug, lectureSlug });
  }, [slugs.chapterSlug, lectureSlug]);

  const open = useCallback(
    (chapterSlug: string) => store.trigger.open({ chapterSlug, lectureSlug }),
    [lectureSlug],
  );
  const close = useCallback(
    (chapterSlug: string) => store.trigger.close({ chapterSlug, lectureSlug }),
    [lectureSlug],
  );
  const contains = useCallback(
    (chapterSlug: string) => state.has(compoundSlug(chapterSlug, lectureSlug)),
    [lectureSlug, state],
  );

  return { state, open, close, contains };
};

interface Return {
  state: Immutable.Set<string>;
  open: (chapterSlug: string) => void;
  close: (chapterSlug: string) => void;
  contains: (chapterSlug: string) => boolean;
}

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

const compoundSlug = (chapterSlug: string, lectureSlug: string) =>
  combineSlugs([chapterSlug, lectureSlug]);
