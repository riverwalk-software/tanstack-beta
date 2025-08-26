/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { useCounter } from "./useCounter"

describe("useCounter", () => {
  it("initial count is 0", () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it("increments count", () => {
    const { result } = renderHook(() => useCounter())
    act(() => {
      result.current.increment()
    })
    expect(result.current.count).toBe(1)
  })

  it("decrements count", () => {
    const { result } = renderHook(() => useCounter())
    act(() => {
      result.current.decrement()
    })
    expect(result.current.count).toBe(-1)
  })

  it("resets count", () => {
    const { result } = renderHook(() => useCounter())
    act(() => {
      result.current.increment()
      result.current.reset()
    })
    expect(result.current.count).toBe(0)
  })
})
