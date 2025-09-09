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
import { LENGTHS } from "packages/authentication/src/utils/filters"
import { ComponentProps } from "react"
import { UseFormReturn, useForm } from "react-hook-form"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/shadcn"

const FormDataSchema = Schema.Struct({
  newPassword: pipe(
    Schema.NonEmptyString,
    Schema.minLength(LENGTHS.PASSWORD.MINIMUM),
    Schema.maxLength(LENGTHS.PASSWORD.MAXIMUM),
    // (Optional) add a strength check or a zxcvbn-style estimator server-side
  ),
  currentPassword: pipe(
    Schema.NonEmptyString,
    Schema.minLength(LENGTHS.PASSWORD.MINIMUM),
    Schema.maxLength(LENGTHS.PASSWORD.MAXIMUM),
    // (Optional) add a strength check or a zxcvbn-style estimator server-side
  ),
})
type FormData = typeof FormDataSchema.Type

export default function ChangePasswordForm({
  className,
  ...props
}: ComponentProps<"div">) {
  const form = useForm<FormData>({
    resolver: effectTsResolver(FormDataSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  })
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutate: changePassword } = useMutation({
    mutationKey: ["changePassword"],
    mutationFn: async (data: FormData) => {
      const result = await authClient.changePassword({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
        revokeOtherSessions: true,
      })
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result
    },
    onError: error => {
      toast.error(error.message || "Failed to change password")
    },
    onSuccess: async () => {
      toast.success("Password changed successfully")
      await queryClient.invalidateQueries({
        queryKey: authenticationDataQueryOptions.queryKey,
      })
      await router.invalidate({ sync: true })
    },
  })
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(data => changePassword(data))}>
          <div className="flex flex-col gap-6">
            {/* <FormHeader /> */}
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <NewPasswordInput form={form} />
                <CurrentPasswordInput form={form} />
              </div>
              <ChangePasswordButton />
            </div>
          </div>
        </form>
        {/* <FormFooter /> */}
      </Form>
    </div>
  )
}

function NewPasswordInput({ form }: { form: UseFormReturn<FormData> }) {
  return (
    <FormField
      control={form.control}
      name="newPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel>New Password</FormLabel>
          <FormControl>
            <Input type="password" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
function CurrentPasswordInput({ form }: { form: UseFormReturn<FormData> }) {
  return (
    <FormField
      control={form.control}
      name="currentPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Current Password</FormLabel>
          <FormControl>
            <Input type="password" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function ChangePasswordButton() {
  return (
    <Button className="w-full" type="submit">
      Change Password
    </Button>
  )
}
