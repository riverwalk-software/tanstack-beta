import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { Context, Effect } from "effect";
import z from "zod";
import { ID_SCHEMA } from "@/lib/constants";
import { effectRunPromise } from "@/utils/effect";
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings";
import { getUserSchools } from "../logic/userSchoolsLogic";
import type { School } from "../types/SchemaTypes";
import { createDb } from "../utils/createDb";

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

const Params = z.object({
  schoolIds: z.array(ID_SCHEMA),
});

// TODO: Paginate
const getUserSchoolsFn = createServerFn()
  .validator(Params)
  .handler(async ({ data: { schoolIds } }): Promise<School[]> => {
    const cloudflareBindings = getCloudflareBindings();
    const context = Context.empty().pipe(
      Context.add(CloudflareBindingsService, cloudflareBindings),
    );
    const program = Effect.gen(function* () {
      const { SCHOOL_DB } = yield* CloudflareBindingsService;
      const db = yield* Effect.sync(() => createDb(SCHOOL_DB));
      return yield* Effect.promise(() => getUserSchools({ db, schoolIds }));
    });
    return effectRunPromise({ context, program });
  });
