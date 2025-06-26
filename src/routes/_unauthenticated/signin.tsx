import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { type UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CenteredContainer } from "@/containers/CenteredContainer";
import { authClient } from "@/lib/auth-client";
import { authenticationQueryOptions } from "@/utils/authentication";
import {
  MAXIMUM_PASSWORD_LENGTH,
  MINIMUM_PASSWORD_LENGTH,
} from "@/utils/constants";

export const Route = createFileRoute("/_unauthenticated/signin")({
  component: SignIn,
});

const isPendingAtom = atom(false);

function SignIn() {
  return (
    <CenteredContainer>
      <MyForm />
    </CenteredContainer>
  );
}

function MyForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<SignInForm>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const setIsPending = useSetAtom(isPendingAtom);
  const onSubmit = async (values: SignInForm) => {
    const formData = SignInFormTransformedSchema.parse(values);
    await authClient.signIn.email(formData, {
      onRequest: () => setIsPending(true),
      onError: ({ error: { message } }) => {
        toast.error(message);
        setIsPending(false);
      },
      onSuccess: async () => {
        toast.success("Sign in successful!");
        await queryClient.invalidateQueries({
          queryKey: authenticationQueryOptions.queryKey,
        });
        await router.invalidate({ sync: true });
      },
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormHeader />
        <FormEmail form={form} />
        <FormPassword form={form} />
        <FormRememberMe form={form} />
        <FormSubmitButton />
      </form>
    </Form>
  );
}
function FormHeader() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <FormDescription>
        Enter your email below to login to your account
      </FormDescription>
    </div>
  );
}

function FormEmail({ form }: { form: UseFormReturn<SignInForm> }) {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="you@example.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FormPassword({ form }: { form: UseFormReturn<SignInForm> }) {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input type="password" placeholder="Password" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FormRememberMe({ form }: { form: UseFormReturn<SignInForm> }) {
  return (
    <FormField
      control={form.control}
      name="rememberMe"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Remember Me</FormLabel>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

function FormSubmitButton() {
  const isPending = useAtomValue(isPendingAtom);
  return (
    <Button disabled={isPending} className="w-full">
      {isPending ? "Signing in..." : "Sign In"}
    </Button>
  );
}

const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(
      MINIMUM_PASSWORD_LENGTH,
      `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters long`,
    )
    .max(
      MAXIMUM_PASSWORD_LENGTH,
      `Password must be at most ${MAXIMUM_PASSWORD_LENGTH} characters long`,
    ),
  rememberMe: z.boolean(),
});

const SignInFormTransformedSchema = SignInFormSchema.transform(
  (schema) => schema as Parameters<typeof authClient.signIn.email>[0],
);

type SignInForm = z.infer<typeof SignInFormSchema>;
