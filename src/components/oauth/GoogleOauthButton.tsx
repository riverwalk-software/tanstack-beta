import { useSignInWithGoogle } from "@/utils/oauth/google";
import { Button } from "../ui/button";

export function GoogleOauthButton() {
  const { redirectToConsentUrl, isPending } = useSignInWithGoogle();
  return (
    <Button disabled={isPending} onClick={() => redirectToConsentUrl()}>
      Log in with Google
    </Button>
  );
}
