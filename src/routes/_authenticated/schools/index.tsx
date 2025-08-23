import { useSchools } from "@schools";
import { createFileRoute } from "@tanstack/react-router";
import { userStoreQueryOptions } from "@userStore";
import { SchoolCard } from "@/components/SchoolCard";

export const Route = createFileRoute("/_authenticated/schools/")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }): Promise<void> =>
    queryClient.prefetchQuery(userStoreQueryOptions),
});

function RouteComponent() {
  const { schools } = useSchools();
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
