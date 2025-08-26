import type * as React from "react"

import { Button } from "../ui/button"

export function FormButton({
  className,
  disabled,
  ...props
}: Omit<React.ComponentProps<"button">, "disabled" | "onClick"> & {
  disabled: boolean
}) {
  return (
    <Button
      className={className}
      disabled={disabled}
      onClick={() => {}} // Prevent default click behavior
      {...props}
    />
  )
}
