import { Data } from "effect"

export const redirectDescription = "Redirecting to sign in page..."

interface ClientError {
  _tag: ClientErrorTag
  message: string
  description: string
}

const clientErrorTag = {
  UNAUTHENTICATED: "UNAUTHENTICATED",
  UNAUTHORIZED: "UNAUTHORIZED",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const

type ClientErrorTag = (typeof clientErrorTag)[keyof typeof clientErrorTag]

export class UNAUTHENTICATED extends Data.TaggedError(
  clientErrorTag.UNAUTHENTICATED,
)<ClientError> {
  constructor({
    message,
    description,
  }: { message?: string; description?: string } = {}) {
    super({
      message: message ?? "You are no longer signed in.",
      description: description ?? redirectDescription,
    })
  }
}

export class UNAUTHORIZED extends Data.TaggedError(
  clientErrorTag.UNAUTHORIZED,
)<ClientError> {
  constructor({
    message,
    description,
  }: { message?: string; description?: string } = {}) {
    super({
      message: message ?? "Unauthorized access.",
      description:
        description ?? "You do not have permission to access this resource.",
    })
  }
}
export class SERVICE_UNAVAILABLE extends Data.TaggedError(
  clientErrorTag.SERVICE_UNAVAILABLE,
)<ClientError> {
  constructor({
    message,
    description,
  }: { message?: string; description?: string } = {}) {
    super({
      message: message ?? "This service is currently down.",
      description: description ?? "Please try again later.",
    })
  }
}

export const isClientError = (error: unknown): error is ClientError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "_tag" in error &&
    Object.values(clientErrorTag).includes((error as any)._tag)
  )
}
