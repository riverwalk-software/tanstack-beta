import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { Context, Effect, Either } from "effect";
import z from "zod";
import { SLUG_SCHEMA } from "@/lib/constants";
import { SERVICE_UNAVAILABLE } from "@/lib/errors";
import { effectRunPromise } from "@/utils/effect";
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings";
import type { Course } from "../types/SchemaTypes";
import { createDb } from "../utils/createDb";

const GetCourseParams = z.object({
  schoolSlug: SLUG_SCHEMA,
  courseSlug: SLUG_SCHEMA,
});
// TODO: Paginate
export const getCourseFn = createServerFn()
  .validator(GetCourseParams)
  .handler(async ({ data: { schoolSlug, courseSlug } }): Promise<Course> => {
    const cloudflareBindings = getCloudflareBindings();
    const context = Context.empty().pipe(
      Context.add(CloudflareBindingsService, cloudflareBindings),
    );
    const program = Effect.gen(function* () {
      const { SCHOOL_DB } = yield* CloudflareBindingsService;
      const db = yield* Effect.sync(() => createDb(SCHOOL_DB));
      const maybeCourse = yield* Effect.promise(() =>
        getCourse({ db, schoolSlug, courseSlug }),
      );
      return yield* Either.fromNullable(
        maybeCourse,
        () => new SERVICE_UNAVAILABLE(),
      );
    });
    return effectRunPromise({ context, program });
  });

const getCourse = ({
  db,
  schoolSlug,
  courseSlug,
}: {
  db: ReturnType<typeof createDb>;
  schoolSlug: string;
  courseSlug: string;
}) =>
  db.query.CourseEntity.findFirst({
    where: (course) =>
      eq(course.slug, schoolSlug) && eq(course.slug, courseSlug),
    with: {
      chapters: {
        orderBy: (chapter) => chapter.ordinal,
        with: {
          lectures: {
            orderBy: (lecture) => lecture.ordinal,
            with: {
              video: true,
              attachments: true,
            },
          },
        },
      },
    },
  });
