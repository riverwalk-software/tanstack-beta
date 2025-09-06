import { createActorContext } from "@xstate/react"
import { Theme } from "./core"
import { themeMachine } from "./state"

const ThemeActorContext = createActorContext(themeMachine)
const ThemeProvider = ThemeActorContext.Provider
const useTheme = () => {
  const themeActorRef = ThemeActorContext.useActorRef()
  const isLight = ThemeActorContext.useSelector(state => state.matches("Light"))
  const theme = Theme.make(isLight ? "light" : "dark")
  const toggleTheme = () => themeActorRef.send({ type: "TOGGLE" })
  return { theme, toggleTheme }
}

export { ThemeProvider, useTheme }
