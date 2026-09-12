# FIVIC OS UI conventions

Rules for any coding agent (Claude Code, Cursor) writing front end code in
FIVIC OS. Most of these are here because something breaks otherwise, and the
reason sits next to the rule so you can tell a rule from a taste.

## Install from the registry, don't hand roll UI

Check here before you write a component or any styling.

```bash
npx shadcn add Sentir-intelligence/fivic-ui/theme   # once per app, first
npx shadcn add Sentir-intelligence/fivic-ui/fonts
npx shadcn add Sentir-intelligence/fivic-ui/logo
npx shadcn add Sentir-intelligence/fivic-ui/button
npx shadcn add Sentir-intelligence/fivic-ui/status-chip
```

Pin to a tag so a change up here can't break a sprint:
`npx shadcn add Sentir-intelligence/fivic-ui/button#v0.1.0`. Check updates
with `--diff` first.

## Theme first, and only one

`theme` sets up the tokens, both modes, the type scale and the radius, and
every component assumes they're already there. Never put two themes in one
app, and never install the sentir theme here. FIVIC OS carries the fivic
brand.

## --brand and --primary are different colours on purpose

This one gets broken by accident more than anything else, so it goes first.

- `--brand` is `#2997B0`, the teal off the logo. Identity only: the mark,
  focus rings, the active nav marker, the bar down the side of a selected
  row. Anything with no words on it.
- `--primary` is `#177B91`. Everything that carries a label. Filled buttons,
  links, active tabs.

White on `--brand` comes out at 3.42:1 and fails WCAG AA. White on
`--primary` is 4.91:1 and passes. So if you're not sure which one you want,
ask whether anyone is going to read words sitting on top of it. If yes, it's
`--primary`.

## Never write a colour value

No hex, rgb, hsl or oklch outside the theme. Use the named ones, so
`bg-card`, `text-muted-foreground`, `border-border`, `bg-warning-soft`. If
the colour you want isn't there yet, add a token to the theme in both modes
rather than dropping a one off value inline.

Three border weights, and they're not decoration. `border-subtle` for
dividers that don't matter, `border` as the default that still shows up
inside a busy table, `border-strong` for the splits that hold the layout
together.

## Numbers are always tabular

Columns of figures get read by shape, not one number at a time, and
Bai Jamjuree gives every digit a different width, so the shape moves around
for no reason. The base styles turn `tabular-nums` on for `table`, `td`,
`th`, `input[type=number]`, `output` and `time`. Anything with numbers in it
outside those needs `data-numeric` on it, or the `tabular` class.

Figma can't do this bit. The plugin API only reads `openTypeFeatures`, it
can't set it, so the fivic text styles in the Figma file don't carry tabular
figures and a column of numbers in a mockup will be proportional even where
the built screen has it right. Take the rule from here, not from the picture.

## Two typefaces, split at 20px

- Bai Jamjuree (`font-display`) is fivic's own face and it only goes 20px and
  up, on headings and brand moments. At 40px its "1" is 14.3px wide against
  25.8px for the "0", so it never sets a number. Putting `.font-display` on
  something also switches tabular figures off, because the face hasn't got
  them.
- Inter (`font-sans`) does everything else. Body text, labels, data, every
  number.
- The mono token is the system stack. Identifiers and file paths only.

Use the scale tokens rather than raw sizes, so `text-display`, `text-title`,
`text-body`, `text-label`, `text-caption`, `text-overline`. Base size is
14px, not 16px, because this is a workspace rather than a website.

A size prop changes the control, not the type. A button gets taller and wider
at `lg`, and its label stays on the same step. If you find yourself wanting a
weight or a size that isn't in the scale, that's the signal to add a step to
the theme, not to write it inline on one component.

## The density is deliberate

Controls are 32px (`--size-control-md`) instead of shadcn's 36px, and table
rows are 36px. Up and down space is the scarcest thing on these screens.
Don't put the shadcn defaults back because something looks cramped next to an
unstyled component.

## Both modes, same commit

Any token you add to `:root` gets added to `.dark` in the same change. Miss
one and you get one theme's text on the other theme's background, and a light
mode screenshot won't catch it.

## Nothing reaches out to another server

Nothing in a FIVIC app calls out to anyone else while it's running. That
covers fonts, icons, images, analytics and CDN scripts. Fonts are served from
`public/fonts/`, pulled down once by `scripts/fetch-fonts.mjs` at setup. If
you need an asset, commit it and serve it from our own origin.

## One icon family

Lucide. Only add your own SVG for brand shapes lucide hasn't got, and put it
in the registry so every app gets it. Don't mix icon libraries.

## Extend upstream, don't fork

If a component needs a new variant, add the variant in
`Sentir-intelligence/fivic-ui` so everyone gets it. A local one off edit is
fine, it should just be rare, and flag it so it gets pushed back up.
