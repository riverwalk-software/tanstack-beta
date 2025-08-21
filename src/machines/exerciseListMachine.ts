import { SortedSet } from "@rimbu/core";
import { assign, setup } from "xstate";

const ExerciseListSortedSet = SortedSet.createContext<Exercise>({
  comp: {
    compare: (a, b) => a.slug.localeCompare(b.slug),
    isComparable: (x): x is Exercise =>
      x != null && typeof (x as any).slug === "string",
  },
});

const exerciseListMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
  },
}).createMachine({
  id: "exerciseList",
  context: {
    exerciseList: ExerciseListSortedSet.empty(),
  },
  initial: "View",
  states: {
    View: {
      on: {
        add: {
          actions: assign({
            exerciseList: ({ context, event }) =>
              context.exerciseList.add(event.exercise),
          }),
        },
      },
    },
    Edit: {},
  },
});
type ExerciseList = SortedSet<Exercise>;
interface Context {
  exerciseList: ExerciseList;
}
type Events =
  | { type: "add"; exercise: Exercise }
  | { type: "remove"; exercise: Exercise }
  | { type: "update"; exercise: Exercise };

interface Exercise {
  slug: string;
  name: string;
  description: string;
}
