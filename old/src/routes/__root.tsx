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
}
