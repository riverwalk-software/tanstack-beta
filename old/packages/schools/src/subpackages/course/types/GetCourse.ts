import { Schema } from "effect"
import { CourseSlugSchema, SchoolSlugSchema } from "../../schools/types/Slugs"

export const GetCourseSchema = Schema.Struct({
  schoolSlug: SchoolSlugSchema,
  courseSlug: CourseSlugSchema,
})

export type GetCourse = typeof GetCourseSchema.Type
