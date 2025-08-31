// export const catMaybes = <A>(maybes: List<Option<A>>): List<A> =>
//   maybes.filter(maybe =>
//     match(maybe)
//       .returnType<List<A>>()
//       .with({ _tag: "None" }, () => [])
//       .otherwise(({ value }) => [value]),
//   )

// export const mapMaybe =
//   <A, B>(maybeF: (a: A) => Option<B>) =>
//   (xs: List<A>): List<B> =>
//     pipe(xs, mapList(maybeF), catMaybes)
