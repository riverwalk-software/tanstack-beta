import { createFileRoute, redirect } from "@tanstack/react-router"
import { createServerFn, useServerFn } from "@tanstack/react-start"
import { getWebRequest } from "@tanstack/react-start/server"
import { CenteredContainer } from "../../components/containers/CenteredContainer"
import { Button } from "../../components/ui/button"
import { auth } from "../../lib/auth"
import { PRODUCT_SLUG as TEST_PRODUCT_SLUG } from "../../lib/constants"

export const Route = createFileRoute("/_authenticated/")({
  component: Home,
})

function Home() {
  return (
    <CenteredContainer className="mx-auto flex flex-col gap-8">
      <TestProductPurchaseButton />
      <TestProductPortalButton />
    </CenteredContainer>
  )
}

function TestProductPurchaseButton() {
  const checkout = useServerFn(checkoutFn)
  return (
    <Button disabled={false} onClick={() => checkout()}>
      Purchase Test Product
    </Button>
  )
}

// TODO: Add auth middleware
export const checkoutFn = createServerFn({ method: "POST" }).handler(
  async () => {
    const request = getWebRequest()
    const session = await auth.api.checkout({
      headers: request.headers,
      request,
      body: { slug: TEST_PRODUCT_SLUG },
    })
    throw redirect({
      href: session.url,
      statusCode: 302,
    })
  },
)

function TestProductPortalButton() {
  const productPortal = useServerFn(productPortalFn)
  return (
    <Button disabled={false} onClick={() => productPortal()}>
      Go To Product Portal
    </Button>
  )
}

// TODO: Add auth middleware
export const productPortalFn = createServerFn().handler(async () => {
  const request = getWebRequest()
  const session = await auth.api.portal({
    headers: request.headers,
    request,
  })
  throw redirect({
    href: session.url,
    statusCode: 302,
  })
})

// TODO: Add auth middleware
export const getCustomerStateFn = createServerFn().handler(async () => {
  const request = getWebRequest()
  return await auth.api.state({
    headers: request.headers,
    request,
  })
})
