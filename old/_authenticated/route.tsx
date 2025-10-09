// import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
// import { SessionData } from "#authentication/query-options.js"

// export const Route = createFileRoute("/_authenticated")({
//   beforeLoad: ({
//     context: { authenticationData },
//     location,
//   }): Promise<{ sessionData: SessionData }> => {
//     if (authenticationData === null) {
//       throw redirect({
//         to: "/sign-in",
//       })
//     }

//     return Promise.resolve({ sessionData: authenticationData })
//   },
//   component: AuthenticatedPathlessLayout,
// })

// function AuthenticatedPathlessLayout() {
//   return <Outlet />
// }
