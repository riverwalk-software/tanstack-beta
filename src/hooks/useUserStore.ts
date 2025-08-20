import {
  queryOptions,
  type UseMutationResult,
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
} from "@/lib/userStore";

const queryKey = ["userStore"] as const;

export const useUserStore = (): Return => {
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
    [userStore],
  );
  const state = {
    schoolSlugs: useMemo(
      () => userStore.schools.map((school) => school.slug),
      [userStore],
    ),
    getProgress: useCallback(
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
    ),
  } satisfies State;

  const queryClient = useQueryClient();
  const onSuccess = () =>
    queryClient.invalidateQueries({
      queryKey,
    });
  const mutations = {
    setProgressMt: useMutation({
      mutationKey: ["setProgress"],
      mutationFn: (data: SetProgressParams) =>
        setProgressFn({
          data,
        }),
      onSuccess,
    }),
  } satisfies Mutations;

  return { ...state, ...mutations };
};

interface State {
  schoolSlugs: string[];
  getProgress: (params: GetUserStoreParams) => {
    progress: number;
    isComplete: boolean;
  };
}
interface Mutations {
  setProgressMt: UseMutationResult<void, Error, SetProgressParams, unknown>;
}
interface Return extends State, Mutations {}
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
  lecture: { slug: string; completed: boolean };
}
