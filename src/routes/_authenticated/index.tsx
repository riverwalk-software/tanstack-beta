import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { Button } from "../../components/ui/button";
import { auth } from "../../lib/auth";
import { PRODUCT_SLUG as TEST_PRODUCT_SLUG } from "../../lib/constants";

export const Route = createFileRoute("/_authenticated/")({
  component: Home,
});

function Home() {
  return <TestProductPurchaseButton />;
}

function TestProductPurchaseButton() {
  const checkout = useServerFn(checkoutFn);
  return (
    <Button disabled={false} onClick={() => checkout()}>
      Purchase Test Product
    </Button>
  );
}

// TODO: Add auth middleware
export const checkoutFn = createServerFn({ method: "POST" }).handler(
  async () => {
    const request = getWebRequest();
    const session = await auth.api.checkout({
      headers: request.headers,
      request,
      body: { slug: TEST_PRODUCT_SLUG },
    });
    throw redirect({
      href: session.url,
      statusCode: 302,
    });
  },
);
