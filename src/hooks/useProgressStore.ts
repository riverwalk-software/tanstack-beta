import {
  queryOptions,
  type UseMutationResult,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  completeLectureFn,
  getProgressStoreFn,
  type ProgressStore,
  type ProgressStoreParams,
  resetCourseFn,
  resetLectureFn,
} from "@/utils/progressStore";

export const useProgressStore = () => {
  const { data: progressStore } = useSuspenseQuery(progressStoreQueryOptions);
  const queryClient = useQueryClient();
  const completeLectureMt = useMutation({
    mutationKey: [...queryKey, "complete"],
    mutationFn: (params: ProgressStoreParams) => completeLectureFn(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
  const resetLectureMt = useMutation({
    mutationKey: [...queryKey, "reset"],
    mutationFn: (params: ProgressStoreParams) => resetLectureFn(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
  const resetCourseMt = useMutation({
    mutationKey: [...queryKey, "resetAll"],
    mutationFn: (params: Omit<ProgressStoreParams, "lectureSlug">) =>
      resetCourseFn(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
  return { progressStore, completeLectureMt, resetLectureMt, resetCourseMt };
};

// interface State {
//   progressStore: DerivedProgressStore;
// }
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
// interface Return extends State, Actions {}
const queryKey = ["progressStore"];
export const progressStoreQueryOptions = queryOptions({
  queryKey: queryKey,
  queryFn: () => getProgressStoreFn(),
  select: (data) => ({
    ...data,
    schools: data.schools.map((school) => ({
      ...school,
      courses: school.courses.map((course) => ({
        ...course,
        progress: getProgress(course.lectures),
      })),
    })),
  }),
});

const getProgress = (
  lectures: ProgressStore["schools"][number]["courses"][number]["lectures"],
) => {
  const totalLectures = lectures.length;
  if (totalLectures === 0) return 0;
  const completedLectures = lectures.reduce(
    (acc, lecture) => acc + (lecture.completed ? 1 : 0),
    0,
  );
  const progress = (completedLectures / totalLectures) * 100;
  return progress;
};
