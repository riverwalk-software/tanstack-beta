import { drizzle } from "drizzle-orm/d1";
import { reset, seed } from "drizzle-seed";
import {
  AttachmentEntity,
  ChapterEntity,
  CourseEntity,
  LectureEntity,
  SchoolEntity,
  VideoEntity,
} from "./schema";

async function main() {
  const { getPlatformProxy } = await import("wrangler");
  const proxy = await getPlatformProxy();
  const { SCHOOL_DB } = proxy.env as unknown as CloudflareBindings;
  const db = drizzle(SCHOOL_DB, { casing: "snake_case" });
  const schema = {
    SchoolEntity,
    CourseEntity,
    ChapterEntity,
    LectureEntity,
    VideoEntity,
    AttachmentEntity,
  };
  await reset(db, schema);
  await seed(db, schema, { count: 1, seed: 0 }).refine(
    ({ intPrimaryKey, companyName, timestamp, uuid, city, loremIpsum }) => ({
      SchoolEntity: {
        columns: {
          // id: intPrimaryKey(),
          createdAt: timestamp(),
          updatedAt: timestamp(),
          slug: uuid(),
          name: companyName({ isUnique: true }),
        },
      },
      CourseEntity: {
        columns: {
          // id: intPrimaryKey(),
          createdAt: timestamp(),
          updatedAt: timestamp(),
          slug: uuid(),
          title: city({ isUnique: true }),
          description: loremIpsum(),
        },
      },
      ChapterEntity: {
        columns: {
          // id: intPrimaryKey(),
          createdAt: timestamp(),
          updatedAt: timestamp(),
          ordinal: intPrimaryKey(),
          slug: uuid(),
          title: city({ isUnique: true }),
        },
      },
      LectureEntity: {
        columns: {
          // id: intPrimaryKey(),
          createdAt: timestamp(),
          updatedAt: timestamp(),
          ordinal: intPrimaryKey(),
          slug: uuid(),
          title: city({ isUnique: true }),
          description: loremIpsum(),
        },
      },
    }),
  );
  process.exit(0);
}
main();

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
