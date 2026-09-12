# FIVIC OS UI conventions

Rules for any coding agent (Claude Code, Cursor) writing front end code in
FIVIC OS. These aren't style preferences. Most of them are here because
something actually breaks otherwise, and where that's the case the reason is
stated so you can tell a rule from a taste.

## Install from the registry, don't hand roll UI

Check the FIVIC registry before you write a component or any styling.

```bash
npx shadcn add Sentir-intelligence/fivic-ui/theme   # once per app, first
npx shadcn add Sentir-intelligence/fivic-ui/fonts
npx shadcn add Sentir-intelligence/fivic-ui/logo
npx shadcn add Sentir-intelligence/fivic-ui/button
npx shadcn add Sentir-intelligence/fivic-ui/status-chip
```

Pin to a tag so a change upstream can't break a sprint:
`npx shadcn add Sentir-intelligence/fivic-ui/button#v0.1.0`. Review updates
with `--diff` before you apply them.

## Theme first, and only one

`theme` installs the tokens, both modes, the type scale and the radius. Every
component assumes those variables are already there. Never put two themes in
one app, and never install the Sentir theme here. FIVIC OS carries the Fivic
brand, not ours.

## --brand and --primary are different colours on purpose

This is the one most likely to get broken by accident, so it's first.

- `--brand` is `#2997B0`, the teal from the logo. It's the **identity**
  colour. Use it on the mark, focus rings, the active nav marker, the bar on a
  selected row. Anything with no words on it.
- `--primary` is `#177B91`. It's the **interactive** colour. Use it on
  anything that carries a label. Filled buttons, links, active tabs.

White text on `--brand` comes out at 3.42:1, which fails WCAG AA. White on
`--primary` is 4.91:1 and passes. Put a label on `--brand` and you've broken
contrast on every screen at once. If you're not sure which one you want, ask
whether someone is going to read words sitting on top of it. If yes, it's
`--primary`.

## Never write a colour value

No hex, rgb, hsl or oklch anywhere outside the theme. Use the semantic
utilities, so `bg-card`, `text-muted-foreground`, `border-border`,
`bg-warning-soft`. If the colour you want doesn't exist yet, that's a sign to
add a token to the theme in both modes, not to drop a one off value inline.

There are three border weights and they're not decoration. `border-subtle`
for dividers that don't matter, `border` as the default that still shows up
inside a dense table, `border-strong` for the splits that hold the layout
together.

## Numbers are always tabular

Columns of figures get scanned by shape, not read one number at a time. Bai
Jamjuree gives every digit a different width, so the shape changes for no
reason and the scan falls apart. The base layer turns `tabular-nums` on for
`table`, `td`, `th`, `input[type=number]`, `output` and `time`. Anything
numeric outside those needs `data-numeric` on it, or the `tabular` class.

## Two typefaces, split at 20px

- **Bai Jamjuree** (`font-display`) is Fivic's own face and it's display only.
  20px and up, headings and brand moments. Its digits are proportional. At
  40px the "1" is 14.3px against 25.8px for the "0", so it never sets a
  number. Putting `.font-display` on something also switches tabular figures
  off, because the face hasn't got them.
- **Inter** (`font-sans`) does everything else. All body text, all labels,
  all data, every number.
- The mono token is the system stack. Identifiers and file paths only.

Use the scale tokens rather than raw sizes: `text-display`, `text-title`,
`text-body`, `text-label`, `text-caption`, `text-overline`. Base size is 14px,
not 16px. This is a workspace, not a website.

## The density is deliberate

Controls are 32px (`--size-control-md`), not shadcn's 36px. Table rows are
36px. Vertical space is the scarcest thing on these screens. Don't put the
shadcn defaults back because something looks cramped next to an unstyled
component.

## Both modes, same commit

Any token you add to `:root` gets added to `.dark` in the same change. Miss
one and you get one theme's text on the other theme's background, and a
light mode screenshot won't catch it.

## Nothing talks to another origin

FIVIC OS makes no third party requests at runtime. That covers fonts, icons,
images, analytics and CDN scripts. Fonts are self hosted out of
`public/fonts/` using `scripts/fetch-fonts.mjs`, which only runs at setup.
If you need an asset, commit it and serve it from our own origin.

## One icon family

Lucide. Only add a custom SVG for brand glyphs Lucide hasn't got, and put it
in the registry so every app gets it. Don't mix icon libraries.

## Extend upstream, don't fork

If a component needs a new variant, add the variant in
`Sentir-intelligence/fivic-ui` so everyone gets it. Local one off edits are
fine but they should be rare, and flag them so they get pushed back up.
