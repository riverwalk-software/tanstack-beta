import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { SchoolCard } from "@/components/SchoolCard";
import { userStoreQueryOptions, useUserStore } from "@/hooks/useUserStore";
import { schoolsQueryOptions } from "@/utils/schools";

export const Route = createFileRoute("/_authenticated/schools/")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }): Promise<void> =>
    queryClient.prefetchQuery(userStoreQueryOptions),
});

function RouteComponent() {
  const { getProgress } = useUserStore();
  const x = getProgress({ _tag: "ALL" });
  const { data: schools } = useSuspenseQuery(schoolsQueryOptions);
  return (
    <div>
      <h1>Schools</h1>
      <ul>
        {schools.map(({ slug, name, description }) => (
          <li key={slug}>
            <SchoolCard name={name} description={description} slug={slug} />
          </li>
        ))}
      </ul>
    </div>
  );
}
