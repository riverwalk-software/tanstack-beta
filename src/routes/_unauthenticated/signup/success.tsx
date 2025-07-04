import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { emailAtom } from "@/components/auth/SignUpWithEmailForm";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { AUTH_CALLBACK_ROUTE } from "@/utils/constants";

export const Route = createFileRoute("/_unauthenticated/signup/success")({
  component: RouteComponent,
});

function RouteComponent() {
  const email = useAtomValue(emailAtom);
  return (
    <Button onClick={() => authClient.verifyEmail({ query: { token: email } })}>
      Verify Email
    </Button>
  );
}

export const resendVerificationEmail = async ({ email }: { email: string }) => {
  await authClient.sendVerificationEmail({
    email,
    callbackURL: AUTH_CALLBACK_ROUTE,
  });
};

// https://www.better-auth.com/docs/authentication/email-password#triggering-manually-email-verification
//
