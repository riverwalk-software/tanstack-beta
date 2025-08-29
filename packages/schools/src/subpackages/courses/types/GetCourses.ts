import { Schema } from "effect"
import { SLUG_SCHEMA } from "@/lib/constants"

export const GetCoursesSchema = Schema.Struct({
  schoolSlug: SLUG_SCHEMA,
})

export type GetCourses = typeof GetCoursesSchema.Type
