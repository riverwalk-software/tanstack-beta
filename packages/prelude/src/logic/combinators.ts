export const identity = <A>(x: A): A => x;

export const swap =
  <A, B, C>(f: (a: A) => (b: B) => C) =>
  (b: B) =>
  (a: A): C =>
    f(a)(b);

type Fn<A, B> = (a: A) => B;
const _flowImpl =
  (...fns: Fn<unknown, unknown>[]) =>
  (a: unknown) =>
    fns.reduce((acc, f) => f(acc), a);
interface Flow {
  <A, B>(ab: Fn<A, B>): Fn<A, B>;
  <A, B, C>(ab: Fn<A, B>, bc: Fn<B, C>): Fn<A, C>;
  <A, B, C, D>(ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>): Fn<A, D>;
  <A, B, C, D, E>(
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>,
  ): Fn<A, E>;
  <A, B, C, D, E, F>(
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>,
    ef: Fn<E, F>,
  ): Fn<A, F>;
  <A, B, C, D, E, F, G>(
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>,
    ef: Fn<E, F>,
    fg: Fn<F, G>,
  ): Fn<A, G>;
}
export const flow: Flow = _flowImpl as Flow;

interface Pipe {
  <A, B>(a: A, ab: Fn<A, B>): B;
  <A, B, C>(a: A, ab: Fn<A, B>, bc: Fn<B, C>): C;
  <A, B, C, D>(a: A, ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>): D;
  <A, B, C, D, E>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>,
  ): E;
  <A, B, C, D, E, F>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>,
    ef: Fn<E, F>,
  ): F;
  <A, B, C, D, E, F, G>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>,
    ef: Fn<E, F>,
    fg: Fn<F, G>,
  ): G;
}

export const pipe: Pipe = ((a: unknown, ...fns: Fn<unknown, unknown>[]) =>
  _flowImpl(...fns)(a)) as Pipe;
