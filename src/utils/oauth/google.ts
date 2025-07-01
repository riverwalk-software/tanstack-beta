import crypto from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { Context, Effect } from "effect";
import { z } from "zod";
import { getSessionDataMw, SessionDataService } from "../authentication";
import { EnvironmentService, getEnvironmentMw } from "../environment";
import {
  CloudflareBindingsService,
  getCloudflareBindingsMw,
} from "../getCloudflareBindings";
import { buildUrl, strictParse } from "../httpResponses";

export const getConsentUrlFn = createServerFn()
  .middleware([getEnvironmentMw, getCloudflareBindingsMw, getSessionDataMw])
  .handler(
    async ({
      context: { environment, cloudflareBindings, sessionData },
    }): Promise<string> => {
      // const program = Effect.gen(function* () {
      //   const state = yield* generateState();
      //   const [consentUrl] = yield* concurrent([
      //     generateConsentUrl(state),
      //     storeStateAndSessionId(state),
      //   ]);
      //   return consentUrl;
      // });
      const context = Context.empty().pipe(
        Context.add(EnvironmentService, environment),
        Context.add(SessionDataService, sessionData),
        Context.add(CloudflareBindingsService, cloudflareBindings),
      );
      // const runnable = Effect.provide(program, context);
      // const consentUrl = await Effect.runPromise(runnable);
      return environment.secrets.BETTER_AUTH_SECRET;
    },
  );

const generateState = () =>
  Effect.sync(() => crypto.randomBytes(32).toString("hex"));

const generateConsentUrl = (state: string) =>
  Effect.gen(function* () {
    const base = yield* Effect.succeed("https://accounts.google.com");
    const path = yield* Effect.succeed("/o/oauth2/v2/auth");
    const {
      variables: { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI },
    } = yield* EnvironmentService;
    const {
      user: { email },
    } = yield* SessionDataService;
    const searchParams = yield* Effect.sync(() =>
      strictParse(GoogleConsentUrlSearchParamsSchema, {
        clientId: GOOGLE_CLIENT_ID,
        redirectUri: GOOGLE_REDIRECT_URI,
        scopes: selectedScopes,
        state,
        loginHint: email,
      }),
    );
    return yield* Effect.sync(() => buildUrl({ base, path, searchParams }));
  });

const storeStateAndSessionId = (state: string) =>
  Effect.gen(function* () {
    // const { OAUTH_STORE } = yield* CloudflareBindingsService;
    // const oauthStore = yield* Effect.sync(() =>
    //   getDurableObject(OAUTH_STORE, state),
    // );
    // const { session } = yield* SessionDataService;
    // yield* Effect.promise(() => oauthStore.set(session.id));
  });

export const selectedScopes = [
  "https://www.googleapis.com/auth/youtubepartner",
] as z.input<typeof GoogleConsentUrlSearchParamsSchema>["scopes"];
export const scopeDelimiter = " ";
const YouTubeDataScopeSchema = z.enum([
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.channel-memberships.creator",
  "https://www.googleapis.com/auth/youtube.force-ssl",
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtubepartner",
  "https://www.googleapis.com/auth/youtubepartner-channel-audit",
]);
export const ScopeSchema = YouTubeDataScopeSchema;
const GoogleConsentUrlSearchParamsSchema = z
  .object({
    clientId: z.string().nonempty(),
    redirectUri: z.string().url(),
    scopes: z
      .array(ScopeSchema)
      .nonempty()
      .transform((scopes) => new Set(scopes))
      .transform((scopes) => Array.from(scopes).join(scopeDelimiter)),
    state: z.string().nonempty(),
    loginHint: z.string().email(),
  })
  .transform((schema) => ({
    client_id: schema.clientId,
    redirect_uri: schema.redirectUri,
    response_type: "code",
    scope: schema.scopes,
    access_type: "offline",
    state: schema.state,
    include_granted_scopes: "true",
    login_hint: schema.loginHint,
  }));

export const googleOauthQueryKey = ["googleOauth"];
