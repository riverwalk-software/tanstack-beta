import {
  queryOptions,
  type UseMutationResult,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { match } from "ts-pattern";
import {
  type GetUserStoreParams,
  getUserStoreFn,
  setUserStoreFn,
  type UserStore,
  type UserStoreParams,
} from "@/utils/userStore";

export const useUserStore = (): Return => {
  const { data: userStore } = useSuspenseQuery(userStoreQueryOptions);
  const schoolSlugs = userStore.schools.map((school) => school.slug);
  const getProgress = (params: GetUserStoreParams) =>
    match(params)
      .with({ _tag: "ALL" }, () =>
        calculateProgress(
          userStore.schools.flatMap((school) =>
            school.courses.flatMap((course) =>
              course.chapters.flatMap(({ lectures }) => lectures),
            ),
          ),
        ),
      )
      .with({ _tag: "SCHOOL" }, ({ schoolSlug }) =>
        calculateProgress(
          userStore.schools
            .find((school) => school.slug === schoolSlug)!
            .courses.flatMap((course) =>
              course.chapters.flatMap(({ lectures }) => lectures),
            ),
        ),
      )
      .with({ _tag: "COURSE" }, ({ schoolSlug, courseSlug }) =>
        calculateProgress(
          userStore.schools
            .find((school) => school.slug === schoolSlug)!
            .courses.find((course) => course.slug === courseSlug)!
            .chapters.flatMap(({ lectures }) => lectures),
        ),
      )
      .exhaustive();
  const queryClient = useQueryClient();
  const onSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey,
    });
  };
  const completeLectureMt = useMutation({
    mutationKey: [...queryKey, "lecture", "complete"],
    mutationFn: (params: UserStoreParams) =>
      setUserStoreFn({
        data: { ...params, _tag: "LECTURE", completed: true },
      }),
    onSuccess,
  });
  const resetLectureMt = useMutation({
    mutationKey: [...queryKey, "lecture", "reset"],
    mutationFn: (params: UserStoreParams) =>
      setUserStoreFn({
        data: { ...params, _tag: "LECTURE", completed: false },
      }),
    onSuccess,
  });
  const resetCourseMt = useMutation({
    mutationKey: [...queryKey, "course", "reset"],
    mutationFn: (
      params: Omit<UserStoreParams, "chapterSlug" | "lectureSlug">,
    ) =>
      setUserStoreFn({
        data: { ...params, _tag: "COURSE", completed: false },
      }),
    onSuccess,
  });
  const resetSchoolMt = useMutation({
    mutationKey: [...queryKey, "school", "reset"],
    mutationFn: (
      params: Omit<
        UserStoreParams,
        "courseSlug" | "chapterSlug" | "lectureSlug"
      >,
    ) =>
      setUserStoreFn({
        data: { ...params, _tag: "SCHOOL", completed: false },
      }),
    onSuccess,
  });
  return {
    userStore,
    schoolSlugs,
    getProgress,
    completeLectureMt,
    resetLectureMt,
    resetCourseMt,
    resetSchoolMt,
  };
};

interface State {
  userStore: UserStore;
  schoolSlugs: string[];
  getProgress: (params: GetUserStoreParams) => number;
}
interface Actions {
  completeLectureMt: UseMutationResult<void, Error, UserStoreParams, unknown>;
  resetLectureMt: UseMutationResult<void, Error, UserStoreParams, unknown>;
  resetCourseMt: UseMutationResult<
    void,
    Error,
    Omit<UserStoreParams, "chapterSlug" | "lectureSlug">,
    unknown
  >;
  resetSchoolMt: UseMutationResult<
    void,
    Error,
    Omit<UserStoreParams, "courseSlug" | "chapterSlug" | "lectureSlug">,
    unknown
  >;
}
interface Return extends State, Actions {}
const queryKey = ["userStore"];
export const userStoreQueryOptions = queryOptions({
  queryKey: queryKey,
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
