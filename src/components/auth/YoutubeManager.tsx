import { useSuspenseQuery } from "@tanstack/react-query";
import { youtubeAuthorizationDataQueryOptions } from "@/utils/oauth/youtube";
import { AuthorizeYoutubeButton } from "./AuthorizeYoutubeButton";

export function YoutubeManager() {
  const {
    youtubeAuthorizationData: { isAuthorized, channelsData },
  } = useYoutubeAuthorization();
  return isAuthorized ? <p>Authorized</p> : <AuthorizeYoutubeButton />;
}

const useYoutubeAuthorization = () => {
  const { data: youtubeAuthorizationData } = useSuspenseQuery(
    youtubeAuthorizationDataQueryOptions,
  );
  return { youtubeAuthorizationData };
};
