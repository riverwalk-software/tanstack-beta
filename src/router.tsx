import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { toast } from "sonner";
import { match } from "ts-pattern";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
import {
  afterSignOut,
  authClient,
  isBetterAuthErrorContext,
} from "./lib/auth-client";
import { routeTree } from "./routeTree.gen";
import { isClientError, redirectDescription } from "./utils/errors";
import { youtubeAuthorizationDataQueryOptions } from "./utils/oauth/youtube";

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const onError = async (unknownError: unknown) =>
    match(unknownError)
      .when(
        (unknownError) => isBetterAuthErrorContext(unknownError),
        ({ error, response }) => {
          match(response.status)
            .when(
              (status) => status === 429,
              () => {
                const retryAfter = response.headers.get("X-Retry-After");
                toast.error("Rate limit exceeded", {
                  description: `Retry after ${retryAfter} seconds`,
                });
              },
            )
            .otherwise(() => {
              match(error.code)
                .with("SESSION_EXPIRED", async () => {
                  toast.error(error.message, {
                    description: redirectDescription,
                  });
                  await redirectFlow();
                })
                .with("EMAIL_NOT_VERIFIED", () =>
                  alert(
                    `Email not verified.

  An email has been sent to verify your account.
  Please check your inbox and click the verification link.

  If you don't see the email, check your spam folder and whitelist our email address.`,
                  ),
                )
                .otherwise(() => toast.error(error.message));
            });
        },
      )
      .when(
        (unknownError) => isClientError(unknownError),
        ({ _tag, message, description }) => {
          toast.error(message, { description });
          match(_tag)
            .with("UNAUTHENTICATED", async () => {
              await redirectFlow();
            })
            .with("YOUTUBE_UNAUTHORIZED", () => {
              queryClient.invalidateQueries({
                queryKey: youtubeAuthorizationDataQueryOptions.queryKey,
              });
            })
            .with("SERVICE_UNAVAILABLE", () => {})
            .exhaustive();
        },
      )
      .otherwise(() => {
        console.error("Unexpected error", unknownError);
        toast.error(
          <div>
            Something went wrong.{" "}
            {/* <a
              href="https://emilkowal.ski/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              report this issue
            </a> */}
          </div>,
          {
            description: "Please try again later.",
          },
        );
      });

  const redirectFlow = async () => {
    await authClient.signOut(); // Does not throw
    await afterSignOut(queryClient, router);
  };

  queryClient.getQueryCache().config.onError = onError;
  queryClient.getMutationCache().config.onError = onError;

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    context: { queryClient },
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  });

  return routerWithQueryClient(router, queryClient);
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
