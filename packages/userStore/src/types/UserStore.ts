import z from "zod"
import { ID_SCHEMA } from "@/lib/constants"

export interface UserStore {
  schools: {
    id: number
    courses: {
      id: number
      chaptersAndLectures: ChapterAndLecture[]
    }[]
  }[]
}

export const ChapterAndLectureSchema = z.object({
  chapter: z.object({ id: ID_SCHEMA }),
  lecture: z.object({ id: ID_SCHEMA }),
  isComplete: z.boolean().optional(),
})
export interface ChapterAndLecture
  extends Schema.Type<typeof ChapterAndLectureSchema> {}

// export interface ChapterAndLecture {
//   chapter: {
//     id: number;
//   };
//   lecture: {
//     id: number;
//   };
//   isComplete?: boolean;
// }

export interface UserStoreIds {
  schoolId: number
  courseId: number
  chapterId: number
  lectureId: number
}

export interface UserStoreSlugs {
  schoolSlug: string
  courseSlug: string
  chapterSlug: string
  lectureSlug: string
}
