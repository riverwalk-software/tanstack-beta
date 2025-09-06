import { Schema } from "effect"
import { setup } from "xstate"

const createToggleMachine = (initial: ToggleState) =>
  setup({
    types: {
      events: {} as ToggleEvent,
    },
  }).createMachine({
    id: "Toggle",
    initial,
    states: {
      OFF: {
        on: {
          TOGGLE: "ON",
        },
      },
      ON: {
        on: {
          TOGGLE: "OFF",
        },
      },
    },
  })

interface ToggleEvent {
  type: "TOGGLE"
}

const ToggleState = Schema.Literal("OFF", "ON")
type ToggleState = typeof ToggleState.Type

export { createToggleMachine, ToggleState, type ToggleEvent }
