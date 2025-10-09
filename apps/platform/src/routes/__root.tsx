import { ThemeProvider, useTheme } from "@repo/platform-theme"
import type { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import type { ReactNode } from "react"
import { Toaster } from "sonner"
import { DefaultCatchBoundary } from "#pages/default-catch-boundary.js"
import { NotFound } from "#pages/not-found.js"
import stylesCss from "#styles/globals.css?url"
// import { authClient } from "@/lib/auth-client"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  // beforeLoad: async ({
  //   context: { queryClient },
  // }): Promise<{ authenticationData: AuthenticationData }> => {
  //   const maybeAuthenticationData = await queryClient.fetchQuery(
  //     authenticationDataQueryOptions,
  //   )
  //   return { authenticationData: maybeAuthenticationData }
  // },
  // loader: async ({ context: { queryClient } }): Promise<void> => {
  //   await Promise.all([
  //     IS_DEV
  //       ? queryClient.prefetchQuery(environmentValidationQueryOptions)
  //       : Promise.resolve(),
  //     queryClient.prefetchQuery(themeQueryOptions),
  //   ])
  // },
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
      { rel: "stylesheet", href: stylesCss },
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
    <ThemeProvider>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ThemeProvider>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { theme } = useTheme()
  return (
    <html className={theme} data-theme={theme} lang="en">
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
        {/* <Navbar /> */}
        <hr />
        {children}
        {/* <TanStackDevtools
          plugins={[
            {
              name: "TanStack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        /> */}
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}

// function Navbar() {
//   const { authenticationData } = Route.useRouteContext()
//   const isAuthenticated = authenticationData !== null
//   const router = useRouter()
//   const queryClient = useQueryClient()
//   return (
//     <div className="flex gap-2 p-2 text-lg">
//       <div className="flex flex-1 gap-2">{isAuthenticated && <HomeLink />}</div>
//       <div className="ml-auto flex gap-2">
//         {isAuthenticated ? (
//           <>
//             <ProfileLink />
//             {/* <SignOutButton /> */}
//             {/* <Button
//               onClick={async () => {
//                 await authClient.signOut()
//                 await queryClient.invalidateQueries({
//                   queryKey: authenticationDataQueryOptions.queryKey,
//                 })
//                 await router.invalidate({ sync: true })
//               }}
//             >
//               Sign Out
//             </Button> */}
//           </>
//         ) : (
//           <>
//             <SigninLink />
//             <SignupLink />
//           </>
//         )}
//       </div>
//       <ThemeToggle />
//     </div>
//   )
// }

// function HomeLink() {
//   return (
//     <Link
//       activeOptions={{ exact: true }}
//       activeProps={{
//         className: "font-bold",
//       }}
//       to="/"
//     >
//       Home
//     </Link>
//   )
// }

// function SigninLink() {
//   return (
//     <Link
//       activeOptions={{ exact: true }}
//       activeProps={{
//         className: "font-bold",
//       }}
//       to="/sign-in"
//     >
//       Sign In
//     </Link>
//   )
// }

// function SignupLink() {
//   return (
//     <Link
//       activeOptions={{ exact: true }}
//       activeProps={{
//         className: "font-bold",
//       }}
//       to="/sign-up"
//     >
//       Sign Up
//     </Link>
//   )
// }

// function ProfileLink() {
//   return (
//     <Link
//       activeOptions={{ exact: true }}
//       activeProps={{
//         className: "font-bold",
//       }}
//       to="/profile"
//     >
//       Profile
//     </Link>
//   )
// }

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
