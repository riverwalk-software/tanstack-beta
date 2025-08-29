import { Schema } from "effect"
import { SLUG_SCHEMA } from "@/lib/constants"

export const GetSchoolsSchema = Schema.Struct({
  schoolSlugs: Schema.optionalWith(Schema.Array(SLUG_SCHEMA), {
    exact: true,
  }),
})

export type GetSchools = typeof GetSchoolsSchema.Type
