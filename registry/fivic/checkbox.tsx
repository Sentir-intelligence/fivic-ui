import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * The FIVIC checkbox.
 *
 * It's 13px, not shadcn's 16px, because it sits in 36px rows next to a 12px
 * label. At 16px the box outweighs the words it belongs to and pulls the eye
 * off the row.
 *
 * Checked fills with `--primary` and carries a 9px tick in
 * `--primary-foreground`, since a tick is something you read. Indeterminate
 * is the same fill with a 7 x 1.5 dash in place of the tick. Unchecked is a
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
 * a disabled Button drops its variant: `--disabled` fill with the border in
 * the same colour, so there is no visible edge, and the tick or dash in
 * `--disabled-foreground`. A switched off box that happens to be ticked
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
          "disabled:pointer-events-none disabled:border-disabled disabled:bg-disabled " +
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
          className="size-2.25 group-data-[state=indeterminate]:hidden"
          strokeWidth={3}
          aria-hidden="true"
        />
        {/* A drawn bar rather than lucide's Minus, which can't come out at
            exactly 7 x 1.5 at this size. */}
        <span
          data-slot="checkbox-dash"
          aria-hidden="true"
          className="hidden h-[1.5px] w-1.75 bg-current group-data-[state=indeterminate]:block"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
