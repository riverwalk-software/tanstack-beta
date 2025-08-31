import { Schema } from "effect"
import { SchoolSlugSchema } from "../../schools/types/Slugs"

export const GetCoursesSchema = Schema.Struct({
  schoolSlug: SchoolSlugSchema,
})

export type GetCourses = typeof GetCoursesSchema.Type
