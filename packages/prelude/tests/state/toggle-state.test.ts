// oxlint-disable max-lines-per-function
// oxlint-disable no-magic-numbers
import { assert, describe, expect, it } from "@effect/vitest"
import { createToggleMachine, ToggleEvent, ToggleState } from "@prelude"
import { array, constant, nat, property } from "effect/FastCheck"
import { createActor } from "xstate"

const reduce = (snapshot: ToggleState, _: ToggleEvent) =>
  snapshot === "OFF" ? "ON" : "OFF"

const fold = (initial: ToggleState, events: ToggleEvent[]) =>
  events.reduce(reduce, initial)

const initialState: ToggleState = "OFF"

describe("toggle PBT (pure reducer oracle)", () => {
  it("machine agrees with oracle for any sequence of toggles", () => {
    assert(
      property(
        array(constant<ToggleEvent>({ type: "TOGGLE" }), {
          maxLength: 500,
        }),
        events => {
          const actor = createActor(createToggleMachine(initialState))
          actor.start()
          for (const e of events) {
            actor.send(e)
          }
          const machineFinal = actor.getSnapshot().value as ToggleState
          const oracleFinal = fold(initialState, events)
          expect(machineFinal).toStrictEqual(oracleFinal)
          actor.stop()
        },
      ),
    )
  })

  it("involution: even number of toggles returns to initial", () => {
    assert(
      property(nat(250), n => {
        const actor = createActor(createToggleMachine(initialState))
        actor.start()
        const evenN = 2 * n
        for (let i = 0; i < evenN; i++) {
          actor.send({ type: "TOGGLE" })
        }
        expect(actor.getSnapshot().value).toStrictEqual(initialState)
        actor.stop()
      }),
    )
  })

  it("anti-fixity: odd number of toggles flips state", () => {
    assert(
      property(nat(250), n => {
        const actor = createActor(createToggleMachine(initialState))
        actor.start()
        const oddN = 2 * n + 1
        for (let i = 0; i < oddN; i++) {
          actor.send({ type: "TOGGLE" })
        }
        expect(actor.getSnapshot().value).not.toStrictEqual(initialState)
        actor.stop()
      }),
    )
  })
})

// const getToggleStateActor = () => {
//   const toggleActor = createActor(createToggleMachine(initialState))
//   toggleActor.start()
//   onTestFinished(() => {
//     toggleActor.stop()
//   })
//   return toggleActor
// }

// describe("toggleState", () => {
//   it("involution", () => {
//     const toggleActor = getToggleStateActor()
//     toggleActor.send({ type: "TOGGLE" })
//     toggleActor.send({ type: "TOGGLE" })
//     const result = toggleActor.getSnapshot()
//     assert(expect(result.value).toStrictEqual(initialState))
//   })

//   it("anti-fixity", () => {
//     const toggleActor = getToggleStateActor()
//     toggleActor.send({ type: "TOGGLE" })
//     const result = toggleActor.getSnapshot()
//     assert(expect(result.value).not.toStrictEqual(initialState))
//   })
// })

// Parity (core law): After n toggles, state = initial if n is even, other state if n is odd.
// Alternation: Each single TOGGLE flips (no self-loop).
// Closure / exhaustiveness: Only ever reaches OFF or ON.
// Determinism: Same sequence yields same final state (trivial here but still a property).
// Symmetry of initial state: Laws hold starting from OFF and from ON.
