import { toast } from "sonner";
import { Button } from "../ui/button";

export function GoogleOauthButton() {
  // const { mutate: redirectToConsentUrl, isPending } = useSignInWithGoogle();
  return (
    <Button
      onClick={() => {
        // const consentUrl = getConsentUrlFn();
        toast.success("");
      }}
    >
      Log in with Google
    </Button>
  );
}

// const redirectToConsentUrlMt = atomWithMutation(() => ({
//   mutationFn: () => getConsentUrlFn(),
//   onError: () =>
//     toast.error("Failed to sign in.", {
//       description: "Please try again.",
//     }),
//   onSuccess: async (data: string) => {
//     const consentUrl = data;
//     toast.success("Sign in with Google successful!");
//     toast.info("Redirecting to Google consent page..." + consentUrl);
//   },
// }));

// const useSignInWithGoogle = () => {
//   return useAtomValue(redirectToConsentUrlMt);
// };
