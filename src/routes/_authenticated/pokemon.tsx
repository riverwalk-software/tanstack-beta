import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import {
  authenticationQueryOptions,
  getSessionDataMw,
} from "@/utils/authentication";

export const Route = createFileRoute("/_authenticated/pokemon")({
  component: RouteComponent,
});

const doStuffFn = createServerFn()
  .middleware([getSessionDataMw])
  .handler(async ({ context: { sessionData } }) => {
    throw new Error("unauthorized");
    return `Hello ${sessionData.user.name ?? "Guest"}!`;
  });

function RouteComponent() {
  const router = useRouter();
  const doStuff = useMutation({
    mutationKey: [authenticationQueryOptions.queryKey],
    mutationFn: () => doStuffFn(),
  });
  return (
    <Button disabled={doStuff.isPending} onClick={() => doStuff.mutate()}>
      Click
    </Button>
  );
}
