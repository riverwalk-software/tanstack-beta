import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

// const SearchParamsSchema =
// z
//   .object({
//     redirect: z.string(),
//   })
//   .partial()

export const Route = createFileRoute("/_unauthenticated")({
  // validateSearch: SearchParamsSchema,
  beforeLoad: ({ context: { authenticationData }, search }) => {
    if (authenticationData !== null) {
      throw redirect({ to: "/" })
    }
  },
  component: UnauthenticatedPathlessLayout,
})

function UnauthenticatedPathlessLayout() {
  return <Outlet />
}
