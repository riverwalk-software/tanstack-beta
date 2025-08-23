import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { Context, Effect } from "effect";
import z from "zod";
import { ID_SCHEMA } from "@/lib/constants";
import { effectRunPromise } from "@/utils/effect";
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings";
import { getUserCourses } from "../logic/userCoursesLogic";
import type { Course } from "../types/SchemaTypes";
import { createDb } from "../utils/createDb";

export const userCoursesQueryOptions = ({ schoolId }: { schoolId: number }) => {
  return queryOptions({
    queryKey: ["userCourses", { schoolId }],
    queryFn: () => getUserCoursesFn({ data: { schoolId } }),
  });
};

const Params = z.object({
  schoolId: ID_SCHEMA,
});

// TODO: Paginate
const getUserCoursesFn = createServerFn()
  .validator(Params)
  .handler(async ({ data: { schoolId } }): Promise<Course[]> => {
    const cloudflareBindings = getCloudflareBindings();
    const context = Context.empty().pipe(
      Context.add(CloudflareBindingsService, cloudflareBindings),
    );
    const program = Effect.gen(function* () {
      const { SCHOOL_DB } = yield* CloudflareBindingsService;
      const db = yield* Effect.sync(() => createDb(SCHOOL_DB));
      return yield* Effect.promise(() => getUserCourses({ db, schoolId }));
    });
    return effectRunPromise({ context, program });
  });
