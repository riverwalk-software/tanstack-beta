import { createFileRoute, redirect } from "@tanstack/react-router"
import { useEffect } from "react"
import { toast } from "sonner"
import z from "zod"
import { HOME_ROUTE } from "../../lib/constants"

const SearchParamsSchema = z
  .object({
    checkout_id: z.string(),
    customer_session_token: z.string(),
  })
  .partial()

export const Route = createFileRoute("/_authenticated/success")({
  validateSearch: SearchParamsSchema,
  beforeLoad: ({ search: { checkout_id, customer_session_token } }) => {
    if (checkout_id === undefined || customer_session_token === undefined)
      throw redirect({ to: HOME_ROUTE })
    return { checkout_id, customer_session_token }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { checkout_id, customer_session_token } = Route.useRouteContext()
  useEffect(() => {
    toast.success(
      `Successfully purchased ${checkout_id} with session ${customer_session_token}`,
      {
        duration: 5000,
      },
    )
  }, [checkout_id, customer_session_token])
  return (
    <div>{`Purchased ${checkout_id} with session ${customer_session_token}`}</div>
  )
}
