import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "max-w max-h animate-pulse rounded-md bg-accent",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
