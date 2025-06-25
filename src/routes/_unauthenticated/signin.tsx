import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { TEST_USER } from "@/utils/constants";

export const Route = createFileRoute("/_unauthenticated/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Button
      onClick={() =>
        authClient.signIn.email(
          { ...TEST_USER },
          {
            onSuccess: () => {
              toast.success("Sign in successful!");
            },
            onError: (error) => {
              toast.error(`Sign in failed: ${error.message}`);
            },
          },
        )
      }
    >
      Sign In
    </Button>
  );
}
