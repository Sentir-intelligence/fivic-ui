import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * The FIVIC status chip.
 *
 * State is the most repeated thing in the product, and almost every list row
 * carries one. Leave it to individual screens and the same state ends up
 * named three ways and coloured four, so it gets named and coloured here
 * instead.
 *
 * Tone is kept separate from wording on purpose. `tone` picks the colour, and
 * the label comes in as children, so the words can differ from one surface to
 * the next without the colour drifting along with them.
 *
 * Colours come from the soft token trio (background, foreground, border),
 * which is defined in both modes and measured at 4.5:1 or better in each.
 * Type is `text-overline`, the scale token for an uppercase label, rather
 * than a raw size.
 */
const chipVariants = cva(
  "inline-flex items-center gap-1 rounded-xs border px-1.5 py-0.5 " +
    "text-overline uppercase whitespace-nowrap " +
    "[&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        /** Settled. Correct, and a person has accepted it. */
        success: "bg-success-soft text-success-soft-foreground border-success-soft-border",
        /** Needs a person to look at it: unsorted, low confidence, superseded, overdue. */
        warning: "bg-warning-soft text-warning-soft-foreground border-warning-soft-border",
        /** Rejected, failed, blocked. */
        danger: "bg-danger-soft text-danger-soft-foreground border-danger-soft-border",
        /** The system did it and it looks fine, but nobody has confirmed it yet. */
        info: "bg-info-soft text-info-soft-foreground border-info-soft-border",
        /** Nothing worth colouring. Use this rather than inventing a tone. */
        neutral: "bg-muted text-muted-foreground border-transparent",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
)

function StatusChip({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof chipVariants>) {
  return <span data-slot="status-chip" className={cn(chipVariants({ tone, className }))} {...props} />
}

export { StatusChip, chipVariants }
