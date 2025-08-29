/** biome-ignore-all lint/style/noNonNullAssertion: Invariants */
import type { List } from "@prelude"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { Context, Effect, Schema } from "effect"
import { effectRunPromise } from "@/utils/effect"
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings"
import type {
  Chapter,
  Course,
  CourseWithFirstChapterAndLecture,
  Lecture,
} from "../../../types/SchemaTypes"
import { createDb } from "../../../utils/createDb"
import { getSchool } from "../../../utils/getSchool"
import { type GetCourses, GetCoursesSchema } from "../types/GetCourses"

// TODO: Paginate
export const getCoursesFn = createServerFn()
  .validator(Schema.decodeUnknownSync(GetCoursesSchema))
  .handler(
    ({
      data: { schoolSlug },
    }): Promise<List<CourseWithFirstChapterAndLecture>> => {
      const cloudflareBindings = getCloudflareBindings()
      const context = Context.empty().pipe(
        Context.add(CloudflareBindingsService, cloudflareBindings),
      )
      const program = Effect.gen(function* () {
        const { SCHOOL_DB } = yield* CloudflareBindingsService
        const db = yield* Effect.sync(() => createDb(SCHOOL_DB))
        const school = yield* Effect.promise(() =>
          getSchool({ db, schoolSlug }),
        )
        if (school === undefined) throw new Error()
        const schoolData = yield* Effect.promise(() =>
          getCourses(db, { schoolSlug: school.slug }),
        )
        if (schoolData === undefined) throw new Error()
        return yield* Effect.sync(() =>
          extractFirstChapterAndLecture(schoolData.courses),
        )
      })
      return effectRunPromise({ context, program })
    },
  )

const getCourses = (
  db: ReturnType<typeof createDb>,
  { schoolSlug }: GetCourses,
) =>
  db.query.SchoolEntity.findFirst({
    where: school => eq(school.slug, schoolSlug),
    with: {
      courses: {
        limit: 1,
        orderBy: course => course.title,
        with: {
          chapters: {
            limit: 1,
            orderBy: chapter => chapter.ordinal,
            with: {
              lectures: {
                limit: 1,
                orderBy: lecture => lecture.ordinal,
              },
            },
          },
        },
      },
    },
  })

const extractFirstChapterAndLecture = (
  courses: List<
    Course & {
      chapters: List<Chapter & { lectures: List<Lecture> }>
    }
  >,
): List<CourseWithFirstChapterAndLecture> =>
  courses.map(({ chapters, ...course }) => ({
    ...course,
    chapter: {
      ...chapters[0]!,
      lecture: chapters[0]!.lectures[0]!,
    },
  }))
