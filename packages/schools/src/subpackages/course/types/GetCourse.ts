import { Schema } from "effect"
import { SLUG_SCHEMA } from "@/lib/constants"

export const GetCourseSchema = Schema.Struct({
  schoolSlug: SLUG_SCHEMA,
  courseSlug: SLUG_SCHEMA,
})

export type GetCourse = typeof GetCourseSchema.Type
