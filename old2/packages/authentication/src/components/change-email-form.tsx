import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@components"
import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { pipe, Schema } from "effect"
import { authenticationDataQueryOptions } from "packages/authentication/src/utils/authentication"
import {
  EMAIL_REGEX,
  LENGTHS,
  passesEmailStructureChecks,
} from "packages/authentication/src/utils/filters"
import { ComponentProps } from "react"
import { UseFormReturn, useForm } from "react-hook-form"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
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
})
type FormData = typeof FormDataSchema.Type

export default function ChangeEmailForm({
  className,
  ...props
}: ComponentProps<"div">) {
  const form = useForm<FormData>({
    resolver: effectTsResolver(FormDataSchema),
    defaultValues: {
      email: "",
    },
  })
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutate: changeEmail } = useMutation({
    mutationKey: ["changeEmail"],
    mutationFn: async (data: FormData) => {
      const result = await authClient.changeEmail({
        newEmail: data.email,
      })
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result
    },
    onError: error => {
      toast.error(error.message || "Failed to sign in")
    },
    onSuccess: async () => {
      toast.success("Email changed successfully")
      await queryClient.invalidateQueries({
        queryKey: authenticationDataQueryOptions.queryKey,
      })
      await router.invalidate({ sync: true })
    },
  })
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(data => changeEmail(data))}>
          <div className="flex flex-col gap-6">
            {/* <FormHeader /> */}
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <EmailInput form={form} />
              </div>
              <ChangeEmailButton />
            </div>
          </div>
        </form>
        {/* <FormFooter /> */}
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
          <FormLabel>New Email</FormLabel>
          <FormControl>
            <Input type="email" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function ChangeEmailButton() {
  return (
    <Button className="w-full" type="submit">
      Change Email
    </Button>
  )
}
