import { Stack } from "immutable";
import { assign, createActor, setup } from "xstate";

const workoutMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
  },
}).createMachine({
  id: "workout",
  context: {
    activeDurations: Stack(),
    exerciseEntries: [],
  },
  initial: "Active",
  states: {
    Active: {
      initial: "Running",
      states: {
        Running: {
          entry: assign({
            activeDurations: ({ context: { activeDurations } }) =>
              addActiveDuration(activeDurations),
          }),
          on: {
            pause: "Paused",
          },
        },
        Paused: {
          entry: assign({
            activeDurations: ({ context: { activeDurations } }) =>
              endActiveDuration(activeDurations),
          }),
          on: {
            resume: "Running",
          },
        },
      },
      on: {
        cancel: "Cancelled",
        complete: "Completed",
      },
    },
    Cancelled: {
      type: "final",
    },
    Completed: {
      type: "final",
      entry: assign({
        activeDurations: ({ context: { activeDurations } }) =>
          endActiveDuration(activeDurations),
      }),
    },
  },
});

type Events =
  | { type: "pause" }
  | { type: "resume" }
  | { type: "cancel" }
  | { type: "complete" };

interface Context {
  activeDurations: Stack<ActiveDuration>;
  exerciseEntries: ExerciseEntry[];
}

interface ActiveDuration {
  start: number;
  end?: number;
}

interface ExerciseEntry {
  exercise: Exercise;
  sets: Set[];
}

interface Exercise {
  name: string;
}

interface Set {
  weight: number;
  reps: number;
  rir: number;
  restTimer: number;
}

const addActiveDuration = (
  activeDurations: Stack<ActiveDuration>,
): Stack<ActiveDuration> => activeDurations.push({ start: Date.now() });

const endActiveDuration = (
  activeDurations: Stack<ActiveDuration>,
): Stack<ActiveDuration> => {
  const top = activeDurations.peek();
  if (top === undefined) return activeDurations;
  return top.end !== undefined
    ? activeDurations
    : activeDurations.pop().push({ ...top, end: Date.now() });
};

const actor = createActor(workoutMachine);
actor.subscribe((snapshot) => console.log(snapshot.context.activeDurations));
actor.start();
const meme = async () => {
  actor.send({ type: "pause" });
  setTimeout(() => {
    actor.send({ type: "pause" });
    actor.send({ type: "resume" });
    actor.send({ type: "complete" });
    const snapshot = actor.getSnapshot();
    const rawDuration = snapshot.context.activeDurations
      .map(({ start, end }) => end! - start)
      .reduce((acc, duration) => acc + duration, 0);
    const duration = `${Math.round(rawDuration / 1000)} seconds`;
    console.log(duration);
  }, 4000);
};
meme();
actor.stop();
