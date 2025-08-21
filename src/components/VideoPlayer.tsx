import { useVideoToken } from "@/lib/video";

export function VideoPlayer({ videoId }: { videoId: string }) {
  const { token, expiresAt } = useVideoToken({ videoId });
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
