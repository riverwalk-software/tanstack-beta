import { Button, Card, CardAction, CardHeader, CardTitle } from "@components"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { products } from "@/lib/products"

export const Route = createFileRoute("/_authenticated/")({
  component: Home,
})

function useBenefits() {
  return useSuspenseQuery({
    queryKey: ["benefits"],
    queryFn: async () => {
      const res = await authClient.customer.benefits.list({
        query: { page: 1, limit: 10 },
      })
      return res
    },
  })
}

function Home() {
  const { data } = useBenefits()
  const benefits = data.data.result.items.map(item => item.benefit.description)
  console.log("BENEFITS", benefits)
  return products.map(product => (
    <Card key={product.productId}>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardAction>
          {product.benefits.every(benefit => benefits.includes(benefit)) ? (
            "Purchased"
          ) : (
            <Button
              onClick={async () => {
                const { data, error } = await authClient.checkout({
                  slug: product.slug,
                })
                if (error) {
                  toast.error(error.message ?? "Checkout failed")
                }
              }}
              variant="outline"
            >
              Checkout
            </Button>
          )}
        </CardAction>
      </CardHeader>
    </Card>
  ))
}
