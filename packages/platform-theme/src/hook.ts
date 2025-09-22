import { createActorContext } from "@xstate/react"
import { Match } from "effect"
import { Theme } from "#core.js"
import { createToggleMachine } from "#state.js"
import { safeStartViewTransition } from "#utils.js"

const ThemeActorContext = createActorContext(createToggleMachine("OFF"))
const ThemeProvider = ThemeActorContext.Provider
const useTheme = () => {
  const themeActorRef = ThemeActorContext.useActorRef()
  const state = ThemeActorContext.useSelector(state => state.value)
  const theme = Match.value(state).pipe(
    Match.withReturnType<Theme>(),
    Match.when("OFF", _ => Theme.make("dark")),
    Match.when("ON", _ => Theme.make("light")),
    Match.exhaustive,
  )
  const _toggleTheme = () => themeActorRef.send({ type: "TOGGLE" })
  const toggleTheme = () => safeStartViewTransition(_toggleTheme)
  return { theme, toggleTheme }
}

export { ThemeProvider, useTheme }
