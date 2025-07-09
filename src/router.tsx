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
import { AUTH_CALLBACK_ROUTE } from "./utils/constants";
import { ServerFnError } from "./utils/errors";

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
        (unknownError) => unknownError instanceof ServerFnError,
        ({ code }) =>
          match(code)
            .with("UNAUTHENTICATED", async () => {
              toast.error("You are no longer signed in.", {
                description: redirectDescription,
              });
              await redirectFlow();
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
            .exhaustive(),
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

  const redirectDescription = "Redirecting to sign in page...";
  const redirectFlow = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.warn("Sign out failed during error recovery:", error);
    }
    await queryClient.invalidateQueries({
      queryKey: authenticationDataQueryOptions.queryKey,
    });
    await router.navigate({ to: AUTH_CALLBACK_ROUTE });
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
