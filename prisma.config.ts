import path from "node:path";
import { PrismaD1 } from "@prisma/adapter-d1";
import type { PrismaConfig } from "prisma";
import "dotenv/config";

type Env = {
  CLOUDFLARE_D1_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_DATABASE_ID: string;
};

export default {
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    async adapter(env: Env) {
      return new PrismaD1({
        CLOUDFLARE_D1_TOKEN: env.CLOUDFLARE_D1_TOKEN,
        CLOUDFLARE_ACCOUNT_ID: env.CLOUDFLARE_ACCOUNT_ID,
        CLOUDFLARE_DATABASE_ID: env.CLOUDFLARE_DATABASE_ID,
      });
    },
  },
} satisfies PrismaConfig<Env>;
