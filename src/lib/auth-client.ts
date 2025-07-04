import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";
import { match } from "ts-pattern";

export const authClient = createAuthClient({
  fetchOptions: {
    retry: 0,
    throw: true,
    onError: ({ error }) => {
      match(error.code as BetterAuthErrorCode)
        .with("EMAIL_NOT_VERIFIED", () =>
          alert(`Email not verified.

An email has been sent to verify your account.
Please check your inbox and click the verification link.

If you don't see the email, check your spam folder.`),
        )
        .otherwise(() => toast.error(error.message));
    },
  },
});

type BetterAuthErrorCode = keyof typeof authClient.$ERROR_CODES;
