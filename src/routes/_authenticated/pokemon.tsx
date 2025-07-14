import {
  createFileRoute,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCounter } from "@/hooks/useCounter";

export const Route = createFileRoute("/_authenticated/pokemon")({
  component: Pokemon,
});

// const doStuffFn = createServerFn()
//   .middleware([getSessionDataMw])
//   .handler(async ({ context: { sessionData } }) => {
//     throw new Error("unauthorizeds");
//     return `Hello ${sessionData.user.name ?? "Guest"}!`;
//   });

function Pokemon() {
  const { count, increment, decrement } = useCounter({ key: "pokemon" });
  const { sessionData } = useRouteContext({ from: "/_authenticated" });
  const [pokemonId, setPokemonId] = useState(1);
  const router = useRouter();
  // const doStuff = useMutation({
  //   mutationKey: [authenticationDataQueryOptions.queryKey],
  //   mutationFn: () => doStuffFn(),
  // });
  return (
    <div className="grid grid-cols-1 place-items-center bg-blue-200 md:grid-cols-2 lg:grid-cols-3">
      <p className="m-4 bg-red-300 p-6 text-purple-800">{count}</p>
      <Meme />
      <p className="m-4 bg-red-300 p-6 text-purple-800">Section 3</p>
      <Button onClick={decrement}>Decrement</Button>
      <Button onClick={increment}>Increment</Button>
    </div>
  );
}

function Meme() {
  const { count: count2 } = useCounter({ key: "pokemon" });
  return <p className="m-4 bg-red-300 p-6 text-purple-800">{count2}</p>;
}
