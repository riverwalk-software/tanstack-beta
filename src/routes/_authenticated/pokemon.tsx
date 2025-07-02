import {
  createFileRoute,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";

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
  const { sessionData } = useRouteContext({ from: "/_authenticated" });
  const [pokemonId, setPokemonId] = useState(1);
  const router = useRouter();
  // const doStuff = useMutation({
  //   mutationKey: [authenticationQueryOptions.queryKey],
  //   mutationFn: () => doStuffFn(),
  // });
  return (
    <div className="grid grid-cols-1 place-items-center bg-blue-200 md:grid-cols-2 lg:grid-cols-3">
      <p className="m-4 bg-red-300 p-6 text-purple-800">Section 1</p>
      <p className="m-4 bg-red-300 p-6 text-purple-800">Section 2</p>
      <p className="m-4 bg-red-300 p-6 text-purple-800">Section 3</p>
    </div>
  );
}
