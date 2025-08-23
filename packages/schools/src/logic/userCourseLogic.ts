import { eq } from "drizzle-orm";
import type { createDb } from "../utils/createDb";

export const getUserCourse = ({
  db,
  schoolId,
  courseId,
}: {
  db: ReturnType<typeof createDb>;
  schoolId: number;
  courseId: number;
}) =>
  db.query.CourseEntity.findFirst({
    where: (course) => eq(course.schoolId, schoolId) && eq(course.id, courseId),
    with: {
      chapters: {
        orderBy: (chapter) => chapter.ordinal,
        with: {
          lectures: {
            orderBy: (lecture) => lecture.ordinal,
            with: {
              video: true,
              attachments: true,
            },
          },
        },
      },
    },
  });
