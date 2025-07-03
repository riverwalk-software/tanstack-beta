import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

export function AuthorizeYoutubeButton() {
  const { authorizeYoutube, isPending } = useAuthorizeYoutube();
  return <Button>Manage YouTube</Button>;
}

const useAuthorizeYoutube = () => {
  const queryClient = useQueryClient();
  const { mutate: authorizeYoutube, isPending } = useMutation({
    mutationKey: ["authorizeYoutube"],
    mutationFn: () => authClient.signOut(),
  });
  return { authorizeYoutube, isPending };
};
