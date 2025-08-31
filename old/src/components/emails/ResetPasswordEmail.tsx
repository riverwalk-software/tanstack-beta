import { Button, Html } from "@react-email/components"

export function ResetPasswordEmail({ url }: { url: string }) {
  return (
    <Html lang="en">
      <Button href={url}>Reset Password</Button>
    </Html>
  )
}
