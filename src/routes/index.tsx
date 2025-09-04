import { LoginForm } from "@authentication"
import { CenteredContainer } from "@components"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  return (
    <CenteredContainer>
      <div className="grid w-full max-w-sm items-center gap-3">
        <LoginForm />
      </div>
    </CenteredContainer>
  )
}
