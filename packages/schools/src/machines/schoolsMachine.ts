import { queryOptions } from "@tanstack/react-query";
import { match, P } from "ts-pattern";
import { getSchoolsFn } from "../logic/schoolsLogic";

export const schoolsQueryOptions = ({
  schoolSlugs: maybeSchoolSlugs,
}: {
  schoolSlugs?: string[];
}) => {
  const sortedSchoolSlugs = match(maybeSchoolSlugs)
    .with(P.nullish, () => undefined)
    .otherwise((schoolSlugs) => [...schoolSlugs.sort()]);
  return queryOptions({
    queryKey: ["schools", { schoolSlugs: sortedSchoolSlugs }],
    queryFn: () => getSchoolsFn({ data: { schoolSlugs: sortedSchoolSlugs } }),
  });
};
