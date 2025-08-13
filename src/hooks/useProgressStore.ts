import {
  queryOptions,
  type UseMutationResult,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { match } from "ts-pattern";
import {
  type GetProgressStoreParams,
  getProgressStoreFn,
  type ProgressStore,
  type ProgressStoreParams,
  setProgressStoreFn,
} from "@/utils/progressStore";

export const useProgressStore = (): Return => {
  const { data: getProgress } = useSuspenseQuery(progressStoreQueryOptions);
  const queryClient = useQueryClient();
  const onSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey,
    });
  };
  const completeLectureMt = useMutation({
    mutationKey: [...queryKey, "lecture", "complete"],
    mutationFn: (params: ProgressStoreParams) =>
      setProgressStoreFn({
        data: { ...params, _tag: "LECTURE", completed: true },
      }),
    onSuccess,
  });
  const resetLectureMt = useMutation({
    mutationKey: [...queryKey, "lecture", "reset"],
    mutationFn: (params: ProgressStoreParams) =>
      setProgressStoreFn({
        data: { ...params, _tag: "LECTURE", completed: false },
      }),
    onSuccess,
  });
  const resetCourseMt = useMutation({
    mutationKey: [...queryKey, "course", "reset"],
    mutationFn: (params: Omit<ProgressStoreParams, "lectureSlug">) =>
      setProgressStoreFn({
        data: { ...params, _tag: "COURSE", completed: false },
      }),
    onSuccess,
  });
  return {
    getProgress,
    completeLectureMt,
    resetLectureMt,
    resetCourseMt,
  };
};

interface State {
  getProgress: (params: GetProgressStoreParams) => number;
}
interface Actions {
  completeLectureMt: UseMutationResult<
    void,
    Error,
    ProgressStoreParams,
    unknown
  >;
  resetLectureMt: UseMutationResult<void, Error, ProgressStoreParams, unknown>;
  resetCourseMt: UseMutationResult<
    void,
    Error,
    Omit<ProgressStoreParams, "lectureSlug">,
    unknown
  >;
}
interface Return extends State, Actions {}
const queryKey = ["progressStore"];
export const progressStoreQueryOptions = queryOptions({
  queryKey: queryKey,
  queryFn: () => getProgressStoreFn(),
  select: (data) => (params: GetProgressStoreParams) =>
    match(params)
      .with({ _tag: "ALL" }, () =>
        getProgress(
          data.schools.flatMap((school) =>
            school.courses.flatMap((course) => course.lectures),
          ),
        ),
      )
      .with({ _tag: "SCHOOL" }, ({ schoolSlug }) =>
        getProgress(
          data.schools
            .find((school) => school.slug === schoolSlug)!
            .courses.flatMap((course) => course.lectures),
        ),
      )
      .with({ _tag: "COURSE" }, ({ schoolSlug, courseSlug }) =>
        getProgress(
          data.schools
            .find((school) => school.slug === schoolSlug)!
            .courses.find((course) => course.slug === courseSlug)!.lectures,
        ),
      )
      .exhaustive(),
});

const getProgress = (
  lectures: ProgressStore["schools"][number]["courses"][number]["lectures"],
) => {
  const totalLectures = lectures.length;
  if (totalLectures <= 0) return 0;
  const completedLectures = lectures
    .map(({ completed }) => (completed ? 1 : 0))
    .reduce((acc, completed) => acc + completed, 0 as number);
  return (completedLectures / totalLectures) * 100;
};
