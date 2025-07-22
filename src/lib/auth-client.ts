import type { QueryClient } from "@tanstack/query-core";
import type { useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { deleteCookie } from "@tanstack/react-start/server";
import { type BetterFetchError, createAuthClient } from "better-auth/react";
import { AUTH_COOKIE_NAMES, AUTH_COOKIE_PREFIX } from "@/utils/constants";

const {
  $ERROR_CODES,
  linkSocial,
  sendVerificationEmail,
  signIn,
  signOut: _signOut,
  signUp,
} = createAuthClient({
  fetchOptions: {
    retry: 0,
    throw: true,
    onError: (errorContext) => {
      throw errorContext;
    },
  },
});

const removeAuthCookiesFn = createServerFn({ method: "POST" }).handler(
  async () => {
    AUTH_COOKIE_NAMES.forEach((cookieName) =>
      deleteCookie(`${AUTH_COOKIE_PREFIX}.${cookieName}`),
    );
  },
);

export const authClient = {
  linkSocial,
  sendVerificationEmail,
  signIn,
  signUp,
  signOut: async () => {
    try {
      await _signOut();
    } catch (error) {
      console.error("Error during sign out:", error);
      await removeAuthCookiesFn(); // Does not throw
    }
  },
};

export const afterSignOut = async (
  queryClient: QueryClient,
  router: ReturnType<typeof useRouter>,
): Promise<void> => {
  queryClient.clear();
  await router.invalidate({ sync: true });
};

type BetterAuthErrorCode = keyof typeof $ERROR_CODES;
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
