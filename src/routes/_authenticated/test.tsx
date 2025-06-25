import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getSessionDataFn } from "@/utils/authentication";

export const Route = createFileRoute("/_authenticated/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const [id, setId] = useState("None");
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Authentication Middleware Test</h2>
      <p className="text-sm text-gray-600">
        This tests automatic redirect when accessing protected server functions
      </p>
      <Button
        onClick={async () => {
          try {
            const {
              session: { id },
            } = await getSessionDataFn();
            setId(id);
          } catch (error) {
            if (error) {
              await router.invalidate({ sync: true });
            }
          }
        }}
      ></Button>

      <p>
        <span className="font-semibold">Session ID: </span>
        {id}
      </p>

      <div className="text-xs text-gray-500 space-y-1">
        <p>• If logged in: Should display session ID</p>
        <p>• If not logged in: Should redirect to /signin automatically</p>
      </div>
    </div>
  );
}
