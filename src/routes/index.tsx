import { Button } from "@components"
import { createFileRoute } from "@tanstack/react-router"
import { useCallback } from "react"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  const handleClick = useCallback(async () => {
    await new Promise(res => setTimeout(res, 1000))
    // continue after 500ms
  }, [])
  return <Button onClick={handleClick}>Click me</Button>
}
