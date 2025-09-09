import { ReactNode } from "react"

export default function CenteredContainer({
  children,
}: {
  children: ReactNode
}) {
  return <div className="grid min-h-screen place-items-center">{children}</div>
}
