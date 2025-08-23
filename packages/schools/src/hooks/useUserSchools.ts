import { useSuspenseQuery } from "@tanstack/react-query";
import { userSchoolsQueryOptions } from "../machines/userSchoolsMachine";
import type { School } from "../types/SchemaTypes";

/**
 * Custom React hook to fetch a list of schools based on provided school ids.
 *
 * Utilizes the `useSuspenseQuery` hook from `@tanstack/react-query` to perform
 * a suspense-enabled query using the `schoolsQueryOptions` configuration.
 *
 * @param schoolIds - An array of school id numbers to query for.
 * @returns An object containing the fetched array of `School` objects.
 */
export const useUserSchools = ({
  schoolIds,
}: {
  schoolIds: number[];
}): { schools: School[] } => {
  const { data: schools } = useSuspenseQuery(
    userSchoolsQueryOptions({ schoolIds }),
  );
  return { schools };
};
