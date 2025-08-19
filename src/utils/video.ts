import crypto from "node:crypto";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import ms from "ms";
import { environment } from "./environment";
import { s, ttlToExpiresAt } from "./time";

// TODO: Should I add auth middleware???

const getVideoTokenFn = createServerFn()
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

const ttl = s("15m");
export const getVideoTokenQueryOptions = ({ videoId }: { videoId: string }) =>
  queryOptions({
    queryKey: ["videoToken", videoId],
    queryFn: () => getVideoTokenFn({ data: { videoId, ttl } }),
    staleTime: ms(`${ttl}s`),
  });

// const getVideoFn = createServerFn()
//   .validator((data: { videoId: string }) => data)
//   .middleware([getEnvironmentMw])
//   .handler(async ({ context: { environment }, data: { videoId } }) => {

//     const { BUNNY_TOKEN_API_KEY } = environment.secrets;
//     const bunnyApiClient = createBunnyApiClient({
//   accessKey: process.env.BUNNY_ACCESS_KEY!,
// });
// const countries = await bunnyApiClient.videolibrary.get()
//     const options = {
//       method: "GET",
//       headers: {
//         accept: "application/json",
//         AccessKey: BUNNY_TOKEN_API_KEY,
//       },
//     };
//     const unknownVideo = await fetch(
//       "https://video.bunnycdn.com/library/478043/videos/90c4d864-aa2c-4ead-8526-65368d37fc3d",
//       options,
//     )
//       .then((res) => res.json())
//       .catch(() => {
//         throw new SERVICE_UNAVAILABLE();
//       });
//   });
// export const getVideoQueryOptions = ({ videoId }: { videoId: string }) =>
//   queryOptions({
//     queryKey: ["video", videoId],
//     queryFn: () => getVideoFn({ videoId }),
//     staleTime: Infinity,
//     gcTime: Infinity,
//     subscribed: false,
//   });
