import { createServerFn } from "@tanstack/react-start";
import { Context, Effect, Either } from "effect";
import { produce } from "immer";
import { match } from "ts-pattern";
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "../utils/getCloudflareBindings";
import { getSessionDataMw, SessionDataService } from "./authentication";
import { EnvironmentService, getEnvironmentMw } from "./environment";
import { SERVICE_UNAVAILABLE } from "./errors";

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
export interface UserStoreSlugs {
  schoolSlug: string;
  courseSlug: string;
  chapterSlug: string;
  lectureSlug: string;
}

export interface UserStore {
  schools: {
    slug: string;
    courses: {
      slug: string;
      chapters: {
        slug: string;
        lectures: {
          slug: string;
          completed: boolean;
        }[];
      }[];
    }[];
  }[];
}

export type GetUserStoreParams =
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

export type SetUserStoreParams =
  | GetUserStoreParams
  | {
      _tag: "LECTURE";
      schoolSlug: string;
      courseSlug: string;
      chapterSlug: string;
      lectureSlug: string;
    };

export type SetProgressParams = SetUserStoreParams & {
  completed: boolean;
};

export const setProgressFn = createServerFn({ method: "POST" })
  .validator((data: SetProgressParams) => data)
  .middleware([getEnvironmentMw, getSessionDataMw])
  .handler(
    async ({
      context: { environment, sessionData },
      data: params,
    }): Promise<void> => {
      const cloudflareBindings = getCloudflareBindings();
      const program = Effect.gen(function* () {
        const { USER_STORE } = yield* CloudflareBindingsService;
        const { user } = yield* SessionDataService;
        const userStore: UserStore = yield* Effect.promise(() =>
          getUserStoreFn(),
        );
        const updatedUserStore = yield* Effect.sync(() =>
          produce(userStore, ({ schools }) => {
            schools.forEach((school) => {
              school.courses.forEach((course) =>
                course.chapters.forEach((chapter) =>
                  chapter.lectures.forEach((lecture) => {
                    const isUpdatable = match(params)
                      .with({ _tag: "ALL" }, () => true)
                      .with(
                        { _tag: "SCHOOL" },
                        ({ schoolSlug }) => schoolSlug === school.slug,
                      )
                      .with(
                        { _tag: "COURSE" },
                        ({ schoolSlug, courseSlug }) =>
                          schoolSlug === school.slug &&
                          courseSlug === course.slug,
                      )
                      .with(
                        { _tag: "LECTURE" },
                        ({
                          schoolSlug,
                          courseSlug,
                          chapterSlug,
                          lectureSlug,
                        }) =>
                          schoolSlug === school.slug &&
                          courseSlug === course.slug &&
                          chapterSlug === chapter.slug &&
                          lectureSlug === lecture.slug,
                      )
                      .exhaustive();
                    if (isUpdatable) lecture.completed = params.completed;
                  }),
                ),
              );
            });
          }),
        );
        yield* Effect.promise(() =>
          USER_STORE.put(user.email, JSON.stringify(updatedUserStore)),
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
