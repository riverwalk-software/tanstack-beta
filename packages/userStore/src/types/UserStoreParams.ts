import { z } from "zod"

const BaseParamsSchema = z.object({
  _tag: z.enum(["ALL", "SCHOOL", "COURSE", "CHAPTER", "LECTURE"]),
})

const SchoolIdSchema = z.object({ schoolId: z.number() })
const CourseIdSchema = z.object({ courseId: z.number() })
const ChapterIdSchema = z.object({ chapterId: z.number() })
const LectureIdSchema = z.object({ lectureId: z.number() })
const IsCompleteSchema = z.object({ isComplete: z.boolean() })

export const GetUserStoreParamsSchema = z.discriminatedUnion("_tag", [
  BaseParamsSchema.extend({ _tag: z.literal("ALL") }),
  BaseParamsSchema.extend({ _tag: z.literal("SCHOOL") }).merge(SchoolIdSchema),
  BaseParamsSchema.extend({ _tag: z.literal("COURSE") })
    .merge(SchoolIdSchema)
    .merge(CourseIdSchema),
])

export const SetUserStoreParamsSchema = z.discriminatedUnion("_tag", [
  BaseParamsSchema.extend({ _tag: z.literal("ALL") }).merge(IsCompleteSchema),
  BaseParamsSchema.extend({ _tag: z.literal("SCHOOL") })
    .merge(SchoolIdSchema)
    .merge(IsCompleteSchema),
  BaseParamsSchema.extend({ _tag: z.literal("COURSE") })
    .merge(SchoolIdSchema)
    .merge(CourseIdSchema)
    .merge(IsCompleteSchema),
  BaseParamsSchema.extend({ _tag: z.literal("LECTURE") })
    .merge(SchoolIdSchema)
    .merge(CourseIdSchema)
    .merge(ChapterIdSchema)
    .merge(LectureIdSchema)
    .merge(IsCompleteSchema),
])

export interface GetUserStoreParams
  extends Schema.Type<typeof GetUserStoreParamsSchema> {}
export interface SetUserStoreParams
  extends Schema.Type<typeof SetUserStoreParamsSchema> {}
