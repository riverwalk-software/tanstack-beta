import { createFileRoute } from "@tanstack/react-router";
import { YoutubeManager } from "@/components/auth/YoutubeManager";
import { CenteredContainer } from "@/containers/CenteredContainer";

export const Route = createFileRoute("/_authenticated/")({
  component: Home,
});

function Home() {
  return (
    <CenteredContainer>
      <YoutubeManager />
    </CenteredContainer>
  );
}
