import { useSuspenseQuery } from "@tanstack/react-query";
import type { School } from "../../../types/SchemaTypes";
import { schoolsQueryOptions } from "../machines/schoolsMachine";

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
