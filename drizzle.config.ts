import { D1Helper } from "@nerdfolio/drizzle-d1-helpers";
import { defineConfig } from "drizzle-kit";

const isDev = () => process.env.NODE_ENV === "development";
const d1Helper = D1Helper.get("SCHOOL_DB");
const getCredentials = () => {
  const dev = {
    dbCredentials: {
      url: d1Helper.sqliteLocalFileCredentials.url,
    },
  };
  const prod = {
    driver: "d1-http",
    dbCredentials: {
      ...d1Helper.withCfCredentials(
        process.env.CLOUDFLARE_ACCOUNT_ID,
        process.env.CLOUDFLARE_D1_TOKEN,
      ).proxyCredentials,
    },
  };
  return isDev() ? dev : prod;
};

export default defineConfig({
  schema: "./src/db/main/schema.ts",
  out: "./src/db/main/migrations/",
  dialect: "sqlite",
  ...getCredentials(),
});
