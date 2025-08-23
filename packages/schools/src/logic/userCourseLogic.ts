import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { Context, Effect, Either } from "effect";
import z from "zod";
import { ID_SCHEMA } from "@/lib/constants";
import { SERVICE_UNAVAILABLE } from "@/lib/errors";
import { effectRunPromise } from "@/utils/effect";
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings";
import type { Course } from "../types/SchemaTypes";
import { createDb } from "../utils/createDb";

const Params = z.object({
  schoolId: ID_SCHEMA,
  courseId: ID_SCHEMA,
});

// TODO: Paginate
export const getUserCourseFn = createServerFn()
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

const getUserCourse = ({
  db,
  schoolId,
  courseId,
}: {
  db: ReturnType<typeof createDb>;
  schoolId: number;
  courseId: number;
}) =>
  db.query.CourseEntity.findFirst({
    where: (course) => eq(course.schoolId, schoolId) && eq(course.id, courseId),
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
