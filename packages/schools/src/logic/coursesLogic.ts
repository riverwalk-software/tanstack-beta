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
import type {
  Chapter,
  Course,
  CourseWithFirstChapterAndLecture,
  Lecture,
} from "../types/SchemaTypes";
import { createDb } from "../utils/createDb";
import { getSchool } from "./courseLogic";

const GetCoursesParams = z.object({
  schoolSlug: SLUG_SCHEMA,
});
// TODO: Paginate
export const getCoursesFn = createServerFn()
  .validator(GetCoursesParams)
  .handler(
    async ({
      data: { schoolSlug },
    }): Promise<CourseWithFirstChapterAndLecture[]> => {
      const cloudflareBindings = getCloudflareBindings();
      const context = Context.empty().pipe(
        Context.add(CloudflareBindingsService, cloudflareBindings),
      );
      const program = Effect.gen(function* () {
        const { SCHOOL_DB } = yield* CloudflareBindingsService;
        const db = yield* Effect.sync(() => createDb(SCHOOL_DB));
        const maybeSchool = yield* Effect.promise(() =>
          getSchool({ db, schoolSlug }),
        );
        const school = yield* Either.fromNullable(
          maybeSchool,
          () => new SERVICE_UNAVAILABLE(),
        );
        const courses = yield* Effect.promise(() =>
          getCourses({ db, schoolId: school.id }),
        );
        return yield* Effect.sync(() => extractFirstChapterAndLecture(courses));
      });
      return effectRunPromise({ context, program });
    },
  );

const getCourses = ({
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

const extractFirstChapterAndLecture = (
  courses: (Course & {
    chapters: (Chapter & { lectures: Lecture[] })[];
  })[],
) =>
  courses.map(({ chapters, ...course }) => ({
    ...course,
    chapter: {
      ...chapters[0],
      lecture: chapters[0].lectures[0],
    },
  }));
