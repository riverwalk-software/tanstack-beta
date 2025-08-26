import { relations, sql } from "drizzle-orm"
import * as d from "drizzle-orm/sqlite-core"
import { sqliteTable as table, unique } from "drizzle-orm/sqlite-core"

const id = { id: d.integer().primaryKey({ autoIncrement: true }) }
const timestamps = {
  createdAt: d
    .integer({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`),
  updatedAt: d
    .integer({ mode: "timestamp_ms" })
    .notNull()
    .$onUpdateFn(() => sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`),
}

export const SchoolEntity = table("schools", {
  ...id,
  ...timestamps,
  slug: d.text({ length: 100 }).notNull().unique(),
  name: d.text({ length: 100 }).notNull().unique(),
  description: d
    .text({
      length: 500,
    })
    .notNull(),
  // status: d
  //   .text({ enum: ["active", "inactive"] })
  //   .notNull()
  //   .default("active"),
})

export const SchoolRelationships = relations(SchoolEntity, ({ many }) => ({
  courses: many(CourseEntity),
}))

export const CourseEntity = table(
  "courses",
  {
    ...id,
    ...timestamps,
    slug: d.text({ length: 100 }).notNull(),
    title: d
      .text({
        length: 200,
      })
      .notNull(),
    description: d
      .text({
        length: 500,
      })
      .notNull(),
    // status: d
    //   .text({ enum: ["archived", "active"] })
    //   .notNull()
    //   .default("active"),
    schoolId: d
      .integer()
      .notNull()
      .references(() => SchoolEntity.id, {
        onDelete: "cascade",
      }),
  },
  table => [
    unique("unique_slug_per_school").on(table.slug, table.schoolId),
    unique("unique_title_per_school").on(table.title, table.schoolId),
  ],
)

export const CourseRelationships = relations(CourseEntity, ({ many, one }) => ({
  school: one(SchoolEntity, {
    fields: [CourseEntity.schoolId],
    references: [SchoolEntity.id],
  }),
  chapters: many(ChapterEntity),
}))

export const ChapterEntity = table(
  "chapters",
  {
    ...id,
    ...timestamps,
    ordinal: d.integer().notNull(),
    slug: d
      .text({
        length: 100,
      })
      .notNull(),
    title: d
      .text({
        length: 200,
      })
      .notNull(),
    courseId: d
      .integer()
      .notNull()
      .references(() => CourseEntity.id, {
        onDelete: "cascade",
      }),
  },
  table => [
    unique("unique_ordinal_per_course").on(table.ordinal, table.courseId),
    unique("unique_slug_per_course").on(table.slug, table.courseId),
    unique("unique_title_per_course").on(table.title, table.courseId),
  ],
)

export const ChapterRelationships = relations(
  ChapterEntity,
  ({ one, many }) => ({
    course: one(CourseEntity, {
      fields: [ChapterEntity.courseId],
      references: [CourseEntity.id],
    }),
    lectures: many(LectureEntity),
  }),
)

export const LectureEntity = table(
  "lectures",
  {
    ...id,
    ...timestamps,
    ordinal: d.integer().notNull(),
    slug: d
      .text({
        length: 100,
      })
      .notNull(),
    title: d
      .text({
        length: 200,
      })
      .notNull(),
    description: d
      .text({
        length: 500,
      })
      .notNull(),
    chapterId: d
      .integer()
      .notNull()
      .references(() => ChapterEntity.id, {
        onDelete: "cascade",
      }),
  },
  table => [
    unique("unique_ordinal_per_chapter").on(table.ordinal, table.chapterId),
    unique("unique_slug_per_chapter").on(table.slug, table.chapterId),
    unique("unique_title_per_chapter").on(table.title, table.chapterId),
  ],
)

export const LectureRelationships = relations(
  LectureEntity,
  ({ one, many }) => ({
    chapter: one(ChapterEntity, {
      fields: [LectureEntity.chapterId],
      references: [ChapterEntity.id],
    }),
    video: one(VideoEntity),
    attachments: many(AttachmentEntity),
  }),
)

export const VideoEntity = table("videos", {
  ...id,
  ...timestamps,
  storageId: d.text({ length: 200 }).notNull().unique(),
  lectureId: d
    .integer()
    .notNull()
    .unique()
    .references(() => LectureEntity.id, {
      onDelete: "cascade",
    }),
})

export const VideoRelationships = relations(VideoEntity, ({ one }) => ({
  lecture: one(LectureEntity, {
    fields: [VideoEntity.lectureId],
    references: [LectureEntity.id],
  }),
}))

export const AttachmentEntity = table("attachments", {
  ...id,
  ...timestamps,
  storageId: d
    .text({
      length: 200,
    })
    .notNull()
    .unique(),
  lectureId: d
    .integer()
    .notNull()
    .references(() => LectureEntity.id, {
      onDelete: "cascade",
    }),
})

export const AttachmentRelationships = relations(
  AttachmentEntity,
  ({ one }) => ({
    lecture: one(LectureEntity, {
      fields: [AttachmentEntity.lectureId],
      references: [LectureEntity.id],
    }),
  }),
)
