import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CenteredContainer } from "@/containers/CenteredContainer";

export const Route = createFileRoute("/_unauthenticated/magic-link")({
  component: RouteComponent,
});

const onClick = async () => {
  alert("Magic link sign in clicked");
};

function RouteComponent() {
  return (
    <CenteredContainer>
      <Button onClick={onClick}>Magic Link Sign In</Button>
    </CenteredContainer>
  );
}
