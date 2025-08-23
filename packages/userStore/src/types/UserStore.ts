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
