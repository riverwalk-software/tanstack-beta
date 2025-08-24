import { eq } from "drizzle-orm";
import type { createDb } from "../src/utils/createDb";

export const getSchool = ({
  db,
  schoolSlug,
}: {
  db: ReturnType<typeof createDb>;
  schoolSlug: string;
}) =>
  db.query.SchoolEntity.findFirst({
    where: (school) => eq(school.slug, schoolSlug),
  });
