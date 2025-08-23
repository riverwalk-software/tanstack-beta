import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { Context, Effect } from "effect";
import z from "zod";
import { SLUG_SCHEMA } from "@/lib/constants";
import { effectRunPromise } from "@/utils/effect";
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings";
import type { Course } from "../types/SchemaTypes";
import { createDb } from "../utils/createDb";

const GetCoursesParams = z.object({
  schoolSlug: SLUG_SCHEMA,
});
// TODO: Paginate
export const getCoursesFn = createServerFn()
  .validator(GetCoursesParams)
  .handler(async ({ data: { schoolSlug } }): Promise<Course[]> => {
    const cloudflareBindings = getCloudflareBindings();
    const context = Context.empty().pipe(
      Context.add(CloudflareBindingsService, cloudflareBindings),
    );
    const program = Effect.gen(function* () {
      const { SCHOOL_DB } = yield* CloudflareBindingsService;
      const db = yield* Effect.sync(() => createDb(SCHOOL_DB));
      return yield* Effect.promise(() => getCourses({ db, schoolSlug }));
    });
    return effectRunPromise({ context, program });
  });

const getCourses = ({
  db,
  schoolSlug,
}: {
  db: ReturnType<typeof createDb>;
  schoolSlug: string;
}) =>
  db.query.CourseEntity.findMany({
    where: (course) => eq(course.slug, schoolSlug),
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
