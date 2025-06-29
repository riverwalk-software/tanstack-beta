import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { authenticationQueryOptions } from "@/utils/authentication";
import { Button } from "../ui/button";

export function SignOutButton() {
  const { mutate: signOut, isPending } = useSignOut();
  return (
    <Button onClick={() => signOut()} disabled={isPending}>
      {isPending ? "Signing out..." : "Sign Out"}
    </Button>
  );
}

const useSignOut = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => authClient.signOut(),
    onError: () =>
      toast.error("Failed to sign out.", {
        description: "Please try again.",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authenticationQueryOptions.queryKey,
      });
      await router.invalidate({ sync: true });
    },
  });
};
