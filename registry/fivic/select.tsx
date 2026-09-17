import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * The FIVIC select.
 *
 * The trigger is an Input that opens something, so it is built to match one
 * rather than to match a Button: 32px, `--input` border, `--card` fill,
 * `radius-md`. A control that holds a value you chose should look like the
 * controls that hold values you typed.
 *
 * Two variants, and the second one is the reason this component exists twice
 * over.
 *
 * - `default` is the bordered trigger. It is what a Group by slot is.
 * - `ghost` has no border and no fill and sets no type step, so it takes
 *   whatever the cell around it is using. That is for a picker sitting inside
 *   a table, the rate on a unit cost line being the one that forced it. A
 *   bordered trigger in there would draw a box around one column of an
 *   otherwise clean table, and pinning it to `text-label` would make that
 *   figure smaller than every other number in the column.
 *
 * Sizes are sm (28px) and default (32px), the same two the Button has. There
 * is no lg, because a select is never the main action on a page.
 */
const triggerVariants = {
  base:
    "inline-flex items-center justify-between whitespace-nowrap rounded-md " +
    "transition-colors outline-none " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
    "disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground " +
    "disabled:border-transparent " +
    "[&>span]:truncate " +
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 " +
    "[&_svg]:text-muted-foreground disabled:[&_svg]:text-disabled-foreground",
  variant: {
    default:
      "border border-input bg-card text-foreground text-label " +
      "data-[state=open]:border-ring",
    ghost:
      "border border-transparent bg-transparent text-foreground " +
      "hover:bg-accent data-[state=open]:bg-accent " +
      "disabled:bg-transparent",
  },
  size: {
    default: "h-8 gap-1.5",
    sm: "h-7 gap-1",
  },
  /** Ghost sits in a table cell, so it keeps its padding off the column edge. */
  padding: {
    default: { default: "pl-2.5 pr-2", ghost: "px-1" },
    sm: { default: "pl-2 pr-1.5", ghost: "px-1" },
  },
} as const

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  variant?: "default" | "ghost"
  size?: "default" | "sm"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-variant={variant}
      data-size={size}
      className={cn(
        triggerVariants.base,
        triggerVariants.variant[variant],
        triggerVariants.size[size],
        triggerVariants.padding[size][variant],
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown aria-hidden="true" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-border " +
            "bg-popover text-popover-foreground shadow-overlay " +
            "data-[state=open]:animate-in data-[state=closed]:animate-out " +
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 " +
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1 " +
              "data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-overline text-muted-foreground", className)}
      {...props}
    />
  )
}

/** 32px, the same row height every other menu in the product uses. */
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex h-8 w-full cursor-default select-none items-center " +
          "rounded-sm pl-7 pr-2 text-body outline-none " +
          "focus:bg-accent focus:text-accent-foreground " +
          "data-[disabled]:pointer-events-none data-[disabled]:text-disabled-foreground",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-3.5 text-primary" aria-hidden="true" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-border-subtle", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      <ChevronUp className="size-4" aria-hidden="true" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      <ChevronDown className="size-4" aria-hidden="true" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
