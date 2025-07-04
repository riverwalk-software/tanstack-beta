import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { type UseFormReturn, useForm } from "react-hook-form";
import z from "zod";
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
import { authClient } from "@/lib/auth-client";
import { authenticationQueryOptions } from "@/utils/authentication";
import {
  MAXIMUM_PASSWORD_LENGTH,
  MINIMUM_PASSWORD_LENGTH,
  type RouteType,
} from "@/utils/constants";

export function SignInWithEmailForm() {
  const form = useForm<SignInForm>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "andrei@riverwalk.dev",
      password: "passwordpassword",
      rememberMe: false,
    },
  });
  const { signInWithEmail, isPending } = useSignInWithEmail();
  const onSubmit = (values: SignInForm) => {
    const formData = SignInFormTransformedSchema.parse(values);
    signInWithEmail(formData);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormHeader />
        <FormEmail form={form} />
        <FormPassword form={form} />
        <FormRememberMe form={form} />
        <FormSubmitButton isPending={isPending} />
      </form>
    </Form>
  );
}

const useSignInWithEmail = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: signInWithEmail, isPending } = useMutation({
    mutationKey: ["signInWithEmail"],
    mutationFn: (formData: SignInFormTransformed) =>
      authClient.signIn.email(formData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authenticationQueryOptions.queryKey,
      });
      await router.invalidate({ sync: true });
    },
  });
  return { signInWithEmail, isPending };
};

function FormHeader() {
  return (
    <div className="space-y-2">
      <h1 className="font-bold text-2xl">Sign In</h1>
      <FormDescription>
        Enter your email below to sign in to your account
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

const forgotPasswordHref: RouteType = "/forgot-password";
function FormPassword({ form }: { form: UseFormReturn<SignInForm> }) {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Password</FormLabel>
            <a
              href={forgotPasswordHref}
              className="text-muted-foreground text-sm underline"
              tabIndex={0}
            >
              Forgot password?
            </a>
          </div>
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

function FormSubmitButton({ isPending }: { isPending: boolean }) {
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
  (schema) => ({ ...schema }) as Parameters<typeof authClient.signIn.email>[0],
);

type SignInForm = z.infer<typeof SignInFormSchema>;
type SignInFormTransformed = z.infer<typeof SignInFormTransformedSchema>;
