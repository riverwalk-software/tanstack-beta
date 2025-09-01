// oxlint-disable id-length
import { Option, Schema, Stream } from "effect"
import isEven from "packages/prelude/properties"

const nats = Stream.unfold(0, n => Option.some([n, n + 1]))
const evens = nats.pipe(Stream.filter(isEven))

// Effect.runPromise(
//   Effect.all(
//     [Stream.take(evens, 5).pipe(Stream.runForEach(n => Console.log("", n)))],
//     { concurrency: "unbounded" },
//   ),
// )

const FooSchema = Schema.Number.pipe(Schema.brand("Foo"))
const BarSchema = Schema.Number.pipe(Schema.brand("Bar"))
const BarFromFooSchema = Schema.transform(FooSchema, BarSchema, {
  decode: foo => BarSchema.make(foo),
  encode: bar => FooSchema.make(bar),
})

const bar = BarSchema.make(0)
const foo = FooSchema.make(0)
const y = Schema.encodeSync(BarSchema)(5)
const x = Schema.decodeSync(BarFromFooSchema)(foo)
const z = Schema.decodeSync(BarFromFooSchema)(bar)
