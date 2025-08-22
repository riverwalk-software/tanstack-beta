import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";

import { type UseFormReturn, useForm } from "react-hook-form";
import z from "zod";
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
import { authenticationDataQueryOptions } from "@/lib/authentication";
import { PASSWORD_LENGTH, SITE_NAME, TEST_USER } from "@/lib/constants";
import { FormButton } from "../primitives/FormButton";

export function SignInWithEmailForm() {
  const form = useForm<SignInForm>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: TEST_USER.email,
      password: TEST_USER.password,
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
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
        queryKey: authenticationDataQueryOptions.queryKey,
      });
      await router.invalidate({ sync: true });
    },
  });
  return { signInWithEmail, isPending };
};

function FormHeader() {
  return (
    <div className="flex flex-col items-center gap-2">
      <GalleryVerticalEnd className="size-8" />
      <h1 className="font-bold text-2xl">{`Sign in to ${SITE_NAME}`}</h1>
      <FormDescription>
        Don&apos;t have an account?{" "}
        <Link className="text-muted-foreground text-sm underline" to="/signup">
          Sign up
        </Link>
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
            <Input type="email" {...field} />
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
          <div className="flex items-center justify-between">
            <FormLabel>Password</FormLabel>
            <Link
              className="text-muted-foreground text-sm underline"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          <FormControl>
            <Input type="password" {...field} />
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
    <FormButton disabled={isPending} className="w-full">
      {isPending ? "Signing in..." : "Sign In"}
    </FormButton>
  );
}

const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(PASSWORD_LENGTH.MINIMUM)
    .max(PASSWORD_LENGTH.MAXIMUM),
  rememberMe: z.boolean(),
});

const SignInFormTransformedSchema = SignInFormSchema.transform(
  (schema) => schema satisfies Parameters<typeof authClient.signIn.email>[0],
);

type SignInForm = z.infer<typeof SignInFormSchema>;
type SignInFormTransformed = z.infer<typeof SignInFormTransformedSchema>;
