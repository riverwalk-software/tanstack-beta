const safeStartViewTransition = (f: () => void): void => {
  if (
    "startViewTransition" in document &&
    typeof document.startViewTransition === "function"
  ) {
    ;(document.startViewTransition as (callback: () => void) => void)(f)
  } else {
    f()
  }
}

export { safeStartViewTransition }
