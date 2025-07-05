import { type BetterFetchError, createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  fetchOptions: {
    retry: 0,
    throw: true,
  },
});

type BetterAuthErrorCode = keyof typeof authClient.$ERROR_CODES;
type BetterAuthErrorContext = {
  error: (BetterFetchError & Record<string, any>) & {
    code: BetterAuthErrorCode;
  };
};
export const isBetterAuthErrorContext = (
  errorContext: unknown,
): errorContext is BetterAuthErrorContext => {
  return (
    errorContext !== null &&
    typeof errorContext === "object" &&
    "error" in errorContext &&
    typeof errorContext.error === "object" &&
    errorContext.error !== null &&
    "code" in errorContext.error
  );
};
