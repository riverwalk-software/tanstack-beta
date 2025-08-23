import { eq } from "drizzle-orm";
import type { createDb } from "../utils/createDb";

export const getUserCourses = ({
  db,
  schoolId,
}: {
  db: ReturnType<typeof createDb>;
  schoolId: number;
}) =>
  db.query.CourseEntity.findMany({
    where: (course) => eq(course.schoolId, schoolId),
    orderBy: (course) => course.title,
    with: {
      chapters: {
        limit: 1,
        orderBy: (chapter) => chapter.ordinal,
        with: {
          lectures: {
            limit: 1,
            orderBy: (lecture) => lecture.ordinal,
          },
        },
      },
    },
  });
