/** biome-ignore-all lint/style/noNonNullAssertion: Invariants */
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { Context, Effect, Schema } from "effect"
import { effectRunPromise } from "@/utils/effect"
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings"
import type { Course } from "../../../types/SchemaTypes"
import { createDb } from "../../../utils/createDb"
import { getSchool } from "../../../utils/getSchool"
import { type GetCourse, GetCourseSchema } from "../types/GetCourse"

// TODO: Paginate
export const getCourseFn = createServerFn()
  .validator(Schema.decodeUnknownSync(GetCourseSchema))
  .handler(({ data: { schoolSlug, courseSlug } }): Promise<Course> => {
    const cloudflareBindings = getCloudflareBindings()
    const context = Context.empty().pipe(
      Context.add(CloudflareBindingsService, cloudflareBindings),
    )
    const program = Effect.gen(function* () {
      const { SCHOOL_DB } = yield* CloudflareBindingsService
      const db = yield* Effect.sync(() => createDb(SCHOOL_DB))
      const school = yield* Effect.promise(() => getSchool({ db, schoolSlug }))
      if (school === undefined) throw new Error()
      const schoolData = yield* Effect.promise(() =>
        getCourse(db, { schoolSlug: school.slug, courseSlug }),
      )
      if (schoolData === undefined) throw new Error()
      return schoolData.courses[0]!
    })
    return effectRunPromise({ context, program })
  })

const getCourse = (
  db: ReturnType<typeof createDb>,
  { schoolSlug, courseSlug }: GetCourse,
) =>
  db.query.SchoolEntity.findFirst({
    where: school => eq(school.slug, schoolSlug),
    with: {
      courses: {
        where: course => eq(course.slug, courseSlug),
        with: {
          chapters: {
            orderBy: chapter => chapter.ordinal,
            with: {
              lectures: {
                orderBy: lecture => lecture.ordinal,
                with: {
                  video: true,
                  attachments: true,
                },
              },
            },
          },
        },
      },
    },
  })
