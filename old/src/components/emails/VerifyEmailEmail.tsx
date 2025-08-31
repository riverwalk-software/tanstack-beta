import { Button, Html } from "@react-email/components"

export function VerifyEmailEmail({ url }: { url: string }) {
  return (
    <Html lang="en">
      <Button href={url}>Verify Email</Button>
    </Html>
  )
}
