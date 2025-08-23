import { useSuspenseQuery } from "@tanstack/react-query";
import { schoolsQueryOptions } from "../machines/schoolsMachine";
import type { School } from "../types/SchemaTypes";

/**
 * Custom React hook to fetch a list of schools using React Query's suspense mode.
 *
 * @param schoolSlugs - An optional array of school slugs to filter the schools. Defaults to an empty array, which fetches all schools.
 * @returns An object containing the fetched array of `School` objects.
 *
 * @example
 * const { schools } = useSchools(['school-1', 'school-2']);
 */
export const useSchools = (
  schoolSlugs: string[] = [],
): { schools: School[] } => {
  const { data: schools } = useSuspenseQuery(schoolsQueryOptions(schoolSlugs));
  return { schools };
};
