import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { authenticationQueryOptions } from "@/utils/authentication";
import { Button } from "../ui/button";

export function SignOutButton() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: async () => {
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
