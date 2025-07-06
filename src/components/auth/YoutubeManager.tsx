import { useSuspenseQuery } from "@tanstack/react-query";
import { youtubeAuthorizationDataQueryOptions } from "@/utils/oauth/youtube";
import { AuthorizeYoutubeButton } from "./AuthorizeYoutubeButton";

export function YoutubeManager() {
  const {
    youtubeAuthorizationData: { isAuthorized, channelsData },
  } = useYoutubeAuthorizationData();
  return !isAuthorized ? (
    <AuthorizeYoutubeButton />
  ) : (
    <div>
      <h3>Authorized Channels</h3>
      <ul>
        {channelsData &&
          (channelsData.channelCount === "zero" ? (
            <li>No channels authorized</li>
          ) : channelsData.channelCount === "one" ? (
            <li>
              {channelsData.channels.snippet.title} ({channelsData.channels.id})
            </li>
          ) : (
            channelsData.channels.map((channel) => (
              <li key={channel.id}>
                {channel.snippet.title} ({channel.id})
              </li>
            ))
          ))}
      </ul>
    </div>
  );
}

const useYoutubeAuthorizationData = () => {
  const { data: youtubeAuthorizationData } = useSuspenseQuery(
    youtubeAuthorizationDataQueryOptions,
  );
  return { youtubeAuthorizationData };
};
