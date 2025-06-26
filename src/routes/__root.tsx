/// <reference types="vite/client" />

import type { QueryClient } from "@tanstack/query-core";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { ThemeProvider, useTheme } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import globalsCss from "@/styles/globals.css?url";
import {
  type AuthenticationData,
  authenticationQueryOptions,
} from "@/utils/authentication";
import {
  EnvironmentError,
  type EnvironmentValidation,
  validateEnvironmentFn,
} from "@/utils/environment";
import { seo } from "@/utils/seo";
import { getThemeFn, type Theme } from "@/utils/theme";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title:
          "TanStack Start | Type-Safe, Client-First, Full-Stack React Framework",
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: "stylesheet", href: globalsCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: (props) => (
    <RootDocument>
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  ),
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
  beforeLoad: async ({
    context: { queryClient },
  }): Promise<{ authenticationData: AuthenticationData }> => {
    console.log("Loading root route...");
    const authenticationData = await queryClient.fetchQuery(
      authenticationQueryOptions,
    );
    return { authenticationData };
  },
  loader: async (): Promise<{
    theme: Theme;
    environmentValidation: EnvironmentValidation | null;
  }> => {
    if (import.meta.env.DEV) {
      const [theme, environmentValidation] = await Promise.all([
        getThemeFn(),
        validateEnvironmentFn(),
      ]);
      return { theme, environmentValidation };
    }

    const theme = await getThemeFn();
    return { theme, environmentValidation: null };
  },
});

function RootComponent() {
  const { theme, environmentValidation } = Route.useLoaderData();

  if (environmentValidation !== null && !environmentValidation.isValid) {
    return (
      <ThemeProvider theme={theme}>
        <RootDocument>
          <EnvironmentError {...environmentValidation} />
        </RootDocument>
      </ThemeProvider>
    );
  }
  return (
    <ThemeProvider theme={theme}>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ThemeProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { theme } = useTheme();
  return (
    <html
      lang="en"
      className={theme}
      suppressHydrationWarning // Suppress hydration because theme may differ between server and client
    >
      <head>
        <HeadContent />
      </head>
      <body>
        <Navbar />
        <hr />
        {children}
        <Toaster richColors={true} />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}

function Navbar() {
  const {
    authenticationData: { isAuthenticated },
  } = Route.useRouteContext();
  return (
    <div className="p-2 flex gap-2 text-lg">
      <div className="flex flex-1 gap-2">
        {isAuthenticated ? (
          <>
            <HomeLink />
            {/* <ProfileLink /> */}
          </>
        ) : null}
      </div>
      <div className="flex gap-2 ml-auto">
        {isAuthenticated ? (
          <SignOutButton />
        ) : (
          <>
            <MagicLinkLink />
            <SigninLink />
            <SignupLink />
          </>
        )}
      </div>
      <ThemeToggle />
    </div>
  );
}

function HomeLink() {
  return (
    <Link
      to="/"
      activeProps={{
        className: "font-bold",
      }}
      activeOptions={{ exact: true }}
    >
      Home
    </Link>
  );
}

function MagicLinkLink() {
  return (
    <Link
      to="/magic-link"
      activeProps={{
        className: "font-bold",
      }}
      activeOptions={{ exact: true }}
    >
      Magic Link
    </Link>
  );
}

function SigninLink() {
  return (
    <Link
      to="/signin"
      activeProps={{
        className: "font-bold",
      }}
      activeOptions={{ exact: false }}
    >
      Sign In
    </Link>
  );
}

function SignupLink() {
  return (
    <Link
      to="/signup"
      activeProps={{
        className: "font-bold",
      }}
      activeOptions={{ exact: true }}
    >
      Sign Up
    </Link>
  );
}
