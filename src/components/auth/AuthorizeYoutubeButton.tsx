import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { Context, Effect, Either } from "effect";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { getSessionDataFn, SessionDataService } from "@/utils/authentication";
import { AUTH_CALLBACK_ROUTE } from "@/utils/constants";
import {
  CloudflareBindingsService,
  getCloudflareBindings,
} from "@/utils/getCloudflareBindings";
import { UNAUTHENTICATED } from "@/utils/httpResponses";
import { youtubeScopes } from "@/utils/oauth/google";
import { Button } from "../ui/button";

export function AuthorizeYoutubeButton() {
  const { isYoutubeAuthorized } = useGetYoutubeAuthorization();
  const { authorizeYoutube, isPending } = useAuthorizeYoutube();
  return isYoutubeAuthorized ? (
    <p>Authorized</p>
  ) : (
    <Button disabled={isPending} onClick={() => authorizeYoutube()}>
      Manage YouTube
    </Button>
  );
}

const useGetYoutubeAuthorization = () => {
  const { data: isYoutubeAuthorized } = useSuspenseQuery(
    youtubeAuthorizationQueryOptions,
  );
  return { isYoutubeAuthorized };
};

export const youtubeAuthorizationQueryOptions = queryOptions({
  queryKey: ["youtubeAuthorization"],
  queryFn: async () => isYoutubeAuthorizedFn(),
  retry: false,
  staleTime: Infinity,
  gcTime: Infinity,
});

const isYoutubeAuthorizedFn = createServerFn().handler(
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

const useAuthorizeYoutube = () => {
  const queryClient = useQueryClient();
  const { mutate: authorizeYoutube, isPending } = useMutation({
    mutationKey: ["authorizeYoutube"],
    mutationFn: () =>
      authClient.linkSocial({
        provider: "google",
        scopes: youtubeScopes,
        callbackURL: AUTH_CALLBACK_ROUTE,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: youtubeAuthorizationQueryOptions.queryKey,
      });
    },
  });
  return { authorizeYoutube, isPending };
};
