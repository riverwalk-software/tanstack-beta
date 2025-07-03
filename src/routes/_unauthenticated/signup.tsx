import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import {
  emailAtom,
  SignUpWithEmailForm,
} from "@/components/auth/SignUpWithEmailForm";
import { CenteredContainer } from "@/containers/CenteredContainer";

export const Route = createFileRoute("/_unauthenticated/signup")({
  component: SignUp,
});

function SignUp() {
  const email = useAtomValue(emailAtom);
  return (
    <CenteredContainer>
      {email ? (
        <div className="flex flex-col items-center gap-4">
          <p>Check your email</p>
          {/* <ResendVerificationButton email={email} /> */}
        </div>
      ) : (
        <SignUpWithEmailForm />
      )}
    </CenteredContainer>
  );
}
