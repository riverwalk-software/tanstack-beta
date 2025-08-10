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

export const getProgressStoreFn = createServerFn()
  .middleware([getEnvironmentMw, getSessionDataMw])
  .handler(
    async ({
      context: { environment, sessionData },
    }): Promise<ProgressStore> => {
      const cloudflareBindings = getCloudflareBindings();
      const program = Effect.gen(function* () {
        const { PROGRESS_STORE } = yield* CloudflareBindingsService;
        const { user } = yield* SessionDataService;
        const maybeProgressStore = yield* Effect.promise(() =>
          PROGRESS_STORE.get<ProgressStore>(user.email, { type: "json" }),
        );
        const progressStore = yield* Either.fromNullable(
          maybeProgressStore,
          () => new SERVICE_UNAVAILABLE(),
        );
        return progressStore;
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
      const progressStore = await Effect.runPromise(runnable);
      return progressStore;
    },
  );
export interface ProgressStoreParams {
  schoolSlug: string;
  courseSlug: string;
  lectureSlug: string;
}

export interface ProgressStore {
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

export type SetProgressStoreParams = (
  | ProgressStoreOptions
  | {
      _tag: "LECTURE";
      schoolSlug: string;
      courseSlug: string;
      lectureSlug: string;
    }
) & { completed: boolean };

export type ProgressStoreOptions =
  | {
      _tag: "ALL";
    }
  | {
      _tag: "SCHOOL";
      schoolSlug: string;
    }
  | {
      _tag: "COURSE";
      schoolSlug: string;
      courseSlug: string;
    };

export const setProgressStoreFn = createServerFn({ method: "POST" })
  .validator((data: SetProgressStoreParams) => data)
  .middleware([getEnvironmentMw, getSessionDataMw])
  .handler(
    async ({
      context: { environment, sessionData },
      data: params,
    }): Promise<void> => {
      const { completed } = params;
      const cloudflareBindings = getCloudflareBindings();
      const program = Effect.gen(function* () {
        const { PROGRESS_STORE } = yield* CloudflareBindingsService;
        const { user } = yield* SessionDataService;
        const progressStore = yield* Effect.promise(() => getProgressStoreFn());
        yield* Effect.promise(() =>
          PROGRESS_STORE.put(
            user.email,
            JSON.stringify({
              ...progressStore,
              schools: progressStore.schools.map((school) => ({
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
            } satisfies ProgressStore),
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
