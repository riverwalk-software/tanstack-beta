import { createFileRoute } from "@tanstack/react-router";
import { GoogleOauthButton } from "@/components/oauth/GoogleOauthButton";
import { CenteredContainer } from "@/containers/CenteredContainer";

export const Route = createFileRoute("/_authenticated/")({
  component: Home,
});

function Home() {
  return (
    <CenteredContainer>
      <GoogleOauthButton />
    </CenteredContainer>
  );
}
