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
import { CookiesProvider } from "react-cookie";
import { Toaster } from "sonner";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import globalsCss from "@/styles/globals.css?url";
import {
  type AuthenticationData,
  authenticationDataQueryOptions,
} from "@/utils/authentication";
import {
  EnvironmentError,
  environmentValidationQueryOptions,
  useEnvironmentValidation,
} from "@/utils/environment";
import { seo } from "@/utils/seo";
import { themeQueryOptions, useTheme } from "@/utils/theme";

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
  beforeLoad: async ({
    context: { queryClient },
  }): Promise<{ authenticationData: AuthenticationData }> => {
    const authenticationData = await queryClient.fetchQuery(
      authenticationDataQueryOptions,
    );
    return { authenticationData };
  },
  loader: async ({ context: { queryClient } }): Promise<void> => {
    await Promise.all([
      import.meta.env.DEV
        ? queryClient.prefetchQuery(environmentValidationQueryOptions)
        : Promise.resolve(),
      queryClient.prefetchQuery(themeQueryOptions),
    ]);
  },
  errorComponent: (props) => (
    <RootDocument>
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  ),
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  const { environmentValidation } = useEnvironmentValidation();
  return (
    <CookiesProvider
      defaultSetOptions={{
        httpOnly: false,
        path: "/",
        sameSite: "lax",
        secure: !import.meta.env.DEV,
      }}
    >
      <RootDocument>
        {environmentValidation?.isError ? (
          <EnvironmentError {...environmentValidation} />
        ) : (
          <Outlet />
        )}
      </RootDocument>
    </CookiesProvider>
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
      <body suppressHydrationWarning className="flex min-h-screen flex-col">
        <Navbar />
        <hr />
        <main className="grid flex-1">{children} </main>
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
    <div className="flex gap-2 p-2 text-lg">
      <div className="flex flex-1 gap-2">
        {isAuthenticated ? (
          <>
            <HomeLink />
            {/* <ProfileLink /> */}
          </>
        ) : null}
      </div>
      <div className="ml-auto flex gap-2">
        {isAuthenticated ? (
          <SignOutButton />
        ) : (
          <>
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
