const IS_DEV =
  import.meta.env?.DEV || process.env["NODE_ENV"] === ("development" as const)

export { IS_DEV }
