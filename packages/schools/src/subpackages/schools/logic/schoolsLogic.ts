import { createServerFn } from "@tanstack/react-start"
import { inArray } from "drizzle-orm"
import { Context, Effect } from "effect"
import { match, P } from "ts-pattern"
import z from "zod"
import { SLUG_SCHEMA } from "@/lib/constants"
import { effectRunPromise } from "@/utils/effect"
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings"
import type { School } from "../../../types/SchemaTypes"
import { createDb } from "../../../utils/createDb"

const GetSchoolsParams = z.object({
  schoolSlugs: z.array(SLUG_SCHEMA).optional(),
})
// TODO: Paginate
export const getSchoolsFn = createServerFn()
  .validator(GetSchoolsParams)
  .handler(async ({ data: { schoolSlugs } }): Promise<School[]> => {
    const cloudflareBindings = getCloudflareBindings()
    const context = Context.empty().pipe(
      Context.add(CloudflareBindingsService, cloudflareBindings),
    )
    const program = Effect.gen(function* () {
      const { SCHOOL_DB } = yield* CloudflareBindingsService
      const db = yield* Effect.sync(() => createDb(SCHOOL_DB))
      return yield* Effect.promise(() => getSchools({ db, schoolSlugs }))
    })
    return effectRunPromise({ context, program })
  })

const getSchools = ({
  db,
  schoolSlugs: maybeSchoolSlugs,
}: {
  db: ReturnType<typeof createDb>
  schoolSlugs?: string[]
}) =>
  match(maybeSchoolSlugs)
    .with(P.nullish, () =>
      db.query.SchoolEntity.findMany({
        orderBy: school => school.name,
      }),
    )
    .otherwise(schoolSlugs =>
      db.query.SchoolEntity.findMany({
        where: school => inArray(school.slug, schoolSlugs),
        orderBy: school => school.name,
      }),
    )
