import { betterAuth } from "better-auth";
import { reactStartCookies } from "better-auth/react-start";
import { D1Dialect } from "kysely-d1";
import { EVENTUAL_CONSISTENCY_DELAY_S } from "@/utils/constants";
import { getBindings } from "@/utils/getBindings";

const { DB, SESSION_STORE } = getBindings();
export const auth = betterAuth({
  // database: new Database("./db/sqlite.db"),
  database: {
    dialect: new D1Dialect({ database: DB }),
    type: "sqlite",
  },
  session: {
    storeSessionInDatabase: true, // TODO: remove this when issue fixed https://github.com/better-auth/better-auth/issues/2007
    cookieCache: {
      enabled: true,
      maxAge: EVENTUAL_CONSISTENCY_DELAY_S,
    },
  },
  secondaryStorage: {
    get: (key) => SESSION_STORE.get(key),
    set: (key, value, ttl) =>
      SESSION_STORE.put(key, value, { expirationTtl: ttl }),
    delete: (key) => SESSION_STORE.delete(key),
  },
  // rateLimit: {
  //   enabled: true,
  //   customStorage: {
  //     get: async (key) => {
  //       const data = await RATE_LIMIT_CACHE.get(key);
  //       return data ? JSON.parse(data) : undefined;
  //     },
  //     set: (key, value) => RATE_LIMIT_CACHE.put(key, JSON.stringify(value)),
  //   },
  //   window: 60,
  //   max: 2,
  //   customRules: {
  //     "/sign-in/email": {
  //       window: 15,
  //       max: 1,
  //     },
  //   },
  // },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    // autoSignIn: false,
    // requireEmailVerification: true,
    // autoSignInAfterVerification: true,
    // minPasswordLength: MINIMUM_PASSWORD_LENGTH,
    // maxPasswordLength: MAXIMUM_PASSWORD_LENGTH,
  },
  plugins: [
    reactStartCookies(), // must be last https://www.better-auth.com/docs/integrations/tanstack#usage-tips
  ],
});
