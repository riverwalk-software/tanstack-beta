import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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
import { CenteredContainer } from "@/containers/CenteredContainer";
import { authClient } from "@/lib/auth-client";
import {
  MAXIMUM_PASSWORD_LENGTH,
  MINIMUM_PASSWORD_LENGTH,
} from "@/utils/constants";

export const Route = createFileRoute("/_unauthenticated/signup")({
  component: SignUp,
});

const emailAtom = atom("");
function SignUp() {
  const email = useAtomValue(emailAtom);
  return (
    <CenteredContainer>
      {email ? (
        <div className="flex flex-col items-center gap-4">
          <p>Check your email</p>
          {/* <ResendVerificationButton email={email} /> */}
        </div>
      ) : (
        <MyForm />
      )}
      <MyForm />
    </CenteredContainer>
  );
}

function MyForm() {
  const form = useForm<SignUpForm>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { mutate: signUp, isPending } = useSignUp();
  const onSubmit = async (values: SignUpForm) => {
    const formData = SignUpFormTransformedSchema.parse(values);
    signUp(formData);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormHeader />
        <div className="flex gap-4">
          <div className="flex-1">
            <FormFirstName form={form} />
          </div>
          <div className="flex-1">
            <FormLastName form={form} />
          </div>
        </div>
        <FormEmail form={form} />
        <FormPassword form={form} />
        <FormConfirmPassword form={form} />
        <FormSubmitButton isPending={isPending} />
      </form>
    </Form>
  );
}

const useSignUp = () => {
  const setEmail = useSetAtom(emailAtom);
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: (formData: SignUpFormTransformed) =>
      authClient.signUp.email(formData),
    onError: () =>
      toast.error("Failed to sign up.", {
        description: "Please try again later.",
      }),
    onSuccess: (_data, { email }) => {
      setEmail(email);
    },
  });
};

function FormHeader() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <FormDescription>
        Enter your information to create an account
      </FormDescription>
    </div>
  );
}

function FormFirstName({ form }: { form: UseFormReturn<SignUpForm> }) {
  return (
    <FormField
      control={form.control}
      name="firstName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>First Name</FormLabel>
          <FormControl>
            <Input type="text" placeholder="First Name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FormLastName({ form }: { form: UseFormReturn<SignUpForm> }) {
  return (
    <FormField
      control={form.control}
      name="lastName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Last Name</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Last Name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FormEmail({ form }: { form: UseFormReturn<SignUpForm> }) {
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

function FormPassword({ form }: { form: UseFormReturn<SignUpForm> }) {
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

function FormConfirmPassword({ form }: { form: UseFormReturn<SignUpForm> }) {
  return (
    <FormField
      control={form.control}
      name="confirmPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Confirm Password</FormLabel>
          <FormControl>
            <Input type="password" placeholder="Confirm Password" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FormSubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button disabled={isPending} className="w-full">
      {isPending ? "Signing Up..." : "Sign Up"}
    </Button>
  );
}

const SignUpFormSchema = z
  .object({
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
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
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const SignUpFormTransformedSchema = SignUpFormSchema.transform(
  ({ confirmPassword, firstName, lastName, ...rest }) =>
    ({
      ...rest,
      name: `${firstName} ${lastName}`,
    }) as Parameters<typeof authClient.signUp.email>[0],
);

type SignUpForm = z.infer<typeof SignUpFormSchema>;
type SignUpFormTransformed = z.infer<typeof SignUpFormTransformedSchema>;
