import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { authenticationQueryOptions } from "@/utils/authentication";
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
  const navigate = useNavigate();
  const { mutate: signOut, isPending } = useMutation({
    mutationKey: ["signOut"],
    mutationFn: () => authClient.signOut(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authenticationQueryOptions.queryKey,
      });
      await navigate({ to: "/signin" });
    },
  });
  return { signOut, isPending };
};
