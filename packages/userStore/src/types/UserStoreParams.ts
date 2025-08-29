import { Schema } from "effect"
import {
  ChapterSlugSchema,
  CourseSlugSchema,
  LectureSlugSchema,
  SchoolSlugSchema,
} from "packages/schools/src/subpackages/schools/types/Slugs"

const TAGS = {
  ALL: "ALL",
  SCHOOL: "SCHOOL",
  COURSE: "COURSE",
  LECTURE: "LECTURE",
} as const

export const GetUserStoreParamsSchema = Schema.Union(
  Schema.TaggedStruct(TAGS.ALL, {}),
  Schema.TaggedStruct(TAGS.SCHOOL, {
    schoolSlug: SchoolSlugSchema,
  }),
  Schema.TaggedStruct(TAGS.COURSE, {
    schoolSlug: SchoolSlugSchema,
    courseSlug: CourseSlugSchema,
  }),
)
export type GetUserStoreParams = typeof GetUserStoreParamsSchema.Type

const IsCompleteSchema = Schema.Boolean

export const SetUserStoreParamsSchema = Schema.Union(
  Schema.TaggedStruct(TAGS.ALL, {
    isComplete: IsCompleteSchema,
  }),
  Schema.TaggedStruct(TAGS.SCHOOL, {
    schoolSlug: SchoolSlugSchema,
    isComplete: IsCompleteSchema,
  }),
  Schema.TaggedStruct(TAGS.COURSE, {
    schoolSlug: SchoolSlugSchema,
    courseSlug: CourseSlugSchema,
    isComplete: IsCompleteSchema,
  }),
  Schema.TaggedStruct(TAGS.LECTURE, {
    schoolSlug: SchoolSlugSchema,
    courseSlug: CourseSlugSchema,
    chapterSlug: ChapterSlugSchema,
    lectureSlug: LectureSlugSchema,
    isComplete: IsCompleteSchema,
  }),
)
export type SetUserStoreParams = typeof SetUserStoreParamsSchema.Type

// const BaseParamsSchema = z.object({
//   _tag: z.enum(["ALL", "SCHOOL", "COURSE", "LECTURE"]),
// })

// const SchoolIdSchema = z.object({ schoolId: z.number() })
// const CourseIdSchema = z.object({ courseId: z.number() })
// const ChapterIdSchema = z.object({ chapterId: z.number() })
// const LectureIdSchema = z.object({ lectureId: z.number() })
// const IsCompleteSchema = z.object({ isComplete: z.boolean() })

// export const GetUserStoreParamsSchema = z.discriminatedUnion("_tag", [
//   BaseParamsSchema.extend({ _tag: z.literal("ALL") }),
//   BaseParamsSchema.extend({ _tag: z.literal("SCHOOL") }).merge(SchoolIdSchema),
//   BaseParamsSchema.extend({ _tag: z.literal("COURSE") })
//     .merge(SchoolIdSchema)
//     .merge(CourseIdSchema),
// ])

// export const SetUserStoreParamsSchema = z.discriminatedUnion("_tag", [
//   BaseParamsSchema.extend({ _tag: z.literal("ALL") }).merge(IsCompleteSchema),
//   BaseParamsSchema.extend({ _tag: z.literal("SCHOOL") })
//     .merge(SchoolIdSchema)
//     .merge(IsCompleteSchema),
//   BaseParamsSchema.extend({ _tag: z.literal("COURSE") })
//     .merge(SchoolIdSchema)
//     .merge(CourseIdSchema)
//     .merge(IsCompleteSchema),
//   BaseParamsSchema.extend({ _tag: z.literal("LECTURE") })
//     .merge(SchoolIdSchema)
//     .merge(CourseIdSchema)
//     .merge(ChapterIdSchema)
//     .merge(LectureIdSchema)
//     .merge(IsCompleteSchema),
// ])

// export interface GetUserStoreParams
//   extends Schema.Type<typeof GetUserStoreParamsSchema> {}
// export interface SetUserStoreParams
//   extends Schema.Type<typeof SetUserStoreParamsSchema> {}
