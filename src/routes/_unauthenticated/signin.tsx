import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
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
  useOauthFailedEffect();
  return (
    <CenteredContainer>
      <SignInWithEmailForm />
      <SignInWithGoogleButton />
    </CenteredContainer>
  );
}

const useOauthFailedEffect = () => {
  const searchParams = Route.useSearch();
  useEffect(() => {
    const { error } = SearchParamsSchema.parse(searchParams);
    if (error !== undefined)
      toast.error("OAuth failed", {
        description: "Please try again.",
      });
  }, [searchParams]);
};
