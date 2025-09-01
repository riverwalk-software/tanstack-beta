import { Option, Schema } from "effect"

const schema = Schema.Option(Schema.NumberFromString)
type Encoded = typeof schema.Encoded

//     ┌─── Option<number>
//     ▼
type Type = typeof schema.Type

// Decoding examples
const decode = Schema.decodeUnknownSync(schema)
const encode = Schema.encodeSync(schema)
console.log(decode({ _tag: "None" }))
// Output: { _id: 'Option', _tag: 'None' }

console.log(decode({ _tag: "Some", value: "1" }))
// Output: { _id: 'Option', _tag: 'Some', value: 1 }

// Encoding examples

console.log(encode(Option.none()))
// Output: { _tag: 'None' }

console.log(encode(Option.some(1)))
// Output: { _tag: 'Some', value: '1' }
