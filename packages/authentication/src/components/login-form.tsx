import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
} from "@components"
import {
  PRIVACY_POLICY_URL,
  TERMS_OF_USE_URL,
  TEST_USER,
  WEBSITE_NAME,
} from "@constants"
import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import { Unit } from "@prelude"
import { Link } from "@tanstack/react-router"
import { pipe, Schema } from "effect"
import { GalleryVerticalEnd } from "lucide-react"
import {
  EMAIL_REGEX,
  LENGTHS,
  passesEmailStructureChecks,
} from "packages/authentication/src/utils/filters"
import { ComponentProps } from "react"
import { UseFormReturn, useForm } from "react-hook-form"
import { cn } from "@/lib/shadcn"

const FormDataSchema = Schema.Struct({
  email: pipe(
    Schema.String,
    Schema.nonEmptyString({ message: () => "Email is required" }),
    Schema.trimmed({
      message: () => "Email must not have leading or trailing spaces",
    }),
    Schema.minLength(LENGTHS.EMAIL.MINIMUM, {
      message: () =>
        `Email must be at least ${LENGTHS.EMAIL.MINIMUM} characters`,
    }),
    Schema.maxLength(LENGTHS.EMAIL.MAXIMUM, {
      message: () =>
        `Email must be at most ${LENGTHS.EMAIL.MAXIMUM} characters`,
    }),
    Schema.pattern(EMAIL_REGEX, {
      message: () => "Invalid email address",
    }),
    Schema.filter(passesEmailStructureChecks, {
      message: () => "Invalid email address",
    }),
    // Schema.transform(email => {
    //   const [local, domain] = email.split("@")
    //   return `${local}@${domain.toLowerCase()}`
    // }, {}),
  ),
  password: pipe(
    Schema.NonEmptyString,
    Schema.minLength(LENGTHS.PASSWORD.MINIMUM),
    Schema.maxLength(LENGTHS.PASSWORD.MAXIMUM),
    // (Optional) add a strength check or a zxcvbn-style estimator server-side
  ),
  rememberMe: Schema.Boolean,
})
type FormData = typeof FormDataSchema.Type

export default function LoginForm({
  className,
  ...props
}: ComponentProps<"div">) {
  const form = useForm<FormData>({
    resolver: effectTsResolver(FormDataSchema),
    defaultValues: {
      email: TEST_USER.email,
      password: TEST_USER.password,
      rememberMe: false,
    },
  })
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <FormHeader />
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <EmailInput form={form} />
                <PasswordInput form={form} />
                <RememberMeSwitch form={form} />
              </div>
              <LoginButton />
            </div>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                Or
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AppleLoginButton />
              <GoogleLoginButton />
            </div>
          </div>
        </form>
        <FormFooter />
      </Form>
    </div>
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
          <div className="flex items-center justify-between">
            <FormLabel>Password</FormLabel>
            <Link className="underline underline-offset-4 text-sm" to="/">
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
  )
}

function RememberMeSwitch({ form }: { form: UseFormReturn<FormData> }) {
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
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a className="underline underline-offset-4" href="#">
          Sign up
        </a>
      </div>
    </div>
  )
}

function LoginButton() {
  return (
    <Button className="w-full" type="submit">
      Login
    </Button>
  )
}

const onSubmit = (data: FormData): Unit => {
  // const queryClient = useQueryClient()
  // const router = useRouter()
  // const { mutate: signInWithEmail, isPending } = useMutation({
  //   mutationKey: ["signInWithEmail"],
  //   mutationFn: (formData: SignInFormTransformed) =>
  //     authClient.signIn.email(formData),
  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries({
  //       queryKey: authenticationDataQueryOptions.queryKey,
  //     })
  //     await router.invalidate({ sync: true })
  //   },
  // })
}

function AppleLoginButton() {
  return (
    <Button className="w-full" type="button" variant="outline">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
          fill="currentColor"
        />
      </svg>
      Continue with Apple
    </Button>
  )
}

function GoogleLoginButton() {
  return (
    <Button className="w-full" type="button" variant="outline">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          fill="currentColor"
        />
      </svg>
      Continue with Google
    </Button>
  )
}

function FormFooter() {
  return (
    <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
      By clicking continue, you agree to our{" "}
      <a href={TERMS_OF_USE_URL} target="_blank">
        Terms of Use
      </a>{" "}
      and{" "}
      <a href={PRIVACY_POLICY_URL} target="_blank">
        Privacy Policy
      </a>
      .
    </div>
  )
}
