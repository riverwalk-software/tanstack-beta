import { inArray } from "drizzle-orm";
import type { createDb } from "../utils/createDb";

export const getUserSchools = ({
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
