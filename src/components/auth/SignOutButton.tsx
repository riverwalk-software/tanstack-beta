import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { afterSignOut, authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

export function SignOutButton() {
  const { signOut, isPending } = useSignOut();
  return (
    <Button onClick={() => signOut()} disabled={isPending}>
      {isPending ? "Signing out..." : "Sign Out"}
    </Button>
  );
}

const useSignOut = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: signOut, isPending } = useMutation({
    mutationKey: ["signOut"],
    mutationFn: () => authClient.signOut(), // Does not throw
    onSettled: () => afterSignOut(queryClient, router),
  });
  return { signOut, isPending };
};
