import { adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({
  plugins: [
    adminClient(),
    // polarClient(),
    // organizationClient(),
  ],
})

export { authClient }
