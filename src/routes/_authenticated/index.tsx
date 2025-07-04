import { createFileRoute } from "@tanstack/react-router";
import { YoutubeManager } from "@/components/auth/YoutubeManager";
import { CenteredContainer } from "@/containers/CenteredContainer";
import { youtubeAuthorizationQueryOptions } from "@/utils/oauth/youtube";

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
