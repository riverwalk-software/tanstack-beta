import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import {
  Button,
  cn,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@repo/platform-ui"
import {
  PRIVACY_POLICY_URL,
  TERMS_OF_USE_URL,
  WEBSITE_NAME,
} from "@repo/shared-constants"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { Schema } from "effect"
import { GalleryVerticalEnd } from "lucide-react"
import type { ComponentProps } from "react"
import { type UseFormReturn, useForm } from "react-hook-form"
import { toast } from "sonner"
import { TEST_USER } from "#constants.js"
import { authClient } from "#lib/auth-client.js"
import { queryKey } from "#query-options.js"
import { Email, FirstName, LastName, Password } from "#schemas.js"

class FormData extends Schema.Class<FormData>("FormData")({
  firstName: FirstName,
  lastName: LastName,
  email: Email,
  password: Password,
  confirmPassword: Password,
}) {}

function SignUpForm({ className, ...props }: ComponentProps<"div">) {
  const form = useForm<FormData>({
    resolver: effectTsResolver(FormData),
    defaultValues: {
      firstName: TEST_USER.firstName,
      lastName: TEST_USER.lastName,
      email: TEST_USER.email,
      password: TEST_USER.password,
      confirmPassword: "hello",
    },
  })
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutate: SignUpWithEmail } = useMutation({
    mutationKey: ["SignUpWithEmail"],
    mutationFn: async (data: FormData) => {
      const result = await authClient.signUp.email({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
      })
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result
    },
    onError: error => {
      toast.error(error.message || "Failed to sign up")
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey,
      })
      await router.invalidate({ sync: true })
    },
  })
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(data => {
            // Check password confirmation before submitting
            if (data.password !== data.confirmPassword) {
              form.setError("confirmPassword", {
                type: "manual",
                message: "Passwords do not match",
              })
              return
            }
            SignUpWithEmail(data)
          })}
        >
          <div className="flex flex-col gap-6">
            <FormHeader />
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <FirstNameInput form={form} />
                <LastNameInput form={form} />
                <EmailInput form={form} />
                <PasswordInput form={form} />
                <ConfirmPasswordInput form={form} />
              </div>
              <SignUpButton />
            </div>
          </div>
        </form>
        <FormFooter />
      </Form>
    </div>
  )
}

function FirstNameInput({ form }: { form: UseFormReturn<FormData> }) {
  return (
    <FormField
      control={form.control}
      name="firstName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>First Name</FormLabel>
          <FormControl>
            <Input type="text" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
function LastNameInput({ form }: { form: UseFormReturn<FormData> }) {
  return (
    <FormField
      control={form.control}
      name="lastName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Last Name</FormLabel>
          <FormControl>
            <Input type="text" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function EmailInput({ form }: { form: UseFormReturn<FormData> }) {
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
  )
}

function PasswordInput({ form }: { form: UseFormReturn<FormData> }) {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          {/* <div className="flex items-center justify-between"> */}
          <FormLabel>Password</FormLabel>
          {/* <Link className="underline underline-offset-4 text-sm" to="/">
              Forgot password?
            </Link> */}
          {/* </div> */}
          <FormControl>
            <Input type="password" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function ConfirmPasswordInput({ form }: { form: UseFormReturn<FormData> }) {
  return (
    <FormField
      control={form.control}
      name="confirmPassword"
      render={({ field }) => (
        <FormItem>
          {/* <div className="flex items-center justify-between"> */}
          <FormLabel>Confirm Password</FormLabel>
          {/* <Link className="underline underline-offset-4 text-sm" to="/">
              Forgot password?
            </Link> */}
          {/* </div> */}
          <FormControl>
            <Input type="password" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function FormHeader() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col items-center gap-2 font-medium">
        <div className="flex size-8 items-center justify-center rounded-md">
          <GalleryVerticalEnd className="size-6" />
        </div>
        <span className="sr-only">{WEBSITE_NAME}</span>
      </div>
      <h1 className="text-xl font-bold">Welcome to {WEBSITE_NAME}</h1>
      {/* <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a className="underline underline-offset-4" href="#">
          Sign up
        </a>
      </div> */}
    </div>
  )
}

function SignUpButton() {
  return (
    <Button className="w-full" type="submit">
      Sign Up
    </Button>
  )
}

function FormFooter() {
  return (
    <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
      By clicking continue, you agree to our{" "}
      <a href={TERMS_OF_USE_URL} rel="noreferrer" target="_blank">
        Terms of Use
      </a>{" "}
      and{" "}
      <a href={PRIVACY_POLICY_URL} rel="noreferrer" target="_blank">
        Privacy Policy
      </a>
      .
    </div>
  )
}

export { SignUpForm }
