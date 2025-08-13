import crypto from "node:crypto";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import ms from "ms";
import { environment } from "@/utils/environment";
import { s, ttlToExpiresAt } from "@/utils/time";

const ttl = s("15m");
export function VideoPlayer({ videoId }: Params) {
  const {
    data: { token, expiresAt },
  } = useSuspenseQuery({
    queryKey: ["bunnyToken", videoId],
    queryFn: () => getTokenFn({ data: { videoId, ttl } }),
    staleTime: ms(`${ttl}s`),
  });
  return (
    <iframe
      src={`https://iframe.mediadelivery.net/embed/478043/${videoId}?token=${token}&expires=${expiresAt}`}
      loading="lazy"
      title="Embedded video player"
      className="absolute top-0 left-0 h-full w-full border-none"
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
      allowFullScreen={true}
    ></iframe>
  );
}

interface Params {
  videoId: string;
}

const getTokenFn = createServerFn()
  .validator((data: { videoId: string; ttl: number }) => data)
  .handler(async ({ data: { videoId, ttl } }) => {
    const { BUNNY_TOKEN_API_KEY } = environment.secrets;
    const expiresAt = ttlToExpiresAt(ttl);
    const payload = BUNNY_TOKEN_API_KEY + videoId + expiresAt;
    const token = crypto
      .createHash("sha256")
      .update(payload, "utf8")
      .digest("hex");
    return { token, expiresAt };
  });
