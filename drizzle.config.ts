import { D1Helper } from "@nerdfolio/drizzle-d1-helpers"
import { defineConfig } from "drizzle-kit"
import { match } from "ts-pattern"
import z from "zod"

const { NODE_ENV, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_TOKEN } = process.env
const NODE_ENV_Schema = z.enum(["development", "production"]) // Repeat of `environment.tsx`. Do not export; causes unknown issues
const nodeEnv = NODE_ENV_Schema.parse(NODE_ENV)
const d1Helper = D1Helper.get("SCHOOL_DB")
const getCredentials = () =>
  match(nodeEnv)
    .with("development", () => ({
      dbCredentials: {
        url: d1Helper.sqliteLocalFileCredentials.url,
      },
    }))
    .with("production", () => ({
      driver: "d1-http",
      dbCredentials: {
        ...d1Helper.withCfCredentials(
          CLOUDFLARE_ACCOUNT_ID,
          CLOUDFLARE_D1_TOKEN,
        ).proxyCredentials,
      },
    }))
    .exhaustive()

export default defineConfig({
  schema: "./src/db/main/schema.ts",
  out: "./src/db/main/migrations/",
  dialect: "sqlite",
  casing: "snake_case",
  ...getCredentials(),
})
