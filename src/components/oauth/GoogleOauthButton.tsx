// import { atomWithMutation, queryClientAtom } from "jotai-tanstack-query";
// import { toast } from "sonner";
// import { googleOauthQueryKey } from "@/utils/oauth/google";
// import { Button } from "../ui/button";

// export function GoogleOauthButton() {
//   const { mutate: signInWithGoogle, isPending } = useSignInWithGoogle();
//   return <Button onClick={() => signInWithGoogle()}>Log in with Google</Button>;
// }

// const googleOauthAtom = atomWithMutation((get) => {
//   const queryClient = get(queryClientAtom);
//   return {
//     mutationFn: async () => ,
//     onError: () =>
//       toast.error("Failed to sign in.", {
//         description: "Please try again.",
//       }),
//     onSuccess: async () => {
//       toast.success("Sign in with Google successful!");
//       await queryClient.invalidateQueries({
//         queryKey: googleOauthQueryKey,
//       });
//     },
//   };
// });
// // const useSignInWithGoogle = () => {

// // }
