import { polarClient } from "@polar-sh/better-auth"
// oxlint-disable-next-line extensions
import { adminClient } from "better-auth/client/plugins"
// oxlint-disable-next-line extensions
import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({
  plugins: [
    adminClient(),
    polarClient(),
    // organizationClient(),
  ],
})

export { authClient }
