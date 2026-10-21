import { createLucideIcon } from "lucide-react"

/**
 * The icons lucide hasn't got.
 *
 * Everything else in the Figma Icons page is a lucide icon, and each one's
 * description there gives the import. These two are drawn the same way on
 * the same 24 unit grid, so they take every lucide prop (size, className,
 * aria-hidden) and the theme's stroke width like any other icon.
 *
 * CloudMarkup  the revision cloud tool in the drawing markup bar. Lucide's
 *              Cloud is weather, and a weather cloud on a drawing reads wrong.
 * Length       the length measure tool: a line with an end stop at each end.
 */

export const CloudMarkupIcon = createLucideIcon("cloud-markup", [
  [
    "path",
    {
      d: "M8.5 5C6.673 4.507 5.506 5.173 5 7C3.513 7.981 3.347 9.147 4.5 10.5C3.167 11.5 3.167 12.5 4.5 13.5C3.347 14.853 3.513 16.02 5 17C5.506 18.826 6.673 19.494 8.5 19C9.666 20.334 10.833 20.334 12 19C13.167 20.334 14.333 20.334 15.5 19C17.326 19.494 18.494 18.826 19 17C20.481 16.22 20.647 15.219 19.5 14C20.833 12.834 20.833 11.667 19.5 10.5C20.653 9.147 20.487 7.981 19 7C18.494 5.173 17.326 4.507 15.5 5C14.333 3.667 13.167 3.667 12 5C10.833 3.667 9.666 3.667 8.5 5Z",
      key: "cloud",
    },
  ],
])

export const LengthIcon = createLucideIcon("length", [
  ["path", { d: "M3 12H21", key: "line" }],
  ["path", { d: "M3 8V16", key: "start" }],
  ["path", { d: "M21 8V16", key: "end" }],
])
