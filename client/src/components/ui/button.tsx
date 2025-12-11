import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
  " hover-elevate active-elevate-2" +
  " focus-visible:outline-3 focus-visible:outline focus-visible:outline-primary/40 focus-visible:outline-offset-[3px]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary-border rounded-xl",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive-border rounded-xl",
        outline:
          "border [border-color:var(--button-outline)] shadow-xs active:shadow-none rounded-xl",
        secondary: "border bg-secondary text-secondary-foreground border-secondary-border rounded-xl",
        ghost: "border border-transparent rounded-xl",
      },
      size: {
        default: "h-10 min-h-10 px-4 py-2",
        sm: "h-9 min-h-9 px-3 text-xs",
        lg: "h-12 min-h-12 px-8",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
