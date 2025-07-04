import { type DefaultError, QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { toast } from "sonner";
import { match } from "ts-pattern";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
import { authClient } from "./lib/auth-client";
import { routeTree } from "./routeTree.gen";
import { authenticationQueryOptions } from "./utils/authentication";
import { type ServerFnErrorCode, ServerFnErrorCodes } from "./utils/errors";

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (failureCount >= 3) return false;
          return error.message in ServerFnErrorCodes
            ? match(error.message as ServerFnErrorCode)
                .with("UNAUTHENTICATED", () => false)
                .with("YOUTUBE_UNAUTHORIZED", () => false)
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

  const onError = async (error: DefaultError) => {
    if (error.message in ServerFnErrorCodes)
      match(error.message as ServerFnErrorCode)
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
            queryKey: authenticationQueryOptions.queryKey,
          });
          await router.invalidate({ sync: true });
        })
        .with("YOUTUBE_UNAUTHORIZED", async () => {
          toast.error("YouTube API access is unauthorized.", {
            description: "Please reauthorize your YouTube account.",
          });
        })
        .exhaustive();
    else {
      console.error("Unexpected error", error);
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
