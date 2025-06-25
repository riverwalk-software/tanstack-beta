import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { authenticationQueryOptions } from "@/utils/authentication";
import { TEST_USER } from "@/utils/constants";

export const Route = createFileRoute("/_unauthenticated/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <Button
      disabled={pending}
      onClick={() =>
        authClient.signIn.email(
          { ...TEST_USER },
          {
            onRequest: () => {
              setPending(true);
            },
            onSuccess: async () => {
              toast.success("Sign in successful!");
              await queryClient.invalidateQueries({
                queryKey: authenticationQueryOptions.queryKey,
              });
              await router.invalidate({ sync: true });
            },
            onError: (context) => {
              toast.error(`Sign in failed: ${context.error.message}`);
              setPending(false);
            },
          },
        )
      }
    >
      Sign In
    </Button>
  );
}
