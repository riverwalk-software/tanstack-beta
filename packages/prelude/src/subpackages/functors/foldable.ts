export const foldLeft =
  <A, B>(reducer: (accumulator: B) => (current: A) => B) =>
  (initial: B) =>
  (foldable: readonly A[]) =>
    foldable.reduce(
      (accumulator, current) => reducer(accumulator)(current),
      initial,
    )

export const foldRight =
  <A, B>(reducer: (current: A) => (accumulator: B) => B) =>
  (initial: B) =>
  (foldable: readonly A[]) =>
    foldable.reduceRight(
      (accumulator, current) => reducer(current)(accumulator),
      initial,
    )
