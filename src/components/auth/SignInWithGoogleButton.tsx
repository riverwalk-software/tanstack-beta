import { useMutation } from "@tanstack/react-query";
import GoogleButton from "react-google-button";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { ERROR_CALLBACK_URL } from "@/utils/constants";
import { useTheme } from "@/utils/theme";

export function SignInWithGoogleButton() {
  const { signInWithGoogle, isPending } = useSignInWithGoogle();
  const { theme } = useTheme();
  return (
    <GoogleButton
      type={theme}
      disabled={isPending}
      onClick={() => signInWithGoogle()}
    />
  );
}

const useSignInWithGoogle = () => {
  const { mutate: signInWithGoogle, isPending } = useMutation({
    mutationKey: ["signInWithGoogle"],
    mutationFn: () =>
      authClient.signIn.social({
        provider: "google",
        callbackURL: ERROR_CALLBACK_URL,
      }),
    onError: () =>
      toast.error("Failed to sign in.", {
        description: "Please try again later.",
      }),
  });
  return { signInWithGoogle, isPending };
};
