import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"
import {
  ButtonHTMLAttributes,
  ComponentProps,
  MouseEvent,
  ReactNode,
  useCallback,
  useState,
} from "react"
import { cn } from "@/lib/shadcn"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

type ButtonBaseProps = Omit<ComponentProps<"button">, "onClick"> & {
  children?: ReactNode
}

type ButtonProps = ButtonBaseProps &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    onClick: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>
    lockWhileAsync?: boolean
    loadingText?: string
    type?: ButtonHTMLAttributes<HTMLButtonElement>["type"]
  }

function Button({
  className,
  variant,
  size,
  asChild = false,
  disabled,
  onClick,
  lockWhileAsync = true,
  loadingText = "Loading...",
  type,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  const [isPending, setIsPending] = useState(false)
  const isDisabled = disabled || (lockWhileAsync && isPending)
  const handleClick = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      const result = onClick(event)
      if (
        lockWhileAsync &&
        result &&
        typeof (result as any).then === "function"
      ) {
        try {
          setIsPending(true)
          await result
        } finally {
          setIsPending(false)
        }
      }
    },
    [isDisabled, onClick, lockWhileAsync],
  )
  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size, className }),
        asChild && isDisabled ? "pointer-events-none" : undefined,
      )}
      data-disabled={isDisabled || undefined}
      data-pending={isPending || undefined}
      data-slot="button"
      {...(!asChild ? { disabled: isDisabled, type: type ?? "button" } : {})}
      {...(asChild
        ? {
            "aria-disabled": isDisabled || undefined,
            tabIndex: isDisabled ? -1 : undefined,
          }
        : {})}
      onClick={handleClick}
      {...props}
    >
      {isPending ? (
        <span className="inline-flex items-center gap-2">
          <Loader2Icon aria-hidden="true" className="h-4 w-4 animate-spin" />
          <span>{loadingText}</span>
        </span>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
