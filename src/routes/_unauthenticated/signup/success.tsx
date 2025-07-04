import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import z from "zod";
import { verifyEmailQueryKey } from "@/components/auth/SignUpWithEmailForm";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { AUTH_CALLBACK_ROUTE } from "@/utils/constants";
import { useCountdown } from "@/utils/hooks";
import { s, ttlSToMs } from "@/utils/time";

const VerifyEmailSchema = z.string().email();
const resendVerificationEmailDurationS = s("30s");
export const resendVerificationEmailDurationMs = ttlSToMs(
  resendVerificationEmailDurationS,
);

export const Route = createFileRoute("/_unauthenticated/signup/success")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const unknown = queryClient.getQueryData(verifyEmailQueryKey);
    console.log(`$VALUE: ${unknown}`);
    const { data: email, success } = VerifyEmailSchema.safeParse(unknown);
    console.log(`DATA: ${email}`);
    if (!success) throw redirect({ to: "/signup" });
    return { email };
  },
  loader: async ({ context: { email } }) => {
    return { email };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { email } = Route.useLoaderData();
  const { resendVerificationEmail } = useResendVerificationEmail({ email });
  const { count, isPending, restartCountdown } =
    useResendVerificationEmailCountdown();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        disabled={isPending}
        onClick={() => {
          resendVerificationEmail();
          restartCountdown();
        }}
      >
        {isPending
          ? `Time before another verification email can be sent: ${count}`
          : "Resend Verification Email"}
      </Button>
    </div>
  );
}

export const useResendVerificationEmail = ({ email }: { email: string }) => {
  const { mutate: resendVerificationEmail } = useMutation({
    mutationKey: ["resendVerificationEmail"],
    mutationFn: () =>
      authClient.sendVerificationEmail({
        email,
        callbackURL: AUTH_CALLBACK_ROUTE,
      }),
    onSuccess: () =>
      toast.success("Verification email sent!", {
        description: "Please check your inbox.",
        duration: resendVerificationEmailDurationMs,
      }),
  });
  return { resendVerificationEmail };
};

function useResendVerificationEmailCountdown() {
  const { count, startCountdown, restartCountdown, isFinished } = useCountdown({
    countStart: resendVerificationEmailDurationS,
  });
  useEffect(() => {
    startCountdown();
  }, [startCountdown]);
  const isPending = !isFinished;
  return { count, restartCountdown, isPending };
}
