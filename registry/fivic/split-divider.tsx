import * as React from "react"
import { GripHorizontal, GripVertical } from "lucide-react"
import { Group, Panel, Separator } from "react-resizable-panels"

import { cn } from "@/lib/utils"

/**
 * The FIVIC split divider. The bar between two panes, such as the document
 * and the questions about it.
 *
 * Built on react-resizable-panels v4. Its `Separator` already resets on a
 * double click and handles the keyboard, and its `useDefaultLayout` hook
 * remembers a layout, so none of that is written again here. This file only
 * owns how the bar looks and which way it goes.
 *
 * `splits` is named for what gets split, not for which way the bar runs,
 * because "horizontal" means the opposite thing to half the people who read
 * it. The library's `orientation` is the direction the panes are laid out
 * in, so:
 *
 * - `splits="left and right"` is `orientation="horizontal"`: panes side by
 *   side, the bar running up and down.
 * - `splits="top and bottom"` is `orientation="vertical"`: panes stacked,
 *   the bar running across.
 *
 * Geometry. The bar is 5px of `--border-subtle`. The handle on it is 34x14
 * (14x34 on an upright bar) at `radius-sm`, `--card` fill and `--border`
 * stroke, holding a 12px grip icon. The grab area is 11px, so 3px either side
 * of the bar, set through the library's `resizeTargetMinimumSize` rather than
 * by padding the bar, which would push the panes apart. Touch keeps the
 * library's 20px.
 *
 * What the app still owes. None of this can live in here, because it depends
 * on what is in the panes and who is looking at them:
 *
 * - `minSize` on both panels, so neither pane can be dragged away to
 *   nothing. Size props in v4 are pixels when they're numbers and
 *   percentages when they're strings, so `minSize={240}` is 240px and
 *   `defaultSize="55%"` is 55%. `defaultSize={55}` is 55px.
 * - Snap to a floor within 24px of it, so a pane dragged nearly shut closes
 *   properly rather than leaving a sliver. That is `collapsible`, the floor
 *   as `collapsedSize` and `collapsedThreshold={24}` on the panel.
 * - A visible collapse control as well, because a double click and a drag
 *   aren't discoverable and don't work for everyone.
 * - The split remembered per person, starting at 55%. Pass `defaultSize="55%"`
 *   on the first panel, and feed `useDefaultLayout` a `storage` that is keyed
 *   to the signed in person rather than plain `localStorage`, which is per
 *   browser.
 *
 *   const { defaultLayout, onLayoutChanged } = useDefaultLayout({ id: "doc-split", storage })
 *
 *   <SplitGroup
 *     splits="left and right"
 *     defaultLayout={defaultLayout}
 *     onLayoutChanged={onLayoutChanged}
 *   >
 *     <SplitPanel id="document" defaultSize="55%" minSize={320}>...</SplitPanel>
 *     <SplitDivider />
 *     <SplitPanel id="questions" minSize={280}>...</SplitPanel>
 *   </SplitGroup>
 */
type Splits = "top and bottom" | "left and right"

const SplitsContext = React.createContext<Splits>("left and right")

function SplitGroup({
  splits,
  className,
  resizeTargetMinimumSize = { fine: 11, coarse: 20 },
  ...props
}: Omit<React.ComponentProps<typeof Group>, "orientation"> & {
  /** What gets split, not which way the bar runs. */
  splits: Splits
}) {
  return (
    <SplitsContext.Provider value={splits}>
      <Group
        data-slot="split-group"
        data-splits={splits === "top and bottom" ? "top-bottom" : "left-right"}
        orientation={splits === "top and bottom" ? "vertical" : "horizontal"}
        resizeTargetMinimumSize={resizeTargetMinimumSize}
        className={cn("h-full w-full", className)}
        {...props}
      />
    </SplitsContext.Provider>
  )
}

function SplitPanel({ ...props }: React.ComponentProps<typeof Panel>) {
  return <Panel data-slot="split-panel" {...props} />
}

function SplitDivider({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  const splits = React.useContext(SplitsContext)
  const upright = splits === "left and right"
  const Grip = upright ? GripVertical : GripHorizontal

  return (
    <Separator
      data-slot="split-divider"
      className={cn(
        // relative and z-10 so the handle, which is wider than the bar, sits
        // over the panes on either side rather than under them.
        "relative z-10 flex items-center justify-center bg-border-subtle outline-none " +
          "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring",
        upright ? "w-1.25" : "h-1.25",
        className
      )}
      {...props}
    >
      <div
        data-slot="split-divider-handle"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-sm border border-border " +
            "bg-card text-muted-foreground",
          upright ? "h-8.5 w-3.5" : "h-3.5 w-8.5"
        )}
      >
        <Grip className="size-3" aria-hidden="true" />
      </div>
    </Separator>
  )
}

export { SplitDivider, SplitGroup, SplitPanel }
export type { Splits }
