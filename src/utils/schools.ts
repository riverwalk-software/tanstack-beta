import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "src/db/main/schema";
import { getCloudflareBindings } from "@/utils/getCloudflareBindings";

const getSchoolsFn = createServerFn().handler(async () => {
  const { SCHOOL_DB } = getCloudflareBindings();
  const db = drizzle(SCHOOL_DB, { casing: "snake_case", schema });
  const schools = await db.query.SchoolEntity.findMany();
  return schools;
});

export const schoolsQueryOptions = queryOptions({
  queryKey: ["schools"],
  queryFn: () => getSchoolsFn(),
});

const getCoursesFn = createServerFn()
  .validator((data: string) => data)
  .handler(async ({ data: schoolSlug }) => {
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
    if (school === undefined) return [];
    const { courses } = school;
    return courses;
  });

export const coursesQueryOptions = (schoolSlug: string) =>
  queryOptions({
    queryKey: ["schools", schoolSlug, "courses"],
    queryFn: () => getCoursesFn({ data: schoolSlug }),
  });

const getChaptersAndLecturesFn = createServerFn()
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
    if (school === undefined) return [];
    if (school.courses.length === 0) return [];
    const chaptersAndLectures = school.courses.flatMap(
      ({ chapters }) => chapters,
    );
    return chaptersAndLectures;
  });

export const chaptersAndLecturesQueryOptions = (
  schoolSlug: string,
  courseSlug: string,
) =>
  queryOptions({
    queryKey: [
      "schools",
      schoolSlug,
      "courses",
      courseSlug,
      "chaptersAndLectures",
    ],
    queryFn: () =>
      getChaptersAndLecturesFn({ data: { schoolSlug, courseSlug } }),
  });

const getLectureFn = createServerFn()
  .validator(
    (data: { schoolSlug: string; courseSlug: string; lectureSlug: string }) =>
      data,
  )
  .handler(async ({ data: { schoolSlug, courseSlug, lectureSlug } }) => {
    const chaptersAndLectures = await getChaptersAndLecturesFn({
      data: { schoolSlug, courseSlug },
    });
    const lectures = chaptersAndLectures.flatMap(({ lectures }) => lectures);
    const lecture = lectures.find((lecture) => lecture.slug === lectureSlug)!;
    return lecture;
  });

export const lectureQueryOptions = (
  schoolSlug: string,
  courseSlug: string,
  lectureSlug: string,
) =>
  queryOptions({
    queryKey: [
      "schools",
      schoolSlug,
      "courses",
      courseSlug,
      "chaptersAndLectures",
      lectureSlug,
      "lecture",
    ],
    queryFn: () =>
      getLectureFn({ data: { schoolSlug, courseSlug, lectureSlug } }),
  });
