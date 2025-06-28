import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";

function PokemonCardBase({
  isLoading,
  data,
}:
  | {
      isLoading: true;
      data?: never;
    }
  | { isLoading?: false; data: Pokemon }) {
  return (
    <Card className="w-256">
      <CardHeader>
        <CardTitle>
          <div className="justify-left flex h-16 w-20 items-center">
            {isLoading ? (
              <Skeleton className="max-w max-h rounded" />
            ) : (
              <span className="truncate capitalize">{data.name}</span>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          <div className="justify-left flex h-5 items-center">
            {isLoading ? (
              <Skeleton className="h-4 w-16 rounded" />
            ) : (
              <p>#{data.id.toString().padStart(3, "0")}</p>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mx-auto mb-4 flex h-128 w-128 items-center justify-center rounded-lg bg-muted/10">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-lg" />
          ) : (
            <img
              src={data.sprites.other["official-artwork"].front_default}
              alt={data.name}
              className="max-h-full max-w-full object-contain"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PokemonCardLoading() {
  return <PokemonCardBase isLoading={true} />;
}

function PokemonCardContent({ pokemonId }: { pokemonId: number }) {
  const { data: pokemon } = useSuspenseQuery({
    queryKey: ["pokemon", pokemonId],
    queryFn: async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch Pokemon");
      return response.json() as Pokemon;
    },
  });

  return <PokemonCardBase data={pokemon} />;
}

export function PokemonCard({ pokemonId }: { pokemonId: number }) {
  return (
    <Suspense fallback={<PokemonCardLoading />}>
      <PokemonCardContent pokemonId={pokemonId} />
    </Suspense>
  );
}

const PokemonSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().nonempty(),
  sprites: z.object({
    other: z.object({
      "official-artwork": z.object({
        front_default: z.string().url(),
      }),
    }),
  }),
});

type Pokemon = z.infer<typeof PokemonSchema>;
