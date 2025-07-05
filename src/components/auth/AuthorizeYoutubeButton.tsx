import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { AUTH_CALLBACK_ROUTE } from "@/utils/constants";
import { youtubeScopes } from "@/utils/oauth/google";
import { youtubeAuthorizationQueryOptions } from "@/utils/oauth/youtube";
import { Button } from "../ui/button";

export function AuthorizeYoutubeButton() {
  const { authorizeYoutube, isPending } = useAuthorizeYoutube();
  return (
    <Button disabled={isPending} onClick={() => authorizeYoutube()}>
      Manage YouTube
    </Button>
  );
}

const useAuthorizeYoutube = () => {
  const queryClient = useQueryClient();
  const { mutate: authorizeYoutube, isPending } = useMutation({
    mutationKey: ["authorizeYoutube"],
    mutationFn: () =>
      authClient.linkSocial({
        provider: "google",
        scopes: youtubeScopes,
        callbackURL: AUTH_CALLBACK_ROUTE,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: youtubeAuthorizationQueryOptions.queryKey,
      });
    },
  });
  return { authorizeYoutube, isPending };
};
