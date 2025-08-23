import { queryOptions } from "@tanstack/react-query";
import { getSchoolsFn } from "../logic/schoolsLogic";

export const schoolsQueryOptions = (schoolSlugs: string[] = []) =>
  queryOptions({
    queryKey: ["schools", ...schoolSlugs.sort()],
    queryFn: () => getSchoolsFn({ data: { schoolSlugs } }),
  });
