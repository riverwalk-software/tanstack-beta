import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { authClient } from "#lib/auth-client.js"

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,
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

function RouteComponent() {
  // const { data, error } = useBenefits()
  // console.log("BENEFITS DATA", data, error)
  // const benefits =
  //   data.data?.result.items.map(item => item.benefit.description) || []
  // console.log("BENEFITS", benefits)
  // return <div>Home</div>
  // return products.map(product => (
  //   <Card key={product.productId}>
  //     <CardHeader>
  //       <CardTitle>{product.name}</CardTitle>
  //       <CardAction>
  //         {product.benefits.every(benefit => benefits.includes(benefit)) ? (
  //           "Purchased"
  //         ) : (
  //           <Button
  //             onClick={async () => {
  //               const { data, error } = await authClient.checkout({
  //                 slug: product.slug,
  //               })
  //               if (error) {
  //                 toast.error(error.message ?? "Checkout failed")
  //               }
  //             }}
  //             variant="outline"
  //           >
  //             Checkout
  //           </Button>
  //         )}
  //       </CardAction>
  //     </CardHeader>
  //   </Card>
  // ))
}
