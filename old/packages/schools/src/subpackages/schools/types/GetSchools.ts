import { Schema } from "effect"
import { SchoolSlugSchema } from "./Slugs"

export const GetSchoolsSchema = Schema.Struct({
  schoolSlugs: Schema.optionalWith(Schema.Array(SchoolSlugSchema), {
    exact: true,
  }),
})

export type GetSchools = typeof GetSchoolsSchema.Type
