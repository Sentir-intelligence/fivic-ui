import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * The FIVIC avatar. A person, as initials or a photo.
 *
 * Two sizes. `default` is 26px. `sm` is 20px, for inside something already
 * dense: a question card, a citation, an RFI row. There is no bigger one,
 * because nothing on these screens is about a person enough to want one.
 *
 * `--accent` fill, a `--border` stroke so a pale photo still has an edge, and
 * initials in `--accent-foreground`.
 *
 * The initials are 11px at weight 600 with zero tracking, which is off the
 * type scale on purpose and written once, here. `caption` is the nearest
 * step, and its 2% tracking leaves a gap after the last letter as well as
 * between them, so centred initials sit visibly left of centre. Don't swap a
 * scale step back in, and don't copy the raw size anywhere else.
 *
 *   <Avatar>
 *     <AvatarImage src={person.photo} alt="" />
 *     <AvatarFallback>JM</AvatarFallback>
 *   </Avatar>
 *
 * The fallback shows while the photo loads and whenever there isn't one, so
 * always pass initials.
 */
const avatarVariants = cva(
  "relative inline-flex shrink-0 overflow-hidden rounded-full border border-border bg-accent",
  {
    variants: {
      size: {
        /** 26px. */
        default: "size-6.5",
        /** 20px. Inside a question card, a citation or an RFI row. */
        sm: "size-5",
      },
    },
    defaultVariants: { size: "default" },
  }
)

function Avatar({
  className,
  size,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size ?? "default"}
      className={cn(avatarVariants({ size, className }))}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        // Off the scale on purpose. See the note at the top of this file.
        "flex size-full items-center justify-center " +
          "text-[11px] leading-none font-semibold tracking-normal " +
          "text-accent-foreground select-none",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarFallback, AvatarImage, avatarVariants }
