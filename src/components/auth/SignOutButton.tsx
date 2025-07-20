import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { AUTH_CALLBACK_ROUTE } from "@/utils/constants";
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
    mutationFn: () => authClient.signOut(), // Does not throw
    onSuccess: async () => {
      queryClient.clear();
      await navigate({ to: AUTH_CALLBACK_ROUTE });
    },
  });
  return { signOut, isPending };
};
