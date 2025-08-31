/** biome-ignore-all lint/style/noNonNullAssertion: Invariants */
import type { List } from "@prelude"
import { createServerFn } from "@tanstack/react-start"
import { Context, Effect, Match, pipe, Schema } from "effect"
import { produce } from "immer"
import { proportionOf } from "packages/prelude/src/types/numbers/reals/BoundedPercentage"
import { match } from "ts-pattern"
import type { SessionData } from "@/lib/authentication"
import { getSessionDataMw, SessionDataService } from "@/lib/authentication"
import { effectRunPromise } from "@/utils/effect"
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings"
import { type Progress, ProgressSchema } from "../types/Progress"
import type { ProgressData } from "../types/ProgressData"
import type {
  ChapterAndLecture,
  UserStore,
  UserStoreSlugs,
} from "../types/UserStore"
import {
  type GetUserStoreParams,
  type SetUserStoreParams,
  SetUserStoreParamsSchema,
} from "../types/UserStoreParams"

export const getUserStoreFn = createServerFn()
  .middleware([getSessionDataMw])
  .handler(
    ({
      context: _context,
    }): Promise<Schema.Schema.Encoded<typeof UserStore>> => {
      const cloudflareBindings = getCloudflareBindings()
      const context = Context.empty().pipe(
        Context.add(CloudflareBindingsService, cloudflareBindings),
        Context.add(SessionDataService, _context.sessionData),
      )
      const program = Effect.gen(function* () {
        const { USER_STORE } = yield* CloudflareBindingsService
        const sessionData = yield* SessionDataService
        const userStore = yield* Effect.promise(() =>
          getUserStore(USER_STORE, { sessionData }),
        )
        if (userStore === null) throw new Error()
        return userStore
      })
      return effectRunPromise({ context, program })
    },
  )

const getUserStore = (
  kv: KVNamespace,
  { sessionData }: { sessionData: SessionData },
): Promise<UserStore | null> => kv.get(sessionData.user.email, { type: "json" })

export const _getIsComplete =
  ({ schoolSlug, courseSlug, chapterSlug, lectureSlug }: UserStoreSlugs) =>
  (userStore: UserStore): boolean =>
    userStore.schools
      .find(school => school.slug === schoolSlug)
      ?.courses.find(course => course.slug === courseSlug)
      ?.chaptersAndLectures.find(
        ({ chapter, lecture }) =>
          chapter.slug === chapterSlug && lecture.slug === lectureSlug,
      )?.isComplete ?? false

export const _getProgress =
  (params: GetUserStoreParams) =>
  (userStore: UserStore): ProgressData => {
    const chaptersAndLectures = getChaptersAndLectures(params)(userStore)
    const progress = calculateProgress([
      chaptersAndLectures[0]!,
      chaptersAndLectures.slice(1),
    ])
    return {
      progress,
      isComplete: progress === 100,
    }
  }

const getChaptersAndLectures =
  (params: GetUserStoreParams) =>
  (userStore: UserStore): List<ChapterAndLecture> =>
    Match.type<GetUserStoreParams>().pipe(
      Match.tagsExhaustive({
        ALL: () =>
          userStore.schools.flatMap(school =>
            school.courses.flatMap(
              ({ chaptersAndLectures }) => chaptersAndLectures,
            ),
          ),
        SCHOOL: ({ schoolSlug }) =>
          userStore.schools
            .find(school => school.slug === schoolSlug)
            ?.courses.flatMap(
              ({ chaptersAndLectures }) => chaptersAndLectures,
            ) ?? [],
        COURSE: ({ schoolSlug, courseSlug }) =>
          userStore.schools
            .find(school => school.slug === schoolSlug)
            ?.courses.find(course => course.slug === courseSlug)
            ?.chaptersAndLectures ?? [],
      }),
    )(params)

export const calculateProgress = ([head, tail]: [
  ChapterAndLecture,
  List<ChapterAndLecture>,
]): Progress => {
  const boundedPercentage = pipe(
    [head, ...tail],
    proportionOf(({ isComplete }) => isComplete === true),
  )
  return Schema.decodeSync(ProgressSchema)(boundedPercentage)
}

export const setProgressFn = createServerFn({ method: "POST" })
  .validator(Schema.decodeUnknownSync(SetUserStoreParamsSchema))
  .middleware([getSessionDataMw])
  .handler(({ context: _context, data: params }): Promise<void> => {
    const cloudflareBindings = getCloudflareBindings()
    const context = Context.empty().pipe(
      Context.add(CloudflareBindingsService, cloudflareBindings),
      Context.add(SessionDataService, _context.sessionData),
    )
    const program = Effect.gen(function* () {
      const { USER_STORE } = yield* CloudflareBindingsService
      const sessionData = yield* SessionDataService
      const userStore = yield* Effect.promise(() =>
        getUserStore(USER_STORE, { sessionData }),
      )
      if (userStore === null) throw new Error()
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
                  ({ schoolSlug }) => school.slug === schoolSlug,
                )
                .with(
                  { _tag: "COURSE" },
                  ({ schoolSlug, courseSlug }) =>
                    school.slug === schoolSlug && course.slug === courseSlug,
                )
                .with(
                  { _tag: "LECTURE" },
                  ({ schoolSlug, courseSlug, chapterSlug, lectureSlug }) =>
                    school.slug === schoolSlug &&
                    course.slug === courseSlug &&
                    chapter.slug === chapterSlug &&
                    lecture.slug === lectureSlug,
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
