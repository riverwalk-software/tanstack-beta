import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CenteredContainer } from "@/containers/CenteredContainer";
import { authClient } from "@/lib/auth-client";
import { OauthSearchParamsSchema } from "@/utils/httpResponses";
import { youtubeScopes } from "@/utils/oauth/google";

export const Route = createFileRoute("/_authenticated/youtube")({
  component: Youtube,
});

// const isGoogleOauthAuthenticatedFn = createServerFn()
//   .middleware([authenticationMiddleware])
//   .handler(async ({ context: { isAuthenticated, sessionData } }) => {
//     if (!isAuthenticated) return false;
//     const { USER_STORE } = await getBindings();
//     const userStore = getDurableObject(USER_STORE, sessionData!.user.id);
//     return userStore.isAuthenticated();
//   });

// const isGoogleOauthAuthenticatedAtom = atomWithSuspenseQuery((get) => ({
//   queryKey: ["googleOauth"],
//   queryFn: isGoogleOauthAuthenticatedFn,
// }));

// const getYoutubeVideos = async ({ pageParam }: { pageParam?: string }) => {
//   const { data } = await axios.get(
//     pageParam
//       ? `/api/youtube/videos?pageToken=${pageParam}`
//       : "/api/youtube/videos",
//   );
//   return VideosResponseSchema.parse(data);
// };

// const youtubeVideosAtom = atomWithSuspenseInfiniteQuery((get) => ({
//   queryKey: ["youtubeVideos"],
//   queryFn: getYoutubeVideos,
//   initialPageParam: undefined,
//   getNextPageParam: (lastPage: z.infer<typeof VideosResponseSchema>) =>
//     lastPage.nextPageToken,
// }));

function Youtube() {
  useOauthSucceeded();
  // const { data: isGoogleOauthAuthenticated } = useAtomValue(
  //   isGoogleOauthAuthenticatedAtom,
  // );
  // const { data, hasNextPage, fetchNextPage } = useAtomValue(youtubeVideosAtom);
  // const pages = data.pages as Array<z.infer<typeof VideosResponseSchema>>;
  return (
    <CenteredContainer>
      <Button
        onClick={() =>
          authClient.linkSocial(
            {
              provider: "google",
              scopes: youtubeScopes,
            },
            {
              onError(context) {
                toast.error("Failed to link Google account.", {
                  description: context.error.message,
                });
              },
            },
          )
        }
      >
        Manage YouTube
      </Button>
    </CenteredContainer>
  );
}

// const useGoogleOauthAuthenticationData = () => {
//   const queryClient = useQueryClient();
//   const {data: } = useSuspenseQuery(googleOauthQueryOptions);
// };

// {isGoogleOauthAuthenticated ? (
//         pages.map((page) => (
//           <Fragment key={page.etag}>
//             {page.items.map((video) => (
//               <div key={video.id.videoId}>
//                 <h3>{video.snippet.title}</h3>
//                 <p>{video.snippet.description}</p>
//                 <img src={video.snippet.thumbnails.default.url} alt="" />
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => fetchNextPage()}
//               disabled={!hasNextPage}
//             >
//               Load More
//             </button>
//           </Fragment>
//         ))
//       ) : (
//         <GoogleOauthButton />
//       )}

const useOauthSucceeded = () => {
  const searchParams = Route.useSearch();
  useEffect(() => {
    const { success, data } = OauthSearchParamsSchema.safeParse(searchParams);
    if (success) {
      const { oauthSucceeded } = data;
      if (oauthSucceeded) toast.success("OAuth succeeded");
      else toast.error("OAuth failed. Please try again.");
    }
  }, [searchParams]);
};

// const idkFn = createServerFn().handler(async () => {
//   const sessionData = await getSessionDataFn();
//   const environment = await getEnvironmentFn();
//   const cloudflareBindings = getCloudflareBindings();
//   const program = Effect.gen(function* () {
//     return yield* checkIfSignedIn();
//   });
//   const context = Context.empty().pipe(
//     Context.add(EnvironmentService, environment),
//     Context.add(SessionDataService, sessionData),
//     Context.add(CloudflareBindingsService, cloudflareBindings),
//   );
//   const runnable = Effect.provide(program, context);
//   const x = Effect.runPromise(runnable);
// });

// const checkIfSignedIn = () =>
//   Effect.gen(function* () {
//     const { user } = yield* SessionDataService;
//     const { USER_STORE } = yield* CloudflareBindingsService;
//     const value = yield* Effect.promise(() =>
//       USER_STORE.get<UserValueSchema>(user.id, { type: "json" }),
//     );
//     const x = Effect.sync(() => {
//       if (value === null) return false;
//       const accessToken = getAccessToken(value);
//       if (accessToken === null) return false;
//       return true;
//     });
//   });

// const getAccessToken = (value: UserValueSchema): string | null => {
//   if (value.google === undefined) return null;
//   const {
//     tokens: { access, refresh },
//   } = value.google;
//   const accessTokenIsExpired = checkIfExpired(access.expiresAt);
//   if (accessTokenIsExpired) {
//     const refreshTokenIsExpired =
//       refresh.expiresAt === undefined
//         ? false
//         : checkIfExpired(refresh.expiresAt);
//     if (refreshTokenIsExpired) {
//       // ....
//     }
//     // ...
//   }
// };
