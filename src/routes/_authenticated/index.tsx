import { createFileRoute } from "@tanstack/react-router";
import { CenteredContainer } from "@/containers/CenteredContainer";

export const Route = createFileRoute("/_authenticated/")({
  component: Home,
});

function Home() {
  return (
    <CenteredContainer>
      <p>Home</p>
    </CenteredContainer>
  );
}
