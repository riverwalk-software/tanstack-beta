const safeStartViewTransition = (f: () => void): void =>
  (document as any).startViewTransition?.(f) ?? f()

export { safeStartViewTransition }
