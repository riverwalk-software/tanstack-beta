import { type AnyD1Database, drizzle } from "drizzle-orm/d1"
import * as dbSchema from "../db/schema"

export const createDb = (DB: AnyD1Database) =>
  drizzle(DB, { casing: "snake_case", schema: dbSchema })
