import { cn } from "@/lib/utils";

export function CenteredContainer({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex min-h-[60vh] items-center justify-center", className)}
      {...props}
    >
      {children}
    </div>
  );
}
