export const map =
  <A, B>(transformer: (a: A) => B) =>
  (xs: readonly A[]): readonly B[] =>
    xs.map(transformer)
