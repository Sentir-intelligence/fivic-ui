import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * The FIVIC input.
 *
 * Same box as the Select trigger, on purpose: 32px, `radius-md`, `--card`
 * fill, `--input` border and 10px of side padding. A field holding a value
 * you typed and a field holding a value you picked sit side by side in the
 * same forms and headers, so they have to read as one family.
 *
 * The value sits at `text-body-sm` rather than `text-label`, because it is
 * content the person wrote, not a label the product wrote. The placeholder
 * is `--muted-foreground`.
 *
 * `--input` is a border colour, not a background. Fill a field with it and
 * you get a grey slab, so the fill is always `--card`.
 *
 * Disabled is tokens, not opacity, for the same reason as the Button:
 * `opacity-50` drops the field toward whatever is behind it, so the same
 * field reads one way on a card and another on a sunken panel. A disabled
 * field takes `--disabled` and `--disabled-foreground` and loses its border.
 *
 * In Figma the Input component is the search field, with a 14px leading
 * icon, a placeholder and a `Clear` boolean. This is the bare element, and
 * the app composes the search field out of it, so a plain text field doesn't
 * carry an icon slot it never uses:
 *
 *   <div className="relative">
 *     <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
 *     <Input type="search" placeholder="Search documents" className="pl-7" />
 *   </div>
 */
function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-8 w-full min-w-0 rounded-md border border-input bg-card px-2.5 " +
          "text-body-sm text-foreground placeholder:text-muted-foreground " +
          "transition-colors outline-none " +
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
          "disabled:pointer-events-none disabled:border-transparent disabled:bg-disabled " +
          "disabled:text-disabled-foreground disabled:placeholder:text-disabled-foreground " +
          "file:border-0 file:bg-transparent file:text-label file:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input }
