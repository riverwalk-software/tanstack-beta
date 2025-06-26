import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { atom, useSetAtom } from "jotai";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { authenticationQueryOptions } from "@/utils/authentication";
import { Button } from "../ui/button";

const isPendingAtom = atom(false);

export function SignOutButton() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setIsPending = useSetAtom(isPendingAtom);
  return (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onRequest: () => setIsPending(true),
            onError: ({ error: { message } }) => {
              toast.error(message);
              setIsPending(false);
            },
            onSuccess: async () => {
              toast.success("Signed out successfully");
              await queryClient.invalidateQueries({
                queryKey: authenticationQueryOptions.queryKey,
              });
              await router.invalidate({ sync: true });
            },
          },
        })
      }
    >
      Sign Out
    </Button>
  );
}
