export enum ServerFnErrorCodes {
  UNAUTHENTICATED = "UNAUTHENTICATED",
  YOUTUBE_UNAUTHORIZED = "YOUTUBE_UNAUTHORIZED",
}

export type ServerFnErrorCode = keyof typeof ServerFnErrorCodes;
