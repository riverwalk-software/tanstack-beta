import { useAtomValue } from "jotai";
import { atomWithMutation } from "jotai-tanstack-query";
import { toast } from "sonner";
import { getConsentUrlFn } from "@/utils/oauth/google";
import { Button } from "../ui/button";

export function GoogleOauthButton() {
  const { mutate: getConsentUrl, isPending } = useSignInWithGoogle();
  return (
    <Button
      disabled={isPending}
      onClick={async () => {
        const redirectUrl = await getConsentUrlFn();
        toast.success(redirectUrl);
      }}
    >
      Log in with Google
    </Button>
  );
}

const getConsentUrlMt = atomWithMutation(() => ({
  mutationFn: () => getConsentUrlFn(),
  onError: () =>
    toast.error("Failed to sign in.", {
      description: "Please try again.",
    }),
  onSuccess: async (data: string) => {
    const consentUrl = data;
    toast.success("Sign in with Google successful!");
    toast.info("Redirecting to Google consent page..." + consentUrl);
  },
}));

const useSignInWithGoogle = () => {
  return useAtomValue(getConsentUrlMt);
};
