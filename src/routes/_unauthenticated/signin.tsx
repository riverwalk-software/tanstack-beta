import { createFileRoute } from "@tanstack/react-router";
import ms from "ms";
import { useEffect } from "react";
import { toast } from "sonner";
import { match } from "ts-pattern";
import { z } from "zod";
import { SignInWithEmailForm } from "@/components/auth/SignInWithEmailForm";
import { SignInWithGoogleButton } from "@/components/auth/SignInWithGoogleButton";
import { CenteredContainer } from "@/containers/CenteredContainer";

const SearchParamsSchema = z
  .object({
    error: z.string(),
  })
  .partial();

export const Route = createFileRoute("/_unauthenticated/signin")({
  component: SignIn,
});

function SignIn() {
  FailedSignInEffect();
  return (
    <CenteredContainer>
      <div className="flex flex-col items-center gap-8">
        <SignInWithEmailForm />
        <SignInWithGoogleButton />
      </div>
    </CenteredContainer>
  );
}

const FailedSignInEffect = () => {
  const searchParams = Route.useSearch();
  useEffect(() => {
    const { error } = SearchParamsSchema.parse(searchParams);
    match(error)
      .with(undefined, () => {})
      .with("invalid_token", () =>
        toast.error("Email verification link expired", {
          // action: {
          //   label: "Resend verification email",
          //   onClick: () => resendVerificationEmail(),
          // },
          description: "Please try verifying your email again.",
          duration: ms("30s"),
        }),
      )
      .otherwise(() =>
        toast.error("Sign in failed", {
          description: "Please try again.",
        }),
      );
  }, [searchParams]);
};
