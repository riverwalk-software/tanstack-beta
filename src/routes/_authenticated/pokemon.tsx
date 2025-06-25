import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/pokemon')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/pokemon"!</div>
}
