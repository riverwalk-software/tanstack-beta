import { createFileRoute } from "@tanstack/react-router";
import { youtubeAuthorizationQueryOptions } from "@/components/auth/AuthorizeYoutubeButton";
import { YoutubeManager } from "@/components/auth/YoutubeManager";
import { CenteredContainer } from "@/containers/CenteredContainer";

export const Route = createFileRoute("/_authenticated/")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(youtubeAuthorizationQueryOptions);
  },
  component: Home,
});

function Home() {
  return (
    <CenteredContainer>
      <YoutubeManager />
    </CenteredContainer>
  );
}
