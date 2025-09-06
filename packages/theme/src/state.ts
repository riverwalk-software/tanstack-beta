import { setup } from "xstate"

const themeMachine = setup({
  types: {
    events: {} as Events,
  },
}).createMachine({
  id: "Theme",
  initial: "Dark",
  states: {
    Dark: {
      on: {
        TOGGLE: "Light",
      },
    },
    Light: {
      on: {
        TOGGLE: "Dark",
      },
    },
  },
})

interface Events {
  type: "TOGGLE"
}
export { themeMachine }
