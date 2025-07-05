import { useSuspenseQuery } from "@tanstack/react-query";
import { youtubeAuthorizationQueryOptions } from "@/utils/oauth/youtube";
import { AuthorizeYoutubeButton } from "./AuthorizeYoutubeButton";

export function YoutubeManager() {
  const { isYoutubeAuthorized } = useGetYoutubeAuthorization();
  return isYoutubeAuthorized ? <p>Authorized</p> : <AuthorizeYoutubeButton />;
}

const useGetYoutubeAuthorization = () => {
  const { data: isYoutubeAuthorized } = useSuspenseQuery(
    youtubeAuthorizationQueryOptions,
  );
  return { isYoutubeAuthorized };
};
