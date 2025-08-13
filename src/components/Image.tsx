import type React from "react";
import { cn } from "@/lib/utils";

type ImageProps = React.ComponentProps<"img"> & Image;
interface Image {
  src: string;
  alt: string;
}

export function Image({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("max-h-full max-w-full object-contain", className)}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
}
