export const identity = <A>(x: A): A => x

export const swap =
  <A, B, C>(f: (a: A) => (b: B) => C) =>
  (b: B) =>
  (a: A): C =>
    f(a)(b)

export const constant =
  <A, B>(x: A) =>
  (_y: B): A =>
    x
