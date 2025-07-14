import { Data } from "effect";

export const redirectDescription = "Redirecting to sign in page...";

interface ClientError {
  _tag: string;
  message: string;
  description: string;
}

export class UNAUTHENTICATED extends Data.TaggedError(
  "UNAUTHENTICATED",
)<ClientError> {
  constructor({
    message,
    description,
  }: { message?: string; description?: string } = {}) {
    super({
      message: message ?? "You are no longer signed in.",
      description: description ?? redirectDescription,
    });
  }
}
export class YOUTUBE_UNAUTHORIZED extends Data.TaggedError(
  "YOUTUBE_UNAUTHORIZED",
)<ClientError> {
  constructor({
    message,
    description,
  }: { message?: string; description?: string } = {}) {
    super({
      message: message ?? "YouTube API access is unauthorized.",
      description: description ?? "Please reauthorize your YouTube account.",
    });
  }
}
export class SERVICE_UNAVAILABLE extends Data.TaggedError(
  "SERVICE_UNAVAILABLE",
)<ClientError> {
  constructor({
    message,
    description,
  }: { message?: string; description?: string } = {}) {
    super({
      message: message ?? "This service is currently down.",
      description: description ?? "Please try again later.",
    });
  }
}

export const isClientError = (error: unknown): error is ClientError => {
  return (
    error instanceof UNAUTHENTICATED ||
    error instanceof YOUTUBE_UNAUTHORIZED ||
    error instanceof SERVICE_UNAVAILABLE
  );
};
