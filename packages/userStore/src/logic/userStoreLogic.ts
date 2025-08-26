import { divide, mapMaybe, pipe } from "@prelude"
import { createServerFn } from "@tanstack/react-start"
import { Context, Effect, Either } from "effect"
import { produce } from "immer"
import { match } from "ts-pattern"
import type { SessionData } from "@/lib/authentication"
import { getSessionDataMw, SessionDataService } from "@/lib/authentication"
import { SERVICE_UNAVAILABLE } from "@/lib/errors"
import { effectRunPromise } from "@/utils/effect"
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings"
import type { ProgressData } from "../types/ProgressData"
import type {
  ChapterAndLecture,
  UserStore,
  UserStoreIds,
} from "../types/UserStore"
import {
  type GetUserStoreParams,
  type SetUserStoreParams,
  SetUserStoreParamsSchema,
} from "../types/UserStoreParams"

export const getUserStoreFn = createServerFn()
  .middleware([getSessionDataMw])
  .handler(async ({ context: _context }): Promise<UserStore> => {
    const cloudflareBindings = getCloudflareBindings()
    const context = Context.empty().pipe(
      Context.add(CloudflareBindingsService, cloudflareBindings),
      Context.add(SessionDataService, _context.sessionData),
    )
    const program = Effect.gen(function* () {
      const { USER_STORE } = yield* CloudflareBindingsService
      const sessionData = yield* SessionDataService
      const maybeUserStore = yield* Effect.promise(() =>
        getUserStore({ kv: USER_STORE, sessionData }),
      )
      return yield* Either.fromNullable(
        maybeUserStore,
        () => new SERVICE_UNAVAILABLE(),
      )
    })
    return effectRunPromise({ context, program })
  })

const getUserStore = ({
  kv,
  sessionData,
}: {
  kv: KVNamespace
  sessionData: SessionData
}): Promise<UserStore | null> =>
  kv.get<UserStore>(sessionData.user.email, { type: "json" })

export const _getIsComplete =
  ({ schoolId, courseId, chapterId, lectureId }: UserStoreIds) =>
  (userStore: UserStore): boolean =>
    userStore.schools
      .find(school => school.id === schoolId)
      ?.courses.find(course => course.id === courseId)
      ?.chaptersAndLectures.find(
        ({ chapter, lecture }) =>
          chapter.id === chapterId && lecture.id === lectureId,
      )?.isComplete ?? false

export const _getProgress =
  (params: GetUserStoreParams) =>
  (userStore: UserStore): ProgressData => {
    const chaptersAndLectures = getChaptersAndLectures(params)(userStore)
    const progress = calculateProgress(chaptersAndLectures)
    return {
      progress,
      isComplete: progress === 100,
    }
  }

const getChaptersAndLectures =
  (params: GetUserStoreParams) =>
  (userStore: UserStore): ChapterAndLecture[] =>
    match(params)
      .returnType<ChapterAndLecture[]>()
      .with({ _tag: "ALL" }, () =>
        userStore.schools.flatMap(school =>
          school.courses.flatMap(
            ({ chaptersAndLectures }) => chaptersAndLectures,
          ),
        ),
      )
      .with(
        { _tag: "SCHOOL" },
        ({ schoolId }) =>
          userStore.schools
            .find(school => school.id === schoolId)
            ?.courses.flatMap(
              ({ chaptersAndLectures }) => chaptersAndLectures,
            ) ?? [],
      )
      .with(
        { _tag: "COURSE" },
        ({ schoolId, courseId }) =>
          userStore.schools
            .find(school => school.id === schoolId)
            ?.courses.find(course => course.id === courseId)
            ?.chaptersAndLectures ?? [],
      )
      .exhaustive()

export const calculateProgress = (
  chaptersAndLectures: ChapterAndLecture[],
): number => {
  const completedLectures = pipe(
    chaptersAndLectures,
    mapMaybe(({ isComplete: maybeIsComplete }) =>
      match(maybeIsComplete)
        .with(true, () => ({}))
        .otherwise(() => null),
    ),
  )
  const part = completedLectures.length
  const whole = chaptersAndLectures.length
  const divisionResult = divide(part)(whole)
  const quotient = match(divisionResult)
    .returnType<number>()
    .with({ _tag: "DIVIDE_BY_ZERO" }, () => 0)
    .with({ _tag: "VALID" }, ({ quotient }) => quotient)
    .exhaustive()
  return quotient * 100
}

export const setProgressFn = createServerFn({ method: "POST" })
  .validator(SetUserStoreParamsSchema)
  .middleware([getSessionDataMw])
  .handler(async ({ context: _context, data: params }): Promise<void> => {
    const cloudflareBindings = getCloudflareBindings()
    const context = Context.empty().pipe(
      Context.add(CloudflareBindingsService, cloudflareBindings),
      Context.add(SessionDataService, _context.sessionData),
    )
    const program = Effect.gen(function* () {
      const { USER_STORE } = yield* CloudflareBindingsService
      const sessionData = yield* SessionDataService
      const maybeUserStore = yield* Effect.promise(() =>
        getUserStore({ kv: USER_STORE, sessionData }),
      )
      const userStore = yield* Either.fromNullable(
        maybeUserStore,
        () => new SERVICE_UNAVAILABLE(),
      )
      const updatedUserStore = yield* Effect.sync(() =>
        updateUserStoreProgress(params)(userStore),
      )
      yield* Effect.promise(() =>
        setUserStore({
          kv: USER_STORE,
          sessionData,
          userStore: updatedUserStore,
        }),
      )
    })
    return effectRunPromise({ context, program })
  })

const updateUserStoreProgress =
  (params: SetUserStoreParams) =>
  (userStore: UserStore): UserStore =>
    produce(userStore, ({ schools }) => {
      schools.forEach(school => {
        school.courses.forEach(course =>
          course.chaptersAndLectures.forEach(
            ({ chapter, lecture, isComplete }) => {
              const isUpdatable = match(params)
                .with({ _tag: "ALL" }, () => true)
                .with(
                  { _tag: "SCHOOL" },
                  ({ schoolId }) => school.id === schoolId,
                )
                .with(
                  { _tag: "COURSE" },
                  ({ schoolId, courseId }) =>
                    school.id === schoolId && course.id === courseId,
                )
                .with(
                  { _tag: "LECTURE" },
                  ({ schoolId, courseId, chapterId, lectureId }) =>
                    school.id === schoolId &&
                    course.id === courseId &&
                    chapter.id === chapterId &&
                    lecture.id === lectureId,
                )
                .exhaustive()
              if (isUpdatable) isComplete = params.isComplete
            },
          ),
        )
      })
    })

const setUserStore = ({
  kv,
  sessionData,
  userStore,
}: {
  kv: KVNamespace
  sessionData: SessionData
  userStore: UserStore
}): Promise<void> => kv.put(sessionData.user.email, JSON.stringify(userStore))
