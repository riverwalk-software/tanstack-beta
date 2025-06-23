/// <reference types="vite/client" />

import type { QueryClient } from "@tanstack/react-query";
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
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { ThemeProvider, useTheme } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import globalsCss from "@/styles/globals.css?url";
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
  // beforeLoad: ({ context: { queryClient } }) =>
  //   queryClient.ensureQueryData(authQueryOptions),
  loader: (): Promise<Theme> => getThemeFn(),
});

function RootComponent() {
  const theme: Theme = Route.useLoaderData();
  return (
    <ThemeProvider theme={theme}>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ThemeProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  // useSuspenseQuery(authQueryOptions); // Ensure auth query is loaded
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
        <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>{" "}
          <ThemeToggle />
        </div>
        <hr />
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}
