import { drizzle } from "drizzle-orm/d1";
import { reset, seed } from "drizzle-seed";
import * as schema from "src/db/main/schema";

async function main() {
  const { getPlatformProxy } = await import("wrangler");
  const proxy = await getPlatformProxy();
  const { SCHOOL_DB, PROGRESS_STORE } =
    proxy.env as unknown as CloudflareBindings;
  await seedSchoolDatabase(SCHOOL_DB);
  await seedProgressStore(SCHOOL_DB, PROGRESS_STORE);
  const store = await PROGRESS_STORE.get<ProgressStore>("TestUser", {
    type: "json",
  });
  console.log("PROGRESS_STORE seeded with:", store);
  process.exit(0);
}

async function seedSchoolDatabase(SCHOOL_DB: D1Database) {
  const db = drizzle(SCHOOL_DB, { casing: "snake_case" });
  await reset(db, schema);
  await seed(db, schema, { count: 1, seed: 0 }).refine(
    ({
      intPrimaryKey,
      companyName,
      timestamp,
      uuid,
      city,
      loremIpsum,
      valuesFromArray,
    }) => ({
      SchoolEntity: {
        count: 1,
        columns: {
          // id: intPrimaryKey(),
          createdAt: timestamp(),
          updatedAt: timestamp(),
          slug: uuid(),
          name: valuesFromArray({ values: ["Rock the JVM"], isUnique: true }),
          description: loremIpsum(),
        },
      },
      CourseEntity: {
        count: 2,
        columns: {
          // id: intPrimaryKey(),
          createdAt: timestamp(),
          updatedAt: timestamp(),
          slug: uuid(),
          title: valuesFromArray({
            values: [
              "Scala for the Impatient",
              "Advanced Scala",
              "Scala for Data Science",
              "Haskell for the Impatient",
            ],
            isUnique: true,
          }),
          description: loremIpsum(),
        },
      },
      ChapterEntity: {
        count: 5,
        columns: {
          // id: intPrimaryKey(),
          createdAt: timestamp(),
          updatedAt: timestamp(),
          ordinal: intPrimaryKey(),
          slug: uuid(),
          title: valuesFromArray({
            values: [
              "Introduction to Scala",
              "Advanced Scala Concepts",
              "Data Science with Scala",
              "Haskell Basics",
              "Functional Programming in Haskell",
            ],
            isUnique: true,
          }),
        },
      },
      LectureEntity: {
        count: 8,
        columns: {
          // id: intPrimaryKey(),
          createdAt: timestamp(),
          updatedAt: timestamp(),
          ordinal: intPrimaryKey(),
          slug: uuid(),
          title: valuesFromArray({
            values: [
              "Introduction",
              "Advanced Topics",
              "Data Science Applications",
              "Haskell Fundamentals",
              "Functional Programming Techniques",
              "Scala for Data Engineers",
              "Haskell for Data Scientists",
              "Advanced Haskell Patterns",
            ],
            isUnique: true,
          }),
          description: loremIpsum(),
        },
      },
      VideoEntity: {
        count: 8,
        columns: {
          createdAt: timestamp(),
          updatedAt: timestamp(),
          videoId: valuesFromArray({
            values: [
              "90c4d864-aa2c-4ead-8526-65368d37fc3d",
              "c8d11043-24ea-4dc8-854a-78d6c3e7f832",
              "ef8bf91d-e221-4d6b-b43b-2986778f612c",
              "fdf7f71f-00ab-4ccb-9808-7dd22ea24427",
              "d6066363-eb8e-4d47-81bb-e7bb62526a24",
              "38b0a916-5759-4caf-b4d1-335ac2307f7b",
              "e8bdf362-1789-4643-8c24-e241e8609ac2",
              "ca2dbda4-aa6f-4197-8f05-54a0b5660c21",
            ],
            isUnique: true,
          }),
          lectureId: intPrimaryKey(),
        },
      },
    }),
  );
}

async function seedProgressStore(
  SCHOOL_DB: D1Database,
  PROGRESS_STORE: KVNamespace,
) {
  const db = drizzle(SCHOOL_DB, { casing: "snake_case", schema });
  const schools = await db.query.SchoolEntity.findMany({
    with: {
      courses: {
        with: {
          chapters: {
            with: {
              lectures: true,
            },
          },
        },
      },
    },
  });
  await PROGRESS_STORE.put(
    "TestUser",
    JSON.stringify({
      schools: [
        ...schools.map((school) => ({
          schoolSlug: school.slug,
          courses: school.courses.map((course) => ({
            courseSlug: course.slug,
            lectures: course.chapters.flatMap((chapter) =>
              chapter.lectures.map((lecture) => ({
                lectureSlug: lecture.slug,
                completed: false,
              })),
            ),
          })),
        })),
      ],
    } as ProgressStore),
  );
}

main();

export interface ProgressStore {
  schools: {
    schoolSlug: string;
    courses: {
      courseSlug: string;
      lectures: {
        lectureSlug: string;
        completed: boolean;
      }[];
    }[];
  }[];
}

// async function main() {
//   try {
//     const { getPlatformProxy } = await import("wrangler");
//     const proxy = await getPlatformProxy();
//     const { SCHOOL_DB } = proxy.env as unknown as CloudflareBindings;
//     const db = drizzle(SCHOOL_DB);

//     const seedData = {
//       title: "Sample Post Title",
//       content: "This is a sample post content",
//     };

//     const existingPost = await db
//       .select()
//       .from(postsTable2)
//       .where(eq(postsTable2.title, seedData.title))
//       .get();

//     if (existingPost) {
//       console.log("Post already exists, skipping creation");
//     } else {
//       await db.insert(postsTable2).values(seedData);
//       console.log("New post created!");
//     }

//     const posts = await db.select().from(postsTable2);
//     console.log("Getting all posts from the database:", posts);
//     process.exit(0);
//   } catch (error) {
//     console.error("Error seeding database:", error);
//     process.exit(1);
//   }
// }

// main();
