import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { Context, Effect, Either } from "effect";
import z from "zod";
import { getSessionDataFn, SessionDataService } from "../authentication";
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "../getCloudflareBindings";
import { UNAUTHENTICATED } from "../httpResponses";
import { youtubeScopes } from "./google";

export const isYoutubeAuthorizedFn = createServerFn().handler(
  async (): Promise<boolean> => {
    const sessionData = await getSessionDataFn();
    const cloudflareBindings = getCloudflareBindings();
    const program = Effect.gen(function* () {
      const { DB } = yield* CloudflareBindingsService;
      const { user } = yield* SessionDataService;
      const maybeUnknownEntry = yield* Effect.promise(() =>
        DB.prepare("SELECT scope FROM account where userId = ?")
          .bind(user.id)
          .first(),
      );
      const unknownEntry = yield* Either.fromNullable(
        maybeUnknownEntry,
        () =>
          new UNAUTHENTICATED({
            message: "Your session is no longer valid. Please log in again.",
          }),
      );
      const { scope: acceptedScopes } = yield* Effect.sync(() =>
        EntrySchema.parse(unknownEntry),
      );
      return yield* Effect.sync(() => {
        if (acceptedScopes === null) return false;
        return youtubeScopes.every((scope) => acceptedScopes.includes(scope));
      });
    });
    const context = Context.empty().pipe(
      Context.add(SessionDataService, sessionData),
      Context.add(CloudflareBindingsService, cloudflareBindings),
    );
    const runnable = Effect.provide(program, context);
    return Effect.runPromise(runnable);
  },
);

const EntrySchema = z.object({
  scope: z.string().nullable(),
});

export const youtubeAuthorizationQueryOptions = queryOptions({
  queryKey: ["youtubeAuthorization"],
  queryFn: async () => isYoutubeAuthorizedFn(),
  retry: false,
  staleTime: Infinity,
  gcTime: Infinity,
});
