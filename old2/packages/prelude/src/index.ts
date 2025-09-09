import {
  createToggleMachine,
  type ToggleEvent,
  ToggleState,
} from "./state/toggle-state"
import { NonEmptyString } from "./types/strings/non-empty-string"
import { NonEmptyTrimmedString } from "./types/strings/non-empty-trimmed-string"
import { String } from "./types/strings/string"
import { Unit } from "./types/units/unit"
import { constant, identity } from "./utils/combinators"
import { safeStartViewTransition } from "./utils/safe-start-view-transition"

const map = () => 5

export {
  safeStartViewTransition,
  map,
  type String,
  NonEmptyString,
  NonEmptyTrimmedString,
  ToggleState,
  type ToggleEvent,
  type Unit,
  createToggleMachine,
  constant,
  identity,
}
