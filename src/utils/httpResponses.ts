import { Data } from "effect";

export type SuccessResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export type ErrorResponse = {
  code: number;
  message: string;
  retryAfter?: string;
};

export type HttpResponse<T> = SuccessResponse<T> | ErrorResponse;

export class OK<T = unknown> extends Data.TaggedError("OK")<
  SuccessResponse<T>
> {
  constructor(args: { data: T; message?: string }) {
    super({
      code: 200,
      message: args?.message ?? "The request has succeeded.",
      data: args.data,
    });
  }
}

export class CREATED extends Data.TaggedError("CREATED")<
  SuccessResponse<null>
> {
  constructor(args?: { message?: string }) {
    super({
      code: 201,
      message:
        args?.message ??
        "The request has succeeded and a new resource has been created.",
      data: null,
    });
  }
}

export class ACCEPTED extends Data.TaggedError("ACCEPTED")<
  SuccessResponse<null>
> {
  constructor(args?: { message?: string }) {
    super({
      code: 202,
      message:
        args?.message ??
        "The request has been accepted for processing, but the processing has not been completed.",
      data: null,
    });
  }
}

export class NO_CONTENT extends Data.TaggedError("NO_CONTENT")<
  SuccessResponse<null>
> {
  constructor(args?: { message?: string }) {
    super({
      code: 204,
      message:
        args?.message ??
        "The server successfully processed the request and is not returning any content.",
      data: null,
    });
  }
}

export class BAD_REQUEST extends Data.TaggedError(
  "BAD_REQUEST",
)<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 400,
      message: args?.message ?? "The client sent invalid input.",
    });
  }
}

// export class MISSING_HEADER extends Data.TaggedError(
//   "MISSING_HEADER",
// )<ErrorResponse> {
//   constructor(args?: { message?: string }) {
//     super({
//       code: 400,
//       message: args?.message ?? "The request is missing a required header.",
//     });
//   }
// }

export class UNAUTHENTICATED extends Data.TaggedError(
  "UNAUTHENTICATED",
)<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 401,
      message:
        args?.message ?? "The client lacks valid authentication credentials.",
    });
  }
}

export class UNAUTHORIZED extends Data.TaggedError(
  "UNAUTHORIZED",
)<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 403,
      message:
        args?.message ?? "The client is not authorized to access a resource.",
    });
  }
}

export class NOT_FOUND extends Data.TaggedError("NOT_FOUND")<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 404,
      message:
        args?.message ?? "The server cannot find the requested resource.",
    });
  }
}

export class METHOD_NOT_SUPPORTED extends Data.TaggedError(
  "METHOD_NOT_SUPPORTED",
)<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 405,
      message:
        args?.message ?? "The server does not support the requested method.",
    });
  }
}

export class NOT_ACCEPTABLE extends Data.TaggedError(
  "NOT_ACCEPTABLE",
)<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 406,
      message:
        args?.message ??
        "The server cannot produce a response matching the list of acceptable values.",
    });
  }
}

export class TIMEOUT extends Data.TaggedError("TIMEOUT")<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 408,
      message:
        args?.message ?? "The server timed out while processing the request.",
    });
  }
}

export class CONFLICT extends Data.TaggedError("CONFLICT")<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 409,
      message:
        args?.message ??
        "The server cannot update a resource due to a conflict.",
    });
  }
}

export class PRECONDITION_FAILED extends Data.TaggedError(
  "PRECONDITION_FAILED",
)<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 412,
      message:
        args?.message ??
        "The server does not meet a precondition of the request.",
    });
  }
}

export class PAYLOAD_TOO_LARGE extends Data.TaggedError(
  "PAYLOAD_TOO_LARGE",
)<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 413,
      message:
        args?.message ??
        "The server cannot process the request because the payload is too large.",
    });
  }
}

export class UNSUPPORTED_MEDIA_TYPE extends Data.TaggedError(
  "UNSUPPORTED_MEDIA_TYPE",
)<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 415,
      message:
        args?.message ??
        "The server does not support the request's media type.",
    });
  }
}

export class UNPROCESSABLE_CONTENT extends Data.TaggedError(
  "UNPROCESSABLE_CONTENT",
)<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 422,
      message:
        args?.message ??
        "The server cannot process the request due to semantic errors.",
    });
  }
}

export class TOO_MANY_REQUESTS extends Data.TaggedError(
  "TOO_MANY_REQUESTS",
)<ErrorResponse> {
  constructor(args?: { message?: string; retryAfter?: string }) {
    super({
      code: 429,
      message:
        args?.message ?? "The server has exceeded a specified rate limit.",
      retryAfter: args?.retryAfter,
    });
  }
}

export class CLIENT_CLOSED_REQUEST extends Data.TaggedError(
  "CLIENT_CLOSED_REQUEST",
)<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 499,
      message:
        args?.message ??
        "The client closed the request before the server could respond.",
    });
  }
}

export class INTERNAL_SERVER_ERROR extends Data.TaggedError(
  "INTERNAL_SERVER_ERROR",
)<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 500,
      message: args?.message ?? "The server failed unexpectedly.",
    });
  }
}

export class NOT_IMPLEMENTED extends Data.TaggedError(
  "NOT_IMPLEMENTED",
)<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 501,
      message:
        args?.message ?? "The server does not support the requested feature.",
    });
  }
}

export class BAD_GATEWAY extends Data.TaggedError(
  "BAD_GATEWAY",
)<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 502,
      message:
        args?.message ??
        "The server received an invalid response from an upstream server.",
    });
  }
}

export class SERVICE_UNAVAILABLE extends Data.TaggedError(
  "SERVICE_UNAVAILABLE",
)<ErrorResponse> {
  constructor(args?: { message?: string; retryAfter?: string }) {
    super({
      code: 503,
      message: args?.message ?? "The server is temporarily unavailable.",
      retryAfter: args?.retryAfter,
    });
  }
}

export class GATEWAY_TIMEOUT extends Data.TaggedError(
  "GATEWAY_TIMEOUT",
)<ErrorResponse> {
  constructor(args?: { message?: string }) {
    super({
      code: 504,
      message:
        args?.message ??
        "The server received a timeout from an upstream server.",
    });
  }
}
