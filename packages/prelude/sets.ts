import { Option, Stream } from "effect"
import isEven from "./properties"

const succ = (n: number): number => n + 1
const nats = Stream.unfold(0, n => Option.some([n, succ(n)]))
const evens = nats.pipe(Stream.filter(isEven))
