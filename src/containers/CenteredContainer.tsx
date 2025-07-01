import { cn } from "@/lib/utils";

export function CenteredContainer({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("grid place-content-center", className)} {...props}>
      {children}
    </div>
  );
}
