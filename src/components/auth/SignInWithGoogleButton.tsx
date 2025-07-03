import { useMutation } from "@tanstack/react-query";
import GoogleButton from "react-google-button";
import { authClient } from "@/lib/auth-client";
import { AUTH_CALLBACK_ROUTE } from "@/utils/constants";
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
        callbackURL: AUTH_CALLBACK_ROUTE,
      }),
  });
  return { signInWithGoogle, isPending };
};
