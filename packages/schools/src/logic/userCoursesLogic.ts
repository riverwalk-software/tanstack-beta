import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { Context, Effect } from "effect";
import z from "zod";
import { ID_SCHEMA } from "@/lib/constants";
import { effectRunPromise } from "@/utils/effect";
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings";
import type { Course } from "../types/SchemaTypes";
import { createDb } from "../utils/createDb";

const GetUserCoursesParams = z.object({
  schoolId: ID_SCHEMA,
});
// TODO: Paginate
export const getUserCoursesFn = createServerFn()
  .validator(GetUserCoursesParams)
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

const getUserCourses = ({
  db,
  schoolId,
}: {
  db: ReturnType<typeof createDb>;
  schoolId: number;
}) =>
  db.query.CourseEntity.findMany({
    where: (course) => eq(course.schoolId, schoolId),
    orderBy: (course) => course.title,
    with: {
      chapters: {
        limit: 1,
        orderBy: (chapter) => chapter.ordinal,
        with: {
          lectures: {
            limit: 1,
            orderBy: (lecture) => lecture.ordinal,
          },
        },
      },
    },
  });
