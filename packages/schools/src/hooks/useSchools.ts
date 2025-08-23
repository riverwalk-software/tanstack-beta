import { useSuspenseQuery } from "@tanstack/react-query";
import { schoolsQueryOptions } from "../machines/schoolsMachine";
import type { School } from "../types/SchemaTypes";

export const useSchools = ({
  schoolSlugs,
}: {
  schoolSlugs?: string[];
} = {}): { schools: School[] } => {
  const { data: schools } = useSuspenseQuery(
    schoolsQueryOptions({ schoolSlugs }),
  );
  return { schools };
};
