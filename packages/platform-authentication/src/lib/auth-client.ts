// oxlint-disable-next-line extensions
import { createAuthClient } from "better-auth/react"

type AuthClient = ReturnType<typeof createAuthClient>
const authClient: AuthClient = createAuthClient()

export { authClient }
