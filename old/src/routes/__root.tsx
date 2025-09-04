function RootComponent() {
  const { maybeEnvironmentValidation } = useEnvironmentValidation()
  return (
    <CookiesProvider defaultSetOptions={DEFAULT_COOKIE_OPTIONS}>
      <RootDocument>
        {match(maybeEnvironmentValidation)
          .with({ isError: true }, environmentValidation => (
            <EnvironmentError {...environmentValidation} />
          ))
          .otherwise(() => (
            <Outlet />
          ))}
      </RootDocument>
    </CookiesProvider>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { theme } = useTheme()
  return (
    <html
      className={theme}
      data-theme={theme}
      lang="en" // Suppress hydration because theme may differ between server and client
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <Navbar />
        <hr />
        <main className="grid flex-1">{children} </main>
        <Toaster richColors />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  )
}

function Navbar() {
  const {
    authenticationData: { isAuthenticated },
  } = Route.useRouteContext()
  return (
    <div className="flex gap-2 p-2 text-lg">
      <div className="flex flex-1 gap-2">
        {isAuthenticated ? <HomeLink /> : undefined}
      </div>
      <div className="ml-auto flex gap-2">
        {isAuthenticated ? (
          <>
            {/* <ProfileLink /> */}
            <SignOutButton />
          </>
        ) : (
          <>
            <SigninLink />
            <SignupLink />
          </>
        )}
      </div>
      <ThemeToggle />
    </div>
  )
}

function HomeLink() {
  return (
    <Link
      activeOptions={{ exact: true }}
      activeProps={{
        className: "font-bold",
      }}
      to="/"
    >
      Home
    </Link>
  )
}

function SigninLink() {
  return (
    <Link
      activeOptions={{ exact: false }}
      activeProps={{
        className: "font-bold",
      }}
      to="/signin"
    >
      Sign In
    </Link>
  )
}

function SignupLink() {
  return (
    <Link
      activeOptions={{ exact: true }}
      activeProps={{
        className: "font-bold",
      }}
      to="/signup"
    >
      Sign Up
    </Link>
  )
}
// function ProfileLink() {
//   return (
//     <Link
//       to="/profile"
//       activeProps={{
//         className: "font-bold",
//       }}
//       activeOptions={{ exact: true }}
//     >
//       Profile
//     </Link>
//   )
// }
