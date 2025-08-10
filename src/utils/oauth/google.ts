import crypto from "node:crypto";
import { queryOptions, useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Context, Effect } from "effect";
import { useState } from "react";
import { z } from "zod";
import { getSessionDataFn, SessionDataService } from "../authentication";
import { EnvironmentService, getEnvironmentFn } from "../environment";
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "../getCloudflareBindings";
import { buildUrl, concurrent, strictParse } from "../httpResponses";
import { s } from "../time";

const getConsentUrlFn = createServerFn().handler(async (): Promise<string> => {
  const sessionData = await getSessionDataFn();
  const environment = await getEnvironmentFn();
  const cloudflareBindings = getCloudflareBindings();
  const program = Effect.gen(function* () {
    const state = yield* generateState();
    const [consentUrl] = yield* concurrent([
      generateConsentUrl(state),
      storeStateAndSessionId(state),
    ]);
    return consentUrl;
  });
  const context = Context.empty().pipe(
    Context.add(EnvironmentService, environment),
    Context.add(SessionDataService, sessionData),
    Context.add(CloudflareBindingsService, cloudflareBindings),
  );
  const runnable = Effect.provide(program, context);
  const consentUrl = await Effect.runPromise(runnable);
  return consentUrl.toString();
});

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
        scopes: youtubeScopes,
        state,
        loginHint: email,
      }),
    );
    return yield* Effect.sync(() => buildUrl({ base, path, searchParams }));
  });

const storeStateAndSessionId = (state: string) =>
  Effect.gen(function* () {
    const { OAUTH_STORE } = yield* CloudflareBindingsService;
    const { session } = yield* SessionDataService;
    yield* Effect.promise(() =>
      OAUTH_STORE.put(state, session.id, {
        expirationTtl: s("5m"),
      }),
    );
    // const oauthStore = yield* Effect.sync(() =>
    //   getDurableObject(OAUTH_STORE, state),
    // );
    // yield* Effect.promise(() => oauthStore.set(session.id));
  });

export const scopeDelimiter = " ";
export const YoutubeDataScopeSchema = z.enum([
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.channel-memberships.creator",
  "https://www.googleapis.com/auth/youtube.force-ssl",
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtubepartner",
  "https://www.googleapis.com/auth/youtubepartner-channel-audit",
]);
const GoogleConsentUrlSearchParamsSchema = z
  .object({
    clientId: z.string().nonempty(),
    redirectUri: z.string().url(),
    scopes: z
      .array(YoutubeDataScopeSchema)
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
export const youtubeScopes = [
  "https://www.googleapis.com/auth/youtubepartner",
] satisfies z.input<typeof GoogleConsentUrlSearchParamsSchema>["scopes"];

export const googleOauthQueryOptions = queryOptions({
  queryKey: ["googleOauth"],
  queryFn: () => {},
  staleTime: Infinity,
  gcTime: Infinity,
});

export const useSignInWithGoogle = () => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const { mutate: redirectToConsentUrl } = useMutation({
    mutationKey: ["redirectToConsentUrl"],
    mutationFn: () => getConsentUrlFn(),
    onMutate: () => setIsPending(true),
    onError: () => setIsPending(false),
    onSuccess: async (consentUrl) => navigate({ href: consentUrl }),
  });
  return { redirectToConsentUrl, isPending };
};
