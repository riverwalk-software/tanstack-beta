import { type BetterFetchError, createAuthClient } from "better-auth/react";

const { signOut: oldSignOut, ...rest } = createAuthClient({
  fetchOptions: {
    retry: 0,
    throw: true,
    onError: (errorContext) => {
      throw errorContext;
    },
  },
});

export const authClient = {
  ...rest,
  signOut: async () => {
    try {
      await oldSignOut();
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  },
};

type BetterAuthErrorCode = keyof typeof authClient.$ERROR_CODES;
type BetterAuthErrorContext = {
  error: (BetterFetchError & Record<string, any>) & {
    code: BetterAuthErrorCode;
  };
  response: Response;
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
    "code" in errorContext.error &&
    "response" in errorContext &&
    errorContext.response instanceof Response
  );
};
