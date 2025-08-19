import { useSuspenseQuery } from "@tanstack/react-query";
import { getVideoTokenQueryOptions } from "@/utils/video";

export const useVideoToken = (params: { videoId: string }) => {
  const {
    data: { token, expiresAt },
  } = useSuspenseQuery(getVideoTokenQueryOptions(params));

  return { token, expiresAt };
};
