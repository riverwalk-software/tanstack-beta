import { Data, Effect, pipe, Schedule } from "effect";
import { HTTPError } from "ky";
import ms from "ms";
import type { KyHeadersInit } from "node_modules/ky/distribution/types/options";
import { type ZodTypeAny, z } from "zod";
import { httpClient } from "@/lib/httpClient";
import { SITE_URL } from "./constants";
import { s } from "./time";

export function strictParse<T extends ZodTypeAny>(
  schema: T,
  obj: z.input<T>,
): z.infer<T> {
  return schema.parse(obj);
}

export const buildUrl = ({
  base,
  path,
  searchParams,
}: {
  base: string;
  path: string;
  searchParams?: Record<string, string | number | boolean>;
}): URL =>
  new URL(
    searchParams !== undefined
      ? `${path}?${new URLSearchParams(
          Object.fromEntries(
            Object.entries(searchParams).map(([k, v]) => [k, String(v)]),
          ),
        )}`
      : path,
    base,
  );

// export const effectToResponse = <A>({
//   request,
//   program,
// }: {
//   request?: Request;
//   program: Effect.Effect<SuccessResponse<A>, ErrorResponse, never>;
// }): Promise<Response> =>
//   pipe(
//     // checkContentType(request),
//     // Effect.zipRight(program),
//     program,
//     handleDefects,
//     (effect) => handleErrors(effect),
//     Effect.runPromise,
//   );

export const effectToRedirect = <A>({
  request,
  effect,
  path,
}: {
  request: Request;
  effect: Effect.Effect<SuccessResponse<A>, ErrorResponse, never>;
  path: string;
}): Promise<Response> =>
  pipe(
    // checkContentType(request),
    // Effect.zipRight(program),
    effect,
    handleDefects,
    (effect) => handleErrorsForRedirect({ effect, path, code: 302 }),
    Effect.runPromise,
  );

// const checkContentType = (request: Request) =>
//   Either.try({
//     try: () => ContentTypeSchema.parse(request.headers.get("Accept")),
//     catch: (error) => {
//       console.error(error);
//       return new NOT_ACCEPTABLE();
//     },
//   });

const handleDefects = Effect.catchAllDefect((defect) => {
  console.error(defect);
  return Effect.fail(new INTERNAL_SERVER_ERROR());
});

// const handleErrors = <A>(
//   effect: Effect.Effect<SuccessResponse<A>, ErrorResponse, never>,
// ) =>
//   Effect.match(effect, {
//     onFailure: ({ code, message, retryAfter }) =>
//       makeResponse({ code, message, retryAfter, data: null }),
//     onSuccess: ({ code, message, data }) =>
//       makeResponse({ code, message, data }),
//   });

const handleErrorsForRedirect = <A>({
  effect,
  path,
  code,
}: {
  effect: Effect.Effect<SuccessResponse<A>, ErrorResponse, never>;
  path: string;
  code: number;
}) =>
  Effect.match(effect, {
    onFailure: () => makeRedirect({ path, oauthSucceeded: false, code }),
    onSuccess: () => makeRedirect({ path, oauthSucceeded: true, code }),
  });

// const makeResponse = ({
//   code,
//   message,
//   data,
//   retryAfter,
// }: {
//   code: number;
//   message: string;
//   data: unknown;
//   retryAfter?: string;
// }) => {
//   // const headers = {
//   //   "Content-Type": "application/json",
//   //   ...(retryAfter ? { "Retry-After": retryAfter } : {}),
//   // } as z.input<typeof ResponseHeadersSchema>;
//   return new Response(data !== null ? JSON.stringify(data) : null, {
//     status: code,
//     statusText: message,
//     headers: {
//       "content-type": "application/json",
//     },
//   });
// };

const makeRedirect = ({
  path,
  oauthSucceeded,
  code,
}: {
  path: string;
  oauthSucceeded: boolean;
  code: number;
}) => {
  const base = SITE_URL;
  const searchParams = strictParse(OauthSearchParamsSchema, {
    oauthSucceeded: oauthSucceeded ? "true" : "false",
  });
  return Response.redirect(buildUrl({ base, path, searchParams }), code);
};

export const OauthSearchParamsSchema = z
  .object({
    oauthSucceeded: z.enum(["true", "false"]),
  })
  .transform((schema) => ({
    oauthSucceeded: schema.oauthSucceeded === "true",
  }));

const DEFAULT_RETRY_AFTER = s("15s");
const RetryAfterSchema = z.coerce.number().int().positive();
const ContentTypeSchema = z.enum([
  "application/json",
  "application/x-www-form-urlencoded",
]);
const BaseHeadersSchema = z
  .object({
    "content-type": ContentTypeSchema,
    "retry-after": RetryAfterSchema.transform(String),
  })
  .partial();
export const RequestHeadersSchema = BaseHeadersSchema.extend({
  accept: ContentTypeSchema,
  authorization: z.object({
    scheme: z.enum(["Bearer", "Basic"]),
    credentials: z.string(),
  }),
})
  .partial()
  .transform(({ authorization, ...rest }) => ({
    ...rest,
    ...(authorization
      ? {
          authorization: `${authorization.scheme} ${authorization.credentials}`,
        }
      : {}),
  }));
export const ResponseHeadersSchema = BaseHeadersSchema.extend({}).partial();
// export type RequestHeaders = z.infer<typeof RequestHeadersSchema>;
export type ResponseHeaders = z.infer<typeof ResponseHeadersSchema>;

export const concurrent = <
  const Arg extends
    | Iterable<Effect.Effect<any, any, any>>
    | Record<string, Effect.Effect<any, any, any>>,
>(
  arg: Arg,
) => Effect.all(arg, { concurrency: "inherit" });

export const upstream = <T extends ZodTypeAny>({
  body,
  headers,
  method,
  schema,
  url,
}: {
  body?: unknown;
  headers?: KyHeadersInit;
  method: "delete" | "get" | "head" | "patch" | "post" | "put";
  schema: T;
  url: Parameters<typeof httpClient>[0];
}) => {
  const task = Effect.tryPromise({
    try: async () => {
      const response = httpClient(url, {
        method,
        headers,
        ...(body !== undefined ? { json: body } : {}),
      });
      const data = await response.json();
      return strictParse(schema, data);
    },
    catch: (error) => {
      console.error(error);
      if (!(error instanceof HTTPError)) throw new Error("Unknown Error");
      const {
        response: { headers, status },
      } = error;
      if (status === 429 || status === 503) {
        const { data: retryAfter } = RetryAfterSchema.safeParse(
          headers.get("retry-after"),
        );
        return new SERVICE_UNAVAILABLE({
          retryAfter: retryAfter?.toString(),
        });
      }
      if (is5xx(status)) return new BAD_GATEWAY();
      throw new Error("Client Error");
    },
  });
  return Effect.catchTags(task, {
    BAD_GATEWAY: (_) =>
      Effect.retry(task, {
        while: (error) => error instanceof BAD_GATEWAY,
        schedule: Schedule.addDelay(Schedule.recurs(2), (n) =>
          ms(`${100 * 2 ** n}ms`),
        ),
      }),
    SERVICE_UNAVAILABLE: (error) =>
      Effect.gen(function* () {
        const defaultRetryAfter = yield* Effect.succeed(DEFAULT_RETRY_AFTER);
        const ExtendedRetryAfterSchema = RetryAfterSchema.catch(
          defaultRetryAfter,
        )
          .refine((retryAfter) => retryAfter <= defaultRetryAfter, {
            message: "'retry-after' header is too long",
          })
          .transform((retryAfter) => ms(`${retryAfter}s`));
        const retryAfter = yield* Effect.sync(() =>
          ExtendedRetryAfterSchema.parse(error.retryAfter),
        );
        yield* Effect.sleep(retryAfter);
        return yield* Effect.retry(task, {
          times: 1,
        });
      }),
  });
};

const is4xx = (code: number) => code >= 400 && code < 500;
const is5xx = (code: number) => code >= 500 && code < 600;

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
