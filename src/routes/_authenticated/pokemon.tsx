import { useQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
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
  return (
    <div className="grid grid-cols-1 place-items-center bg-blue-200 md:grid-cols-2 lg:grid-cols-3">
      {/* <Suspense fallback={<p>Loading Pokémon...</p>}> */}
      <PokemonDetails />
      <PreviousPokemonButton />
      <NextsPokemonButton />
      {/* </Suspense> */}
      <p className="m-4 bg-red-300 p-6 text-purple-800">Section 3</p>
    </div>
  );
}
function PreviousPokemonButton() {
  const { previousPokemon } = usePokemonId();

  return <Button onClick={previousPokemon}>Previous</Button>;
}
function NextsPokemonButton() {
  const { nextPokemon } = usePokemonId();

  return <Button onClick={nextPokemon}>Next</Button>;
}
function PokemonDetails() {
  const { results, someLoading, someError } = usePokemon();
  if (someLoading) return <p>Loading...</p>;
  if (someError) return <p>Error loading Pokémon data</p>;
  const pokemon = results[0].data!;
  const species = results[1].data!;
  return (
    <>
      <p className="m-4 bg-red-300 p-6 text-purple-800">
        {pokemon.id} - {pokemon.name}
      </p>
      <p className="m-4 bg-red-300 p-6 text-purple-800">
        {species.id} - {`Capture Rate: ${species.capture_rate}`}
      </p>
    </>
  );
}

const usePokemonId = () => {
  const {
    count: pokemonId,
    decrement: previousPokemon,
    increment: nextPokemon,
  } = useCounter({
    key: "pokemonId",
    initialValue: 1,
    minValue: 1,
    maxValue: 151,
  });
  return { pokemonId, previousPokemon, nextPokemon };
};

const usePokemon = () => {
  const { pokemonId } = usePokemonId();
  // const { data: unknownPokemon } = useSuspenseQuery({
  //   queryKey: ["pokemon", pokemonId],
  //   queryFn: async () => {
  //     const response = await fetch(
  //       `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch Pokémon data");
  //     }
  //     return response.json();
  //   },
  // });
  const { results, someError, someLoading } = useQueries({
    queries: [
      {
        queryKey: ["pokemon", pokemonId],
        queryFn: async () => {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
          );
          if (!response.ok) {
            throw new Error("Failed to fetch Pokémon data");
          }
          const data = await response.json();
          return PokemonSchema.parse(data);
        },
      },
      {
        queryKey: ["species", pokemonId],
        queryFn: async () => {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`,
          );
          if (!response.ok) {
            throw new Error("Failed to fetch Pokémon data");
          }
          const data = await response.json();
          return PokemonSpeciesSchema.parse(data);
        },
      },
    ],
    combine: (results) => {
      const someLoading = results.some((result) => result.isLoading);
      const someError = results.some((result) => result.isError);
      return { results, someLoading, someError };
    },
  });
  return {
    someLoading,
    someError,
    results,
  };
};

const PokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
});
const PokemonSpeciesSchema = z.object({
  id: z.number(),
  capture_rate: z.number().int(),
});
