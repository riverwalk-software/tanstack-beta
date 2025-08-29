import type { List } from "@prelude"
import { createServerFn } from "@tanstack/react-start"
import { inArray } from "drizzle-orm"
import { Context, Effect, Option, Schema } from "effect"
import { effectRunPromise } from "@/utils/effect"
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings"
import type { School } from "../../../types/SchemaTypes"
import { createDb } from "../../../utils/createDb"
import { GetSchoolsSchema } from "../types/GetSchools"

// TODO: Paginate
export const getSchoolsFn = createServerFn()
  .validator(Schema.decodeUnknownSync(GetSchoolsSchema))
  .handler(
    ({ data: { schoolSlugs: missableSchoolSlugs } }): Promise<List<School>> => {
      const cloudflareBindings = getCloudflareBindings()
      const context = Context.empty().pipe(
        Context.add(CloudflareBindingsService, cloudflareBindings),
      )
      const program = Effect.gen(function* () {
        const { SCHOOL_DB } = yield* CloudflareBindingsService
        const db = yield* Effect.sync(() => createDb(SCHOOL_DB))
        const maybeSchoolSlugs = Option.fromNullable(missableSchoolSlugs)
        return yield* Effect.promise(() =>
          getSchools({ db, schoolSlugs: maybeSchoolSlugs }),
        )
      })
      return effectRunPromise({ context, program })
    },
  )

const getSchools = ({
  db,
  schoolSlugs: maybeSchoolSlugs,
}: {
  db: ReturnType<typeof createDb>
  schoolSlugs: Option.Option<List<string>>
}) =>
  Option.match(maybeSchoolSlugs, {
    onNone: () =>
      db.query.SchoolEntity.findMany({
        orderBy: school => school.name,
      }),
    onSome: schoolSlugs =>
      db.query.SchoolEntity.findMany({
        where: school => inArray(school.slug, schoolSlugs),
        orderBy: school => school.name,
      }),
  })
