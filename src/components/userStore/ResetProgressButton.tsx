import { useUserStore } from "@/hooks/useUserStore";
import type { SetUserStoreParams } from "@/utils/userStore";
import { Button } from "../ui/button";

export function ResetProgressButton(params: SetUserStoreParams) {
  const { setProgressMt } = useUserStore();

  return (
    <Button
      disabled={setProgressMt.isPending}
      className="bg-gray-400"
      onClick={() =>
        setProgressMt.mutate({ params, options: { completed: false } })
      }
    >
      {`Reset ${params._tag}`}
    </Button>
  );
}
