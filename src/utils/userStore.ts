import { createServerFn } from "@tanstack/react-start";
import { Context, Effect, Either } from "effect";
import { match } from "ts-pattern";
import { getSessionDataMw, SessionDataService } from "./authentication";
import { EnvironmentService, getEnvironmentMw } from "./environment";
import { SERVICE_UNAVAILABLE } from "./errors";
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "./getCloudflareBindings";

export const getUserStoreFn = createServerFn()
  .middleware([getEnvironmentMw, getSessionDataMw])
  .handler(
    async ({ context: { environment, sessionData } }): Promise<UserStore> => {
      const cloudflareBindings = getCloudflareBindings();
      const program = Effect.gen(function* () {
        const { USER_STORE } = yield* CloudflareBindingsService;
        const { user } = yield* SessionDataService;
        const maybeUserStore = yield* Effect.promise(() =>
          USER_STORE.get<UserStore>(user.email, { type: "json" }),
        );
        const userStore = yield* Either.fromNullable(
          maybeUserStore,
          () => new SERVICE_UNAVAILABLE(),
        );
        return userStore;
      });
      const context = Context.empty().pipe(
        Context.add(CloudflareBindingsService, cloudflareBindings),
        Context.add(EnvironmentService, environment),
        Context.add(SessionDataService, sessionData),
      );
      const provided = Effect.provide(program, context);
      const runnable = Effect.catchAllDefect(provided, (defect) => {
        console.error(defect);
        return Effect.fail(new SERVICE_UNAVAILABLE());
      });
      const userStore = await Effect.runPromise(runnable);
      return userStore;
    },
  );
export interface UserStoreParams {
  schoolSlug: string;
  courseSlug: string;
  lectureSlug: string;
}

export interface UserStore {
  schools: {
    slug: string;
    courses: {
      slug: string;
      lectures: {
        slug: string;
        completed: boolean;
      }[];
    }[];
  }[];
}

interface UserStoreAllTag {
  _tag: "ALL";
}
interface UserStoreSchoolTag {
  _tag: "SCHOOL";
  schoolSlug: string;
}
interface UserStoreCourseTag {
  _tag: "COURSE";
  schoolSlug: string;
  courseSlug: string;
}
interface UserStoreLectureTag {
  _tag: "LECTURE";
  schoolSlug: string;
  courseSlug: string;
  lectureSlug: string;
}
interface UserStoreOptions {
  completed: boolean;
}

export type GetUserStoreParams =
  | UserStoreAllTag
  | UserStoreSchoolTag
  | UserStoreCourseTag;

export type SetUserStoreParams = (GetUserStoreParams | UserStoreLectureTag) &
  UserStoreOptions;

export const setUserStoreFn = createServerFn({ method: "POST" })
  .validator((data: SetUserStoreParams) => data)
  .middleware([getEnvironmentMw, getSessionDataMw])
  .handler(
    async ({
      context: { environment, sessionData },
      data: params,
    }): Promise<void> => {
      const { completed } = params;
      const cloudflareBindings = getCloudflareBindings();
      const program = Effect.gen(function* () {
        const { USER_STORE } = yield* CloudflareBindingsService;
        const { user } = yield* SessionDataService;
        const userStore = yield* Effect.promise(() => getUserStoreFn());
        yield* Effect.promise(() =>
          USER_STORE.put(
            user.email,
            JSON.stringify({
              ...userStore,
              schools: userStore.schools.map((school) => ({
                ...school,
                courses: school.courses.map((course) => ({
                  ...course,
                  lectures: course.lectures.map((lecture) =>
                    match(params)
                      .with({ _tag: "ALL" }, () => ({
                        ...lecture,
                        completed,
                      }))
                      .with({ _tag: "SCHOOL" }, ({ schoolSlug }) => ({
                        ...lecture,
                        completed:
                          school.slug === schoolSlug
                            ? completed
                            : lecture.completed,
                      }))
                      .with(
                        { _tag: "COURSE" },
                        ({ schoolSlug, courseSlug }) => ({
                          ...lecture,
                          completed:
                            school.slug === schoolSlug &&
                            course.slug === courseSlug
                              ? completed
                              : lecture.completed,
                        }),
                      )
                      .with(
                        { _tag: "LECTURE" },
                        ({ schoolSlug, courseSlug, lectureSlug }) => ({
                          ...lecture,
                          completed:
                            school.slug === schoolSlug &&
                            course.slug === courseSlug &&
                            lecture.slug === lectureSlug
                              ? completed
                              : lecture.completed,
                        }),
                      )
                      .exhaustive(),
                  ),
                })),
              })),
            } satisfies UserStore),
          ),
        );
      });
      const context = Context.empty().pipe(
        Context.add(CloudflareBindingsService, cloudflareBindings),
        Context.add(EnvironmentService, environment),
        Context.add(SessionDataService, sessionData),
      );
      const provided = Effect.provide(program, context);
      const runnable = Effect.catchAllDefect(provided, (defect) => {
        console.error(defect);
        return Effect.fail(new SERVICE_UNAVAILABLE());
      });
      await Effect.runPromise(runnable);
    },
  );
