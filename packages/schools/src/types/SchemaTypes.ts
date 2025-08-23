import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
  AttachmentEntity,
  ChapterEntity,
  CourseEntity,
  LectureEntity,
  SchoolEntity,
  VideoEntity,
} from "../db/schema";

export type School = InferSelectModel<typeof SchoolEntity>;
export type Course = InferSelectModel<typeof CourseEntity>;
export type Chapter = InferSelectModel<typeof ChapterEntity>;
export type Lecture = InferSelectModel<typeof LectureEntity>;
export type Video = InferSelectModel<typeof VideoEntity>;
export type Attachment = InferSelectModel<typeof AttachmentEntity>;
export type CourseWithFirstChapterAndLecture = Course & {
  chapter: ChapterAndLecture;
};
type ChapterAndLecture = Chapter & {
  lecture: Lecture;
};

export type NewSchool = InferInsertModel<typeof SchoolEntity>;
export type NewCourse = InferInsertModel<typeof CourseEntity>;
export type NewChapter = InferInsertModel<typeof ChapterEntity>;
export type NewLecture = InferInsertModel<typeof LectureEntity>;
export type NewVideo = InferInsertModel<typeof VideoEntity>;
export type NewAttachment = InferInsertModel<typeof AttachmentEntity>;
