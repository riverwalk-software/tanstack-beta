import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { toast } from "sonner";
import { match } from "ts-pattern";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
import { authClient, isBetterAuthErrorContext } from "./lib/auth-client";
import { routeTree } from "./routeTree.gen";
import { authenticationDataQueryOptions } from "./utils/authentication";
import { ServerFnError } from "./utils/errors";

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (failureCount >= 3) return false;
          return error instanceof ServerFnError
            ? match(error.code)
                .with("UNAUTHENTICATED", () => false)
                .with("YOUTUBE_UNAUTHORIZED", () => false)
                .with("SERVICE_UNAVAILABLE", () => false)
                .exhaustive()
            : false;
        },
      },
    },
  });

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    context: { queryClient },
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  });

  const onError = async (unknownError: unknown) => {
    if (isBetterAuthErrorContext(unknownError)) {
      const { error } = unknownError;
      match(error.code)
        .with("EMAIL_NOT_VERIFIED", () =>
          alert(`Email not verified.

      An email has been sent to verify your account.
      Please check your inbox and click the verification link.

      If you don't see the email, check your spam folder.`),
        )
        .otherwise(() => toast.error(error.message));
    } else if (unknownError instanceof ServerFnError)
      match(unknownError.code)
        .with("UNAUTHENTICATED", async () => {
          toast.error("You are no longer signed in.", {
            description: "Redirecting to sign in page...",
          });
          try {
            await authClient.signOut();
          } catch (error) {
            console.warn("Sign out failed during error recovery:", error);
          }
          await queryClient.invalidateQueries({
            queryKey: authenticationDataQueryOptions.queryKey,
          });
          await router.invalidate({ sync: true });
        })
        .with("YOUTUBE_UNAUTHORIZED", () =>
          toast.error("YouTube API access is unauthorized.", {
            description: "Please reauthorize your YouTube account.",
          }),
        )
        .with("SERVICE_UNAVAILABLE", () =>
          toast.error("This service is currently down.", {
            description: "Please try again later.",
          }),
        )
        .exhaustive();
    else {
      console.error("Unexpected error", unknownError);
      toast.error("Something went wrong.", {
        description: "Please try again later.",
      });
    }
  };

  queryClient.getQueryCache().config.onError = onError;
  queryClient.getMutationCache().config.onError = onError;

  return routerWithQueryClient(router, queryClient);
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
