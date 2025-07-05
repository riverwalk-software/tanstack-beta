export enum ServerFnErrorCodes {
  UNAUTHENTICATED = "UNAUTHENTICATED",
  YOUTUBE_UNAUTHORIZED = "YOUTUBE_UNAUTHORIZED",
}

type ServerFnErrorCode = keyof typeof ServerFnErrorCodes;

export class ServerFnError extends Error {
  code: ServerFnErrorCode;

  constructor(code: ServerFnErrorCode, message?: string) {
    super(message || code);
    this.name = "ServerFnError";
    this.code = code;
    Object.setPrototypeOf(this, ServerFnError.prototype);
  }
}
