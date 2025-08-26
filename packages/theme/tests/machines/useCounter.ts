import { useCallback, useState } from "react"

export const useCounter = () => {
  const [count, setCount] = useState(0)
  const increment = useCallback(() => setCount(prevCount => prevCount + 1), [])
  const decrement = useCallback(() => setCount(prevCount => prevCount - 1), [])
  const reset = useCallback(() => setCount(0), [])
  return { count, increment, decrement, reset }
}
