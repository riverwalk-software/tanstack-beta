/**
 * A function that always returns the value that was used as its argument, unchanged.
 *
 * @example
 * ```ts
 * assert.deepStrictEqual(identity(5), 5)
 * assert.deepStrictEqual(identity("hello"), "hello")
 * assert.deepStrictEqual(identity([1, 2, 3]), [1, 2, 3])
 * assert.deepStrictEqual(identity({ a: 1, b: 2 }), { a: 1, b: 2 })
 * assert.deepStrictEqual(identity(add), add)
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Identity_function}
 *
 * @since 1.0.0
 *
 */
const identity = <A>(a: A): A => a
/**
 * A function whose output value is the same for every input value.
 *
 * @example
 * ```ts
 * assert.deepStrictEqual(constant(5)(10), 5)
 * assert.deepStrictEqual(constant("hello")("world"), "hello")
 * ```
 *
 * @since 1.0.0
 */
const constant =
  <A>(a: A) =>
  <B>(_b: B) =>
    a

const meme = map

export { identity, constant }
