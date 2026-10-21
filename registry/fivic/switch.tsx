import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

/**
 * The FIVIC switch.
 *
 * A switch takes effect the moment you flip it. If the thing it controls
 * waits for a Save button, it is a Checkbox instead, because a switch that
 * does nothing until later tells the person something that isn't true.
 *
 * 28x16 with a 12px knob, 2px in from each end.
 *
 * The knob is load bearing, not decoration. `--secondary` and `--disabled`
 * are the same neutral step, so the track alone can't tell off from switched
 * off. The knob does it instead:
 *
 * - on is `--primary` with a `--primary-foreground` knob
 * - off is `--secondary` with a crisp `--card` knob
 * - disabled is `--disabled` with a grey `--disabled-foreground` knob,
 *   whichever way it was set, the same way a disabled Button drops its
 *   variant
 *
 * Disabled is tokens, never opacity. On and disabled are kept from ever
 * matching together (`enabled:` against `disabled:` on the track,
 * `not-data-[disabled]:` against `data-[disabled]:` on the knob), rather than
 * relying on which one Tailwind happens to write out later.
 *
 * Give it a label the same way as a Checkbox, by wrapping it or with
 * `htmlFor`, so the words are part of the hit area.
 */
function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors " +
          "outline-none " +
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
          "enabled:data-[state=checked]:bg-primary enabled:data-[state=unchecked]:bg-secondary " +
          "disabled:pointer-events-none disabled:bg-disabled",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={
          "pointer-events-none block size-3 rounded-full transition-transform " +
          "data-[state=unchecked]:translate-x-0.5 data-[state=checked]:translate-x-3.5 " +
          "not-data-[disabled]:data-[state=checked]:bg-primary-foreground " +
          "not-data-[disabled]:data-[state=unchecked]:bg-card " +
          "data-[disabled]:bg-disabled-foreground"
        }
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
