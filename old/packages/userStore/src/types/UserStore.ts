import { Schema } from "effect"
import {
  ChapterSlugSchema,
  CourseSlugSchema,
  LectureSlugSchema,
  SchoolSlugSchema,
} from "packages/schools/src/subpackages/schools/types/Slugs"

export class ChapterAndLecture extends Schema.Class<ChapterAndLecture>(
  "ChapterAndLecture",
)({
  chapter: Schema.Struct({
    slug: ChapterSlugSchema,
  }),
  lecture: Schema.Struct({
    slug: LectureSlugSchema,
  }),
  isComplete: Schema.optionalWith(Schema.Boolean, { exact: true }),
}) {}

export class UserStore extends Schema.Class<UserStore>("UserStore")({
  schools: Schema.Array(
    Schema.Struct({
      slug: SchoolSlugSchema,
      courses: Schema.Array(
        Schema.Struct({
          slug: CourseSlugSchema,
          chaptersAndLectures: Schema.Array(ChapterAndLecture),
        }),
      ),
    }),
  ),
}) {}

export class UserStoreSlugs extends Schema.Class<UserStoreSlugs>(
  "UserStoreSlugs",
)({
  schoolSlug: SchoolSlugSchema,
  courseSlug: CourseSlugSchema,
  chapterSlug: ChapterSlugSchema,
  lectureSlug: LectureSlugSchema,
}) {}
