import { createServerFn } from "@tanstack/react-start";
import { inArray } from "drizzle-orm";
import { Context, Effect } from "effect";
import { match } from "ts-pattern";
import z from "zod";
import { SLUG_LENGTH } from "@/lib/constants";
import { SERVICE_UNAVAILABLE } from "@/lib/errors";
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings";
import type { School } from "../types/SchemaTypes";
import { createDb } from "../utils/createDb";

const Input = z.object({
  schoolSlugs: z.array(
    z.string().min(SLUG_LENGTH.MINIMUM).max(SLUG_LENGTH.MAXIMUM),
  ),
});

export const getSchoolsFn = createServerFn()
  .validator(Input)
  .handler(async ({ data: { schoolSlugs } }): Promise<School[]> => {
    const cloudflareBindings = getCloudflareBindings();
    const program = Effect.gen(function* () {
      const { SCHOOL_DB } = yield* CloudflareBindingsService;
      const db = yield* Effect.sync(() => createDb(SCHOOL_DB));
      const schools = yield* Effect.promise(() =>
        match(schoolSlugs.length)
          .returnType<Promise<School[]>>()
          .with(0, () =>
            db.query.SchoolEntity.findMany({ orderBy: (school) => school.id }),
          )
          .otherwise(() =>
            db.query.SchoolEntity.findMany({
              where: (school) => inArray(school.slug, schoolSlugs),
              orderBy: (school) => school.id,
            }),
          ),
      );
      return schools;
    });
    const context = Context.empty().pipe(
      Context.add(CloudflareBindingsService, cloudflareBindings),
    );
    const provided = Effect.provide(program, context);
    const runnable = Effect.catchAllDefect(provided, (defect) => {
      console.error(defect);
      return Effect.fail(new SERVICE_UNAVAILABLE());
    });
    const schools = await Effect.runPromise(runnable);
    return schools;
  });
