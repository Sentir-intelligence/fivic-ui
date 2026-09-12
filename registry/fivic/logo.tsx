import * as React from "react"

/**
 * The Fivic brand marks.
 *
 * The geometry is traced off the raster logo we were given, so it's a rebuild
 * rather than the original vector, but it's exact: three shapes on a 183 unit
 * square, with the diagonal running from (182,196) down to the top left
 * corner of the lower square.
 *
 * The full lockup isn't here. The wordmark ("FLOORING INNOVATIONS" over
 * "VICTORIA") is set in Bai Jamjuree and reverses to white, so there was
 * nothing to trace on a white background. Get the vector files off Fivic
 * (.ai, .eps or .svg) and add a `variant="full"` when they land.
 *
 * Colour comes from `currentColor`, so the mark takes whatever text colour it
 * sits in. That's on purpose. One component then covers brand teal on light
 * surfaces, white on dark or on a photo, and muted when something's disabled,
 * without shipping three files.
 */

type MarkProps = React.SVGProps<SVGSVGElement> & {
  /** Visual title for assistive technology. Pass null for decorative use. */
  title?: string | null
}

export function FivicMark({ title = "Flooring Innovations Victoria", ...props }: MarkProps) {
  return (
    <svg
      viewBox="0 0 353 544"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title ?? undefined}
      {...props}
    >
      <path d="M0 0h353v183H0z" fill="currentColor" />
      <path d="M182 196h87v164H0z" fill="currentColor" />
      <path d="M0 361h183v183H0z" fill="currentColor" />
    </svg>
  )
}

/**
 * The mark at the identity colour. Uses --brand, not --primary. The logo teal
 * is the identity colour and nothing is written on top of it, so the 4.5:1
 * label rule doesn't apply here. See AGENTS.md.
 */
export function FivicLogo({ className = "h-8 w-auto", ...props }: MarkProps) {
  return <FivicMark className={`text-brand ${className}`} {...props} />
}
