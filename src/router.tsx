import { type DefaultError, QueryClient } from "@tanstack/react-query";
import {
  createRouter as createTanStackRouter,
  isRedirect,
} from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { toast } from "sonner";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
import { authClient } from "./lib/auth-client";
import { routeTree } from "./routeTree.gen";
import { authenticationQueryOptions } from "./utils/authentication";

// NOTE: Most of the integration code found here is experimental and will
// definitely end up in a more streamlined API in the future. This is just
// to show what's possible with the current APIs.

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) =>
          error.message !== "unauthorized" && failureCount < 3,
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
    if (error.message === "unauthorized") {
      toast.error("You are no longer signed in.", {
        description: "Redirecting to sign in page...",
      });
      await authClient.signOut({ fetchOptions: { retry: 0, throw: true } });
      await queryClient.invalidateQueries({
        queryKey: authenticationQueryOptions.queryKey,
      });
      await router.invalidate({ sync: true });
    } else if (isRedirect(error)) {
    } else {
      toast.error("This action cannot be performed right now.", {
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
