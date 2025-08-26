import { drizzle } from "drizzle-orm/d1"
import * as schema from "../db/schema"

export const createDb = (DB: D1Database) =>
  drizzle(DB, { casing: "snake_case", schema })
