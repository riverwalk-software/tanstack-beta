import type { List } from "@prelude"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Option } from "effect"
import type { School } from "../../../types/SchemaTypes"
import { schoolsQueryOptions } from "../machines/schoolsMachine"
import type { GetSchools } from "../types/GetSchools"

/**
 * React hook to fetch a list of schools, optionally filtered by school slugs.
 * *
 * @param {Object} [params] - Optional parameters.
 * @param {SchoolSlug[] | undefined} [params.schoolSlugs] - Optional list of school slugs to filter the schools.
 * @returns {{ schools: List<School> }} An object containing the list of schools.
 *
 * @example
 * // Get all schools
 * const { schools } = useSchools();
 *
 * @example
 * // Get specific schools by slugs
 * const { schools } = useSchools({ schoolSlugs: ["harvard", "mit"] });
 */
export const useSchools = ({
  schoolSlugs: missableSchoolSlugs,
}: GetSchools = {}): { schools: List<School> } => {
  const maybeSchoolSlugs = Option.fromNullable(missableSchoolSlugs)
  const { data: schools } = useSuspenseQuery(
    schoolsQueryOptions({ schoolSlugs: maybeSchoolSlugs }),
  )
  return { schools }
}
