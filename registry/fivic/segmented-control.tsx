import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

/**
 * The FIVIC segmented control.
 *
 * Two or three segments that split a panel's width evenly, like Questions
 * and RFIs across the top of the side panel. It replaces the panel's title
 * rather than sitting under one: the segments already say what the panel is
 * showing, and a title above them spends 38px saying it twice.
 *
 * Built on Radix Tabs, because that is what it is: one of a few views of the
 * same panel. That gets the tablist roles and arrow key movement for free.
 *
 * - 38px tall, with a `--border-subtle` rule along the bottom, and 12px of
 *   side padding on each segment so a long label never runs into the next.
 * - The selected segment is `--foreground` with a 2px `--brand` bar under it.
 *   The bar has no words on it, so it is `--brand` rather than `--primary`.
 * - Unselected segments are `--muted-foreground`.
 * - Labels are `text-label` and they stay that weight when selected. Bumping
 *   the selected one to semibold shifted its width by a pixel, so the label
 *   moved every time the selection did.
 *
 * Where a count is the point, it goes in the label rather than a badge, so
 * `Questions 10` and `RFIs 15`. Pass it as `count` and it comes out on
 * `text-caption` in `--muted-foreground`:
 *
 *   <SegmentedControl defaultValue="questions">
 *     <SegmentedControlList>
 *       <SegmentedControlItem value="questions" count={10}>Questions</SegmentedControlItem>
 *       <SegmentedControlItem value="rfis" count={15}>RFIs</SegmentedControlItem>
 *     </SegmentedControlList>
 *     <SegmentedControlContent value="questions">...</SegmentedControlContent>
 *     <SegmentedControlContent value="rfis">...</SegmentedControlContent>
 *   </SegmentedControl>
 */
function SegmentedControl({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="segmented-control"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function SegmentedControlList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="segmented-control-list"
      className={cn("flex h-9.5 w-full shrink-0 border-b border-border-subtle", className)}
      {...props}
    />
  )
}

function SegmentedControlItem({
  className,
  count,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  /** Goes in the label, never in a badge next to it. */
  count?: React.ReactNode
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="segmented-control-item"
      className={cn(
        "relative inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 px-3 " +
          "whitespace-nowrap text-label text-muted-foreground transition-colors outline-none " +
          "hover:text-foreground " +
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring " +
          "data-[state=active]:text-foreground " +
          // The bar sits over the list's bottom rule rather than above it.
          "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 " +
          "data-[state=active]:after:bg-brand " +
          "disabled:pointer-events-none disabled:text-disabled-foreground",
        className
      )}
      {...props}
    >
      {children}
      {count != null && (
        <span
          data-slot="segmented-control-count"
          className="text-caption text-muted-foreground tabular"
        >
          {count}
        </span>
      )}
    </TabsPrimitive.Trigger>
  )
}

function SegmentedControlContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="segmented-control-content"
      className={cn("min-h-0 flex-1 outline-none", className)}
      {...props}
    />
  )
}

export {
  SegmentedControl,
  SegmentedControlContent,
  SegmentedControlItem,
  SegmentedControlList,
}
