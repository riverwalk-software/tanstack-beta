import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "src/db/main/schema";
import { getCloudflareBindings } from "@/utils/getCloudflareBindings";

const getSchoolsFn = createServerFn()
  .validator((data: { schoolSlugs: string[] }) => data)
  .handler(async ({ data: { schoolSlugs } }) => {
    const { SCHOOL_DB } = getCloudflareBindings();
    const db = drizzle(SCHOOL_DB, { casing: "snake_case", schema });
    const schools = await db.query.SchoolEntity.findMany({
      where: (school) => inArray(school.slug, schoolSlugs),
    });
    return schools;
  });

export const schoolsQueryOptions = (schoolSlugs: string[]) =>
  queryOptions({
    queryKey: ["schools"],
    queryFn: () => getSchoolsFn({ data: { schoolSlugs } }),
  });

const getCoursesFn = createServerFn()
  .validator((data: { schoolSlug: string }) => data)
  .handler(async ({ data: { schoolSlug } }) => {
    const { SCHOOL_DB } = getCloudflareBindings();
    const db = drizzle(SCHOOL_DB, { casing: "snake_case", schema });
    const school = await db.query.SchoolEntity.findFirst({
      where: (school) => eq(school.slug, schoolSlug),
      with: {
        courses: {
          with: {
            chapters: {
              orderBy: (chapter) => chapter.ordinal,
              limit: 1,
              with: {
                lectures: {
                  orderBy: (lecture) => lecture.ordinal,
                  limit: 1,
                },
              },
            },
          },
        },
      },
    });
    const { courses } = school!;
    return courses;
  });

export const coursesQueryOptions = ({ schoolSlug }: { schoolSlug: string }) =>
  queryOptions({
    queryKey: ["schools", schoolSlug, "courses"],
    queryFn: () => getCoursesFn({ data: { schoolSlug } }),
  });

const getCourseFn = createServerFn()
  .validator((data: { schoolSlug: string; courseSlug: string }) => data)
  .handler(async ({ data: { schoolSlug, courseSlug } }) => {
    const { SCHOOL_DB } = getCloudflareBindings();
    const db = drizzle(SCHOOL_DB, { casing: "snake_case", schema });
    const school = await db.query.SchoolEntity.findFirst({
      where: (school) => eq(school.slug, schoolSlug),
      with: {
        courses: {
          where: (course) => eq(course.slug, courseSlug),
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
        },
      },
    });
    const { courses } = school!;
    const course = courses.find((course) => course.slug === courseSlug)!;
    return course;
  });

export type Course = Awaited<ReturnType<typeof getCourseFn>>;

export const courseQueryOptions = ({
  schoolSlug,
  courseSlug,
}: {
  schoolSlug: string;
  courseSlug: string;
}) =>
  queryOptions({
    queryKey: [
      "schools",
      schoolSlug,
      "courses",
      courseSlug,
      "chaptersAndLectures",
    ],
    queryFn: () => getCourseFn({ data: { schoolSlug, courseSlug } }),
  });
