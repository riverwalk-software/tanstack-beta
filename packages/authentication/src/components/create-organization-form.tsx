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
import { Schema } from "effect"
import { authenticationDataQueryOptions } from "packages/authentication/src/utils/authentication"
import { ComponentProps } from "react"
import { UseFormReturn, useForm } from "react-hook-form"
import slugify from "slugify"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/shadcn"

const mySlugify = (value: string) =>
  slugify(value, {
    locale: "en",
    lower: true,
    strict: true,
    trim: true,
  })

const FormDataSchema = Schema.Struct({
  name: Schema.String,
})
type FormData = typeof FormDataSchema.Type

export default function CreateOrganizationForm({
  className,
  ...props
}: ComponentProps<"div">) {
  const form = useForm<FormData>({
    resolver: effectTsResolver(FormDataSchema),
    defaultValues: {
      name: "",
    },
  })
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutate: createOrganization } = useMutation({
    mutationKey: ["createOrganization"],
    mutationFn: async (data: FormData) => {
      const result = await authClient.organization.create({
        name: data.name,
        slug: mySlugify(data.name), // required
        logo: "https://example.com/logo.png",
        keepCurrentActiveOrganization: false,
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
      toast.success("Organization created successfully")
      await queryClient.invalidateQueries({
        queryKey: authenticationDataQueryOptions.queryKey,
      })
      await router.invalidate({ sync: true })
    },
  })
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(data => createOrganization(data))}>
          <div className="flex flex-col gap-6">
            {/* <FormHeader /> */}
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <NameInput form={form} />
                <SlugInput form={form} />
              </div>
              <CreateOrganizationButton />
            </div>
          </div>
        </form>
        {/* <FormFooter /> */}
      </Form>
    </div>
  )
}

function NameInput({ form }: { form: UseFormReturn<FormData> }) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Organization Name</FormLabel>
          <FormControl>
            <Input type="text" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function SlugInput({ form }: { form: UseFormReturn<FormData> }) {
  return (
    <FormField
      control={form.control}
      disabled
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Slug</FormLabel>
          <FormControl>
            <Input type="text" {...field} value={mySlugify(field.value)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function CreateOrganizationButton() {
  return (
    <Button className="w-full" type="submit">
      Create Organization
    </Button>
  )
}
