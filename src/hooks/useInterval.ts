import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

interface UseIntervalOptions {
  autoStart?: boolean
}

export function useInterval(
  callback: () => void,
  delay: number,
  { autoStart = true }: UseIntervalOptions = {},
) {
  const savedCallback = useRef(callback)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isActive, setIsActive] = useState(autoStart)

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  const start = useCallback(() => {
    setIsActive(true)
  }, [])

  const stop = useCallback(() => {
    setIsActive(false)
  }, [])

  const toggle = useCallback(() => {
    setIsActive(prev => !prev)
  }, [])

  useEffect(() => {
    // Note: 0 is a valid value for delay.
    if (!isActive) {
      return
    }

    const id = setInterval(() => {
      savedCallback.current()
    }, delay)

    intervalRef.current = id

    return () => {
      clearInterval(id)
      intervalRef.current = null
    }
  }, [delay, isActive])

  return { start, stop, toggle, isActive }
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect
