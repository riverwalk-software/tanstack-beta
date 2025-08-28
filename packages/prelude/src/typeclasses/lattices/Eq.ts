export const areEqual =
  <A>(a: A): ((b: A) => boolean) =>
  b =>
    a === b
