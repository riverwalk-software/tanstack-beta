import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return (
    <div className="p-2">
      <Button
        onClick={async () => {
          await queryClient.invalidateQueries();
          await router.invalidate({ sync: true });
          toast.success("Cache invalidated successfully!");
        }}
      >
        Invalidate
      </Button>
    </div>
  );
}
