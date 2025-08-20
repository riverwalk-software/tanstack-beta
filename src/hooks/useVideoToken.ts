import { useSuspenseQuery } from "@tanstack/react-query";
import { getVideoTokenQueryOptions } from "@/lib/video";

export const useVideoToken = (params: { videoId: string }): Return => {
  const { data } = useSuspenseQuery(getVideoTokenQueryOptions(params));

  return { ...data };
};

interface Return {
  token: string;
  expiresAt: number;
}
