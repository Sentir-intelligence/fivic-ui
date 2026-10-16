import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * The FIVIC checkbox.
 *
 * It's 13px, not shadcn's 16px, because it sits in 36px rows next to a 12px
 * label. At 16px the box outweighs the words it belongs to and pulls the eye
 * off the row.
 *
 * Checked fills with `--primary` and carries the tick in
 * `--primary-foreground`, since a tick is something you read. Unchecked is a
 * bare `--input` border with nothing in it. Corners are `radius-xs`, so the
 * box still reads as a box at this size rather than a dot.
 *
 * 13px is too small to aim at, so the box is never the thing you click. Wrap
 * it in a label, or make the whole row the label, and the hit area becomes
 * the words as well:
 *
 *   <label className="flex h-9 items-center gap-2 text-label">
 *     <Checkbox />
 *     Include superseded revisions
 *   </label>
 *
 * Disabled is tokens, not opacity, and it drops the checked fill the same way
 * a disabled Button drops its variant: `--disabled` with the tick in
 * `--disabled-foreground`, so a switched off box that happens to be ticked
 * doesn't still shout `--primary`.
 *
 * Checked and disabled styles are kept from ever matching together
 * (`enabled:` against `disabled:`), rather than relying on which one Tailwind
 * happens to write out later.
 */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer inline-flex size-3.25 shrink-0 items-center justify-center rounded-xs " +
          "border border-input bg-transparent transition-colors outline-none " +
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
          "enabled:data-[state=checked]:border-primary enabled:data-[state=checked]:bg-primary " +
          "enabled:data-[state=checked]:text-primary-foreground " +
          "enabled:data-[state=indeterminate]:border-primary enabled:data-[state=indeterminate]:bg-primary " +
          "enabled:data-[state=indeterminate]:text-primary-foreground " +
          "disabled:pointer-events-none disabled:border-transparent disabled:bg-disabled " +
          "disabled:text-disabled-foreground",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="group flex items-center justify-center text-current"
      >
        <Check
          className="size-2.5 group-data-[state=indeterminate]:hidden"
          strokeWidth={3}
          aria-hidden="true"
        />
        <Minus
          className="hidden size-2.5 group-data-[state=indeterminate]:block"
          strokeWidth={3}
          aria-hidden="true"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
