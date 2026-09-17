# FIVIC OS UI conventions

Rules for any agent working on FIVIC OS, whether that's writing front end
code (Claude Code, Cursor) or designing in the Figma file. Most of these are
here because something breaks otherwise, and the reason sits next to the rule
so you can tell a rule from a taste. If you're in Figma, read the lot, then the
Figma section at the bottom, which carries the file keys and the traps.

## Install from the registry, don't hand roll UI

Check here before you write a component or any styling.

```bash
npx shadcn add Sentir-intelligence/fivic-ui/theme   # once per app, first
npx shadcn add Sentir-intelligence/fivic-ui/fonts
npx shadcn add Sentir-intelligence/fivic-ui/logo
npx shadcn add Sentir-intelligence/fivic-ui/button
npx shadcn add Sentir-intelligence/fivic-ui/select
npx shadcn add Sentir-intelligence/fivic-ui/status-chip
```

Pin to a tag so a change up here can't break a sprint:
`npx shadcn add Sentir-intelligence/fivic-ui/button#v0.2.0`. Check updates
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

## Which step, and what the words say

The scale stops two agents picking different sizes. This stops them writing in
different voices, which is the other half of looking like one product.

| Step | Where it goes |
| --- | --- |
| `title` | the screen's own name, once |
| `heading` | the one thing a screen or a dialog opens on |
| `subheading` | a row title or a card title, the thing you scan for |
| `body` | prose |
| `body-sm` | dense UI, so rows, chat, tables |
| `label` | buttons, tabs, form field labels |
| `caption` | meta under a title, counts, timestamps, the line nobody has to read |
| `overline` | section labels, three words at most |

`title-lg`, `display` and `display-lg` aren't on a working screen yet. If you
find yourself reaching for one, that's worth a conversation rather than a
decision.

`caption` carries 2% tracking, which puts a gap after the last letter as well
as between them. Anything centred inside a fixed round or square box, initials
in an avatar above all, wants that tracking at zero.

Sentence case everywhere. `overline` is the only uppercase in the system and
the token carries it, so write "What's in it" and let the step do the rest.
Never add `uppercase` yourself. Never Title Case either, not on a button, not
on a tab, not on a column header. Document names, folder names and codes keep
whatever casing they arrived with, so `GA-410` and `Unsorted` stay put.

Name the work, not the software. RFIs rather than RFI Tracker, Revisions
rather than Revision Manager. Tracker and manager are words about software and
nobody doing the job says them. A button that does something opens with the
verb: Create take-off, Add to project, Raise an RFI.

Nothing shouts. Skip the exclamation marks, and keep warning words off
anything that isn't a warning. Where a count is the point, put it in the label
rather than a badge next to it, so `Questions 10` and `RFIs 15`.

## The density is deliberate

Controls are 32px (`--size-control-md`) instead of shadcn's 36px, and table
rows are 36px. Up and down space is the scarcest thing on these screens.
Don't put the shadcn defaults back because something looks cramped next to an
unstyled component.

## Disabled is a token, never an opacity

`opacity-50` on a control drops the whole thing toward whatever sits behind
it, so the same disabled button reads one way on a card and another on a
sunken panel, and nothing in the theme has a say in it. Use `bg-disabled` and
`text-disabled-foreground`, which are 3.03:1 in light and 3.37:1 in dark:
plainly off, still readable. In Figma it is the `State=disabled` variant, not
an opacity you type into the right hand panel.

Disabled also drops the variant. A disabled destructive button is not a
quieter red, it is the same inert slab as every other disabled button, because
the only thing it still has to say is that you cannot press it. Ghost is the
exception and keeps its transparent fill, since a slab would make it louder
switched off than switched on.

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

An icon before the label is just `children`. An icon after it is the
`trailingIcon` prop, and it is for a button that opens something rather than
doing something, so a chevron down on a button with a menu behind it and very
little else. Two icons on one control is already one too many. In Figma the
same thing is the `Trailing icon` boolean on the Button set, which defaults
off, alongside `Icon` for the leading one, which defaults on. Don't fork
Button to get a chevron on the end of it.

## If you're in Figma rather than code

Everything above still applies. What changes is that nothing installs, so the
file and its pieces get named here instead.

The code below is the Figma plugin API, which is what the Figma MCP's
`use_figma` runs. Load the figma-use guidance before your first call to it.

**Platform**, fileKey `01cohbqiutxB8qfCr3ynOU`, is the design file.

- **Components** holds every component. Use instances. Don't draw new ones,
  and don't add a component without being asked.
- **Icons** holds the lucide set at 16px. Instance them rather than pasting
  SVG.
- **Page 1** is the desktop screens at 1440x900 and **Mobile** is the phone
  ones at 390x844. Match what's already there.

Type is the eleven `fivic/*` text styles and nothing else, with no local
overrides. Colour is always a bound variable rather than a raw fill, so
`figma.variables.setBoundVariableForPaint`.

Every screen exists in light and dark, and each frame pins its own mode:

```js
const COL = "VariableCollectionId:87b69486f840c6b8222ede7a2f811697baa31bb9/1354:16"
const col = await figma.variables.getVariableCollectionByIdAsync(COL)
frame.setExplicitVariableModeForCollection(col, "372:1")  // light
frame.setExplicitVariableModeForCollection(col, "373:0")  // dark
```

Build the light one, get it right, then clone it and flip the mode. That
collection lives in the library file, `FIaUzKDXGZ6sW4Gca8GlAO`, which is read
only, so `getLocalVariableCollectionsAsync` comes back empty and you need the
id above.

`--input` is a border colour, not a background. Fill a field with it and you
get a grey slab. Take a field's fill off the Input component.

A dropdown trigger is a Select, and it is built to match Input rather than
Button, because a control holding a value you chose should look like the
controls holding values you typed. Bordered inside a toolbar, `ghost` inside a
table cell, where a border would draw a box around one column and `text-label`
would make the figure smaller than the numbers either side of it. Ghost sets
no type step on purpose, so it takes whatever the cell is using.

### Six things that cost an hour each

- `resize()` after setting layout sizing modes resets them to FIXED. Size
  first, then the modes.
- Hidden children aren't in `instance.children`, so you can't find one and
  unhide it. Optional parts are BOOLEAN component properties bound to
  `visible`, toggled with `setProperties`.
- `insertChild` inside an instance throws. You can't reorder an instance's
  children, so design around it.
- Text truncates rather than wraps if you only set `HEIGHT` and `FILL`. Do
  `textAutoResize = "NONE"`, `resize(w, 20)`, `textAutoResize = "HEIGHT"`,
  append it, then `layoutSizingHorizontal = "FILL"`.
- Fonts have to be loaded before you set `characters`. Inter is
  `"Semi Bold"` with a space and Bai Jamjuree is `"SemiBold"` without one.
- `figma.setCurrentPageAsync(page)`. Assigning `figma.currentPage` does
  nothing.

Screenshot every frame you touch and look at it before you call it done. A
good half of what goes wrong here renders a perfectly healthy node tree.

Publishing the library is the one job that goes back to a person. There's no
method for it, somebody has to do it in the Figma UI, and until they do, a
changed variable never reaches the Platform file.

## Extend upstream, don't fork

If a component needs a new variant, add the variant in
`Sentir-intelligence/fivic-ui` so everyone gets it. A local one off edit is
fine, it should just be rare, and flag it so it gets pushed back up.
