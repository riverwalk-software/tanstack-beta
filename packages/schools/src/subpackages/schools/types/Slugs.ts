import { Schema } from "effect"
import { SLUG_SCHEMA } from "@/lib/constants"

export const SchoolSlugSchema = SLUG_SCHEMA.pipe(Schema.brand("SchoolSlug"))
export type SchoolSlug = typeof SchoolSlugSchema.Type
export const CourseSlugSchema = SLUG_SCHEMA.pipe(Schema.brand("CourseSlug"))
export type CourseSlug = typeof CourseSlugSchema.Type
