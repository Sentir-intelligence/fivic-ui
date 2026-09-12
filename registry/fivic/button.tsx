import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * The FIVIC button.
 *
 * Two things are different from stock shadcn and both are on purpose.
 *
 * 1. It's 32px by default, not 36px. Up and down space is the scarcest thing
 *    on these screens.
 * 2. The filled variant uses --primary (#177B91), never --brand (#2997B0).
 *    White on the logo teal is 3.42:1 and fails AA. There's no `brand`
 *    variant here on purpose, because the brand colour carries identity, not
 *    labels. See AGENTS.md.
 *
 * Sizes come off the scale (`text-label`, `text-body-sm`) rather than raw px,
 * which is the rule AGENTS.md sets. `text-label` already carries weight 500,
 * so there is no `font-medium` here.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md " +
    "text-label transition-colors " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost: "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        /** 28px. Inline, and inside table rows. */
        sm: "h-7 px-2.5",
        /** 32px. The default everywhere else. */
        default: "h-8 px-3",
        /** 36px. The one primary action on a page, and nothing else. */
        lg: "h-9 px-4 text-body-sm",
        icon: "size-8 px-0",
        "icon-sm": "size-7 px-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
