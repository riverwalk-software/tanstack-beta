import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { Context, Effect, Either } from "effect";
import z from "zod";
import { ID_SCHEMA } from "@/lib/constants";
import { SERVICE_UNAVAILABLE } from "@/lib/errors";
import { effectRunPromise } from "@/utils/effect";
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings";
import { getUserCourse } from "../logic/userCourseLogic";
import type { Course } from "../types/SchemaTypes";
import { createDb } from "../utils/createDb";

export const userCourseQueryOptions = ({
  schoolId,
  courseId,
}: {
  schoolId: number;
  courseId: number;
}) => {
  return queryOptions({
    queryKey: ["userCourse", { schoolId, courseId }],
    queryFn: () => getUserCourseFn({ data: { schoolId, courseId } }),
  });
};

const Params = z.object({
  schoolId: ID_SCHEMA,
  courseId: ID_SCHEMA,
});

// TODO: Paginate
const getUserCourseFn = createServerFn()
  .validator(Params)
  .handler(async ({ data: { schoolId, courseId } }): Promise<Course> => {
    const cloudflareBindings = getCloudflareBindings();
    const context = Context.empty().pipe(
      Context.add(CloudflareBindingsService, cloudflareBindings),
    );
    const program = Effect.gen(function* () {
      const { SCHOOL_DB } = yield* CloudflareBindingsService;
      const db = yield* Effect.sync(() => createDb(SCHOOL_DB));
      const maybeCourse = yield* Effect.promise(() =>
        getUserCourse({ db, schoolId, courseId }),
      );
      return yield* Either.fromNullable(
        maybeCourse,
        () => new SERVICE_UNAVAILABLE(),
      );
    });
    return effectRunPromise({ context, program });
  });
