import { queryOptions } from "@tanstack/react-query";
import { getUserSchoolsFn } from "../logic/userSchoolsLogic";

export const userSchoolsQueryOptions = ({
  schoolIds,
}: {
  schoolIds: number[];
}) => {
  const sortedSchoolIds = [...schoolIds.sort()];
  return queryOptions({
    queryKey: ["userSchools", { schoolIds: sortedSchoolIds }],
    queryFn: () => getUserSchoolsFn({ data: { schoolIds: sortedSchoolIds } }),
  });
};
