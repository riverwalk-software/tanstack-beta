import { createServerFn } from "@tanstack/react-start";
import { inArray } from "drizzle-orm";
import { Context, Effect } from "effect";
import z from "zod";
import { ID_SCHEMA } from "@/lib/constants";
import { effectRunPromise } from "@/utils/effect";
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings";
import type { School } from "../types/SchemaTypes";
import { createDb } from "../utils/createDb";

const GetUserSchoolsParams = z.object({
  schoolIds: z.array(ID_SCHEMA),
});
// TODO: Paginate
export const getUserSchoolsFn = createServerFn()
  .validator(GetUserSchoolsParams)
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

const getUserSchools = ({
  db,
  schoolIds,
}: {
  db: ReturnType<typeof createDb>;
  schoolIds: number[];
}) =>
  db.query.SchoolEntity.findMany({
    where: (school) => inArray(school.id, schoolIds),
    orderBy: (school) => school.name,
  });
