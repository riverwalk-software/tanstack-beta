import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/success')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/success"!</div>
}
