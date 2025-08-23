export interface UserStore {
  schools: {
    id: number;
    courses: {
      id: number;
      chaptersAndLectures: ChapterAndLecture[];
    }[];
  }[];
}

export interface ChapterAndLecture {
  chapter: {
    id: number;
  };
  lecture: {
    id: number;
  };
  isComplete?: boolean;
}

export interface UserStoreIds {
  schoolId: number;
  courseId: number;
  chapterId: number;
  lectureId: number;
}

export interface UserStoreSlugs {
  schoolSlug: string;
  courseSlug: string;
  chapterSlug: string;
  lectureSlug: string;
}
