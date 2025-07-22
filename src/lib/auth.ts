import { betterAuth } from "better-auth";
import { reactStartCookies } from "better-auth/react-start";
import { D1Dialect } from "kysely-d1";
import { Resend } from "resend";
import { ResetPasswordEmail } from "@/components/emails/ResetPasswordEmail";
import { VerifyEmailEmail } from "@/components/emails/VerifyEmailEmail";
import {
  AUTH_COOKIE_PREFIX,
  EVENTUAL_CONSISTENCY_DELAY_S,
  MAXIMUM_PASSWORD_LENGTH,
  MINIMUM_PASSWORD_LENGTH,
} from "@/utils/constants";
import { environment } from "@/utils/environment";
import { getCloudflareBindings } from "@/utils/getCloudflareBindings";

const { DB, SESSION_STORE } = getCloudflareBindings();
const resend = new Resend(environment.secrets.RESEND_API_KEY);
const emailSender = "info@riverwalk.dev";
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    minPasswordLength: MINIMUM_PASSWORD_LENGTH,
    maxPasswordLength: MAXIMUM_PASSWORD_LENGTH,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: emailSender,
        to: user.email,
        subject: "Reset your password",
        react: ResetPasswordEmail({ url }),
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignIn: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: emailSender,
        to: user.email,
        subject: "Verify your email address",
        react: VerifyEmailEmail({ url }),
      });
    },
  },
  socialProviders: {
    google: {
      clientId: environment.variables.GOOGLE_CLIENT_ID,
      clientSecret: environment.secrets.GOOGLE_CLIENT_SECRET,
    },
  },
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
  advanced: {
    cookiePrefix: AUTH_COOKIE_PREFIX,
  },
  plugins: [
    reactStartCookies(), // must be last https://www.better-auth.com/docs/integrations/tanstack#usage-tips
  ],
});
