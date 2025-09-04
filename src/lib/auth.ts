// oxlint-disable max-lines-per-function
// oxlint-disable max-params
// import { checkout, polar, portal } from "@polar-sh/better-auth"
// import { Polar } from "@polar-sh/sdk"

import { betterAuth } from "better-auth"
import { reactStartCookies } from "better-auth/react-start"
import { Kysely } from "kysely"
import { D1Dialect } from "kysely-d1"
import { Cloudflare, CloudflareLive } from "@/lib/cloudflare"
// import { Resend } from "resend"
// import { ResetPasswordEmail } from "@/components/emails/ResetPasswordEmail"
// import { VerifyEmailEmail } from "@/components/emails/VerifyEmailEmail"
// import {
//   AUTH_COOKIE_PREFIX,
//   EVENTUAL_CONSISTENCY_DELAY_S,
//   PASSWORD_LENGTH,
//   TEST_PRODUCT_SLUG,
// } from "@/lib/constants"
// import { environment } from "@/lib/environment"

import { LENGTHS } from "@authentication"
import { AUTH_COOKIE_PREFIX, EVENTUAL_CONSISTENCY_DELAY } from "@constants"
import { Duration, Effect, pipe } from "effect"

// const polarClient = new Polar({
//   accessToken: process.env["POLAR_ACCESS_TOKEN"],
//   server: "sandbox",
// })

// https://www.better-auth.com/docs/guides/optimizing-for-performance
// https://www.better-auth.com/docs/guides/browser-extension-guide
// const { RESEND_API_KEY } = environment.secrets
// const resend = new Resend(RESEND_API_KEY)
// const emailSender = "info@riverwalk.dev"
const isDev = import.meta.env.DEV || process.env["NODE_ENV"] === "development"
const getAuth = () => {
  const program = Effect.gen(function* () {
    const cloudflare = yield* Cloudflare
    const { AUTH_DB, SESSION_STORE } = yield* cloudflare.bindings
    return yield* Effect.sync(() =>
      betterAuth({
        emailAndPassword: {
          enabled: true,
          autoSignIn: isDev,
          requireEmailVerification: !isDev,
          revokeSessionsOnPasswordReset: true,
          minPasswordLength: LENGTHS.PASSWORD.MINIMUM,
          maxPasswordLength: LENGTHS.PASSWORD.MAXIMUM,
          // sendResetPassword: async ({ user, url }) => {
          //   await resend.emails.send({
          //     from: emailSender,
          //     to: user.email,
          //     subject: "Reset your password",
          //     react: ResetPasswordEmail({ url }),
          //   })
          // },
        },
        emailVerification: {
          autoSignInAfterVerification: true,
          sendOnSignIn: true,
          sendOnSignUp: true,
          // sendVerificationEmail: async ({ user, url }) => {
          //   await resend.emails.send({
          //     from: emailSender,
          //     to: user.email,
          //     subject: "Verify your email address",
          //     react: VerifyEmailEmail({ url }),
          //   })
          // },
        },
        // socialProviders: {
        //   google: {
        //     clientId: environment.variables.GOOGLE_CLIENT_ID,
        //     clientSecret: environment.secrets.GOOGLE_CLIENT_SECRET,
        //   },
        // },
        // database: new Database("./src/db/auth/sqlite.db"),
        database: {
          db: new Kysely({
            dialect: new D1Dialect({ database: AUTH_DB }),
          }),
          type: "sqlite",
        },
        session: {
          storeSessionInDatabase: true, // TODO: remove this when issue fixed https://github.com/better-auth/better-auth/issues/2007
          cookieCache: {
            enabled: true,
            maxAge: Duration.toSeconds(EVENTUAL_CONSISTENCY_DELAY),
          },
        },
        secondaryStorage: {
          get: key => SESSION_STORE.get(key),
          set: (key, value, ttl) =>
            SESSION_STORE.put(
              key,
              value,
              ttl === undefined ? {} : { expirationTtl: ttl },
            ),
          delete: key => SESSION_STORE.delete(key),
        },
        // rateLimit: { // https://www.better-auth.com/docs/concepts/rate-limit
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
          // polar({
          //   client: polarClient,
          //   createCustomerOnSignUp: true,
          //   // getCustomerCreateParams: ({ user }, request) => ({
          //   //   metadata: {
          //   //     myCustomProperty: 123,
          //   //   },
          //   // }),
          //   use: [
          //     checkout({
          //       products: [
          //         {
          //           productId: "06ef753e-cecf-478e-b107-2422241a29ed",
          //           slug: TEST_PRODUCT_SLUG,
          //         },
          //       ],
          //       successUrl: process.env.POLAR_SUCCESS_URL,
          //       authenticatedUsersOnly: true,
          //     }),
          //     portal(),
          //     // usage(),
          //     // webhooks({
          //     //     secret: process.env.POLAR_WEBHOOK_SECRET,
          //     //     onCustomerStateChanged: (payload) => // Triggered when anything regarding a customer changes
          //     //     onOrderPaid: (payload) => // Triggered when an order was paid (purchase, subscription renewal, etc.)
          //     //      // Over 25 granular webhook handlers
          //     //     onPayload: (payload) => // Catch-all for all events
          //     // })
          //   ],
          // }),
          reactStartCookies(), // must be last https://www.better-auth.com/docs/integrations/tanstack#usage-tips
        ],
      }),
    )
  })
  const runnable = pipe(program, CloudflareLive)
  return Effect.runSync(runnable)
}
export const auth = getAuth()
