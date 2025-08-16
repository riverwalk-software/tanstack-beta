import { createFileRoute } from "@tanstack/react-router";
import { SignUpWithEmailForm } from "@/components/auth/SignUpWithEmailForm";
import { CenteredContainer } from "@/components/containers/CenteredContainer";

export const Route = createFileRoute("/_unauthenticated/signup/")({
  component: SignUp,
});

function SignUp() {
  return (
    <CenteredContainer>
      <SignUpWithEmailForm />
    </CenteredContainer>
  );
}
