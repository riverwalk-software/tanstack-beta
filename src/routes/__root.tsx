import { DefaultCatchBoundary, NotFound } from "@components"
import type { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import { ReactNode } from "react"
import globalsCss from "src/styles/globals.css?url"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf8",
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
  errorComponent: props => (
    <RootDocument>
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  ),
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <ReactScanScript />
      </head>
      <body>
        {/* <div className="p-2 flex gap-2 text-lg">
        <Link
          activeOptions={{ exact: true }}
          activeProps={{
            className: "font-bold",
          }}
          to="/"
        >
          Home
        </Link>{" "}
        <Link
          activeProps={{
            className: "font-bold",
          }}
          to="/posts"
        >
          Posts
        </Link>{" "}
        <Link
          activeProps={{
            className: "font-bold",
          }}
          to="/users"
        >
          Users
        </Link>{" "}
        <Link
          activeProps={{
            className: "font-bold",
          }}
          to="/route-a"
        >
          Pathless Layout
        </Link>{" "}
        <Link
          activeProps={{
            className: "font-bold",
          }}
          to="/deferred"
        >
          Deferred
        </Link>{" "}
        <Link
          // @ts-expect-error
          activeProps={{
            className: "font-bold",
          }}
          to="/this-route-does-not-exist"
        >
          This Route Does Not Exist
        </Link>
      </div> */}
        <hr />
        {children}
        {/* <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" /> */}
        <Scripts />
      </body>
    </html>
  )
}

function ReactScanScript() {
  return (
    <script
      crossOrigin="anonymous"
      src="//unpkg.com/react-scan/dist/auto.global.js"
    />
  )
}

// oxlint-disable-next-line func-style
const seo = ({
  title,
  description,
  keywords,
  image,
}: {
  title: string
  description?: string
  image?: string
  keywords?: string
}) => [
  { title },
  { name: "description", content: description },
  { name: "keywords", content: keywords },
  { name: "twitter:title", content: title },
  { name: "twitter:description", content: description },
  { name: "twitter:creator", content: "@tannerlinsley" },
  { name: "twitter:site", content: "@tannerlinsley" },
  { name: "og:type", content: "website" },
  { name: "og:title", content: title },
  { name: "og:description", content: description },
  ...(image
    ? [
        { name: "twitter:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "og:image", content: image },
      ]
    : []),
]
