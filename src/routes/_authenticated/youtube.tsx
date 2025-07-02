import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { GoogleOauthButton } from "@/components/oauth/GoogleOauthButton";
import { CenteredContainer } from "@/containers/CenteredContainer";
import { OauthSearchParamsSchema } from "@/utils/httpResponses";

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
      <GoogleOauthButton />
    </CenteredContainer>
  );
}

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
