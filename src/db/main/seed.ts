import { promises as fs } from "node:fs";
import path from "node:path";
import { drizzle } from "drizzle-orm/d1";
import { reset, seed } from "drizzle-seed";
import { produce } from "immer";
import mime from "mime-types";
import * as schema from "src/db/main/schema";
import { TEST_USER } from "@/lib/constants";
import type { UserStore } from "@/lib/userStore";

async function main() {
  const { getPlatformProxy } = await import("wrangler");
  const proxy = await getPlatformProxy();
  const { ATTACHMENTS_BUCKET, SCHOOL_DB, USER_STORE } =
    proxy.env as unknown as CloudflareBindings;
  await seedSchoolDatabase(SCHOOL_DB);
  await seedUserStore(SCHOOL_DB, USER_STORE);
  await seedAttachmentsBucket(ATTACHMENTS_BUCKET);
  process.exit(0);
}

const seedSchoolDatabase = async (SCHOOL_DB: D1Database) => {
  const db = drizzle(SCHOOL_DB, { casing: "snake_case" });
  await reset(db, schema);
  await seed(db, schema, { count: 1, seed: 0 }).refine(
    ({ intPrimaryKey, timestamp, uuid, loremIpsum, valuesFromArray }) => ({
      SchoolEntity: {
        count: 1,
        columns: {
          id: intPrimaryKey(),
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
          id: intPrimaryKey(),
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
          id: intPrimaryKey(),
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
          id: intPrimaryKey(),
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
          id: intPrimaryKey(),
          createdAt: timestamp(),
          updatedAt: timestamp(),
          storageId: valuesFromArray({
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
      AttachmentEntity: {
        count: 5,
        columns: {
          id: intPrimaryKey(),
          createdAt: timestamp(),
          updatedAt: timestamp(),
          storageId: valuesFromArray({
            values: [
              "attachments/fronalpstock.jpg",
              "attachments/fsm.png",
              "attachments/backus.pdf",
              "attachments/rockthejvm-site-main.zip",
              "attachments/subtitles.txt",
            ],
            isUnique: true,
          }),
          lectureId: intPrimaryKey(),
        },
      },
    }),
  );
};

const seedUserStore = async (
  SCHOOL_DB: D1Database,
  USER_STORE: KVNamespace,
) => {
  await resetUserStore(USER_STORE);
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

  const userStore: UserStore = produce(
    { schools } as UserStore,
    ({ schools }) => {
      schools.forEach((school) => {
        school.courses.forEach((course) => {
          course.chapters.forEach((chapter) => {
            chapter.lectures.forEach((lecture) => {
              lecture.completed = false;
            });
          });
        });
      });
    },
  );

  await USER_STORE.put(TEST_USER.email, JSON.stringify(userStore));
};

const resetUserStore = async (USER_STORE: KVNamespace) =>
  USER_STORE.delete(TEST_USER.email);

const seedAttachmentsBucket = async (ATTACHMENTS_BUCKET: R2Bucket) => {
  await resetAttachmentsBucket(ATTACHMENTS_BUCKET);
  const attachmentsDir = "src/db/main/attachments";
  const files = await fs.readdir(attachmentsDir);
  for (const filename of files) {
    const filePath = path.join(attachmentsDir, filename);
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) continue;
    const fileBuffer = await fs.readFile(filePath);
    const uint8FileBuffer = new Uint8Array(
      fileBuffer.buffer,
      fileBuffer.byteOffset,
      fileBuffer.byteLength,
    );
    const contentType = mime.lookup(filename) || "application/octet-stream";
    await ATTACHMENTS_BUCKET.put(`attachments/${filename}`, uint8FileBuffer, {
      onlyIf: { etagDoesNotMatch: "*" },
      httpMetadata: {
        contentType,
      },
    });

    console.log(`Uploaded: ${filename} (${contentType})`);
  }
};

const resetAttachmentsBucket = async (ATTACHMENTS_BUCKET: R2Bucket) => {
  const keysResult = await ATTACHMENTS_BUCKET.list();
  const keys = keysResult.objects.map(({ key }) => key);
  if (keys.length > 0) await ATTACHMENTS_BUCKET.delete(keys);
};

main();
