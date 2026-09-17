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
 * The label is `text-label` at every size, and only the height and the side
 * padding change. Size is a control property, not a type property: bumping
 * the label a step when the button gets taller puts a combination on screen
 * that isn't in the scale, and then nothing else can match it.
 *
 * Disabled is tokens, not opacity. `opacity-50` drops the whole control
 * toward whatever is behind it, so the same button reads differently on a
 * card and on a sunken panel, and nothing in the theme controls it. So a
 * disabled button takes `--disabled` and `--disabled-foreground` instead,
 * which land at 3.03:1 in light and 3.37:1 in dark: off, and still readable.
 *
 * Disabled also drops the variant. A disabled destructive button is not a
 * quieter red, it is the same inert slab as every other disabled button,
 * because the only thing it has left to say is that you cannot press it.
 * Ghost is the exception and keeps its transparent fill, since giving it a
 * slab would make it louder switched off than switched on.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md " +
    "text-label transition-colors " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
    "disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground " +
    "disabled:border-transparent " +
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost:
          "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground " +
          "disabled:bg-transparent",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link:
          "text-primary underline-offset-4 hover:underline " +
          "disabled:bg-transparent disabled:no-underline",
      },
      size: {
        /** 28px. Inline, and inside table rows. */
        sm: "h-7 px-2.5",
        /** 32px. The default everywhere else. */
        default: "h-8 px-3",
        /** 36px. The one primary action on a page, and nothing else. */
        lg: "h-9 px-4",
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
  trailingIcon,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /**
     * An icon after the label, for a button that opens something rather than
     * doing something. A chevron down on a button with a menu behind it, and
     * very little else: two icons on one control is already one too many.
     * The leading icon is just `children`, so pass both if you have to.
     */
    trailingIcon?: React.ReactNode
  }) {
  const Comp = asChild ? Slot : "button"

  // Slot takes exactly one child, so with asChild the trailing icon has to go
  // inside the element that was handed to us rather than beside it.
  const content =
    asChild && trailingIcon && React.isValidElement(children)
      ? React.cloneElement(
          children as React.ReactElement<{ children?: React.ReactNode }>,
          undefined,
          <>
            {(children as React.ReactElement<{ children?: React.ReactNode }>)
              .props.children}
            {trailingIcon}
          </>
        )
      : (
          <>
            {children}
            {trailingIcon}
          </>
        )

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {content}
    </Comp>
  )
}

export { Button, buttonVariants }
