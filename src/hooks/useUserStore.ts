import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { match } from "ts-pattern";
import {
  type GetUserStoreParams,
  getUserStoreFn,
  type SetProgressParams,
  setProgressFn,
  type UserStore,
  type UserStoreSlugs,
} from "@/lib/userStore";

export const useUserStore = () => {
  const { data: userStore } = useSuspenseQuery(userStoreQueryOptions);
  const getLecturesWithChapters = useCallback(
    (params: GetUserStoreParams): LectureWithChapter[] => {
      const chapters = match(params)
        .with({ _tag: "ALL" }, () =>
          userStore.schools.flatMap((school) =>
            school.courses.flatMap((course) => course.chapters),
          ),
        )
        .with({ _tag: "SCHOOL" }, ({ schoolSlug }) =>
          userStore.schools
            .find((school) => school.slug === schoolSlug)!
            .courses.flatMap((course) => course.chapters),
        )
        .with(
          { _tag: "COURSE" },
          ({ schoolSlug, courseSlug }) =>
            userStore.schools
              .find((school) => school.slug === schoolSlug)!
              .courses.find((course) => course.slug === courseSlug)!.chapters,
        )
        .exhaustive();
      return chapters.flatMap((chapter) =>
        chapter.lectures.map((lecture) => ({
          chapter,
          lecture,
        })),
      );
    },
    [userStore.schools],
  );
  const schoolSlugs = useMemo(
    () => userStore.schools.map((school) => school.slug),
    [userStore.schools],
  );
  const getProgress = useCallback(
    (params: GetUserStoreParams) => {
      const lecturesWithChapters = getLecturesWithChapters(params);
      const lectures = lecturesWithChapters.map(({ lecture }) => lecture);
      const progress = calculateProgress(lectures);
      return {
        progress,
        isComplete: progress === 100,
      };
    },
    [getLecturesWithChapters],
  );
  const getIsComplete = useCallback(
    ({
      schoolSlug,
      courseSlug,
      chapterSlug,
      lectureSlug,
    }: UserStoreSlugs): boolean =>
      userStore.schools
        .find((school) => school.slug === schoolSlug)
        ?.courses.find((course) => course.slug === courseSlug)
        ?.chapters.find((chapter) => chapter.slug === chapterSlug)
        ?.lectures.find((lecture) => lecture.slug === lectureSlug)?.completed ??
      false,
    [userStore.schools],
  );

  const queryClient = useQueryClient();
  const onSuccess = () =>
    queryClient.invalidateQueries({
      queryKey,
    });
  const setProgressMt = useMutation({
    mutationKey: ["setProgress"],
    mutationFn: (data: SetProgressParams) =>
      setProgressFn({
        data,
      }),
    onSuccess,
  });

  return { schoolSlugs, getProgress, setProgressMt, getIsComplete };
};

const queryKey = ["userStore"] as const;

export const userStoreQueryOptions = queryOptions({
  queryKey,
  queryFn: () => getUserStoreFn(),
});

const calculateProgress = (
  lectures: UserStore["schools"][number]["courses"][number]["chapters"][number]["lectures"],
) => {
  const totalLectures = lectures.length;
  if (totalLectures <= 0) return 0;
  const completedLectures = lectures
    .map(({ completed }) => (completed ? 1 : 0))
    .reduce((acc, completed) => acc + completed, 0 as number);
  return (completedLectures / totalLectures) * 100;
};

interface LectureWithChapter {
  chapter: { slug: string };
  lecture: { slug: string; completed?: boolean };
}
