import { SortedSet, type Stream } from "@rimbu/core";
import { useMemo, useState } from "react";

export const useExerciseList = (): Return => {
  const [exerciseList, setExerciseList] = useState<ExerciseList>(() =>
    ExerciseSortedSet.from([
      {
        slug: "squat",
        name: "Squat",
        description:
          "A lower body exercise that targets the quadriceps, hamstrings, and glutes.",
      },
      {
        slug: "bench-press",
        name: "Bench Press",
        description:
          "A upper body exercise that targets the chest, shoulders, and triceps.",
      },
      {
        slug: "deadlift",
        name: "Deadlift",
        description:
          "A compound exercise that targets the back, glutes, and hamstrings.",
      },
    ]),
  );

  const state = {
    exerciseList: exerciseList.stream(),
  } satisfies State;

  const mutations = {
    addExercise: (exercise: Exercise) =>
      setExerciseList((prev) => prev.add(exercise)),
    removeExercise: (slug: string) =>
      setExerciseList((prev) => prev.remove({ slug })),
  } satisfies Mutations;

  return useMemo(() => ({ ...state, ...mutations }), [state, mutations]);
};

interface State {
  exerciseList: Stream<Exercise>;
}

interface Mutations {
  addExercise: (exercise: Exercise) => void;
  removeExercise: (slug: string) => void;
}
interface Return extends State, Mutations {}

type ExerciseList = SortedSet<Exercise>;
interface Exercise {
  slug: string;
  name: string;
  description: string;
}

const ExerciseSortedSet = SortedSet.createContext<Exercise>({
  comp: {
    compare: (a, b) => a.slug.localeCompare(b.slug),
    isComparable: (x): x is Exercise =>
      x != null && typeof (x as any).slug === "string",
  },
});
