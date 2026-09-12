# FIVIC UI

The design system for FIVIC OS, the operating system Sentir is building for
Flooring Innovations Victoria. It's a shadcn registry, and the registry is
just this public GitHub repo. No build, no deploy, no registry server sitting
somewhere. The shadcn CLI reads `registry.json` and pulls the files straight
out of here.

Components get copied into the app rather than installed as a locked package,
so the team owns what it pulls and can extend it, while the brand layer stays
the same everywhere.

This repo is public so private app repos can install from it without tokens.
Only the shared brand layer is open. Application code stays private.

## What's in here

- **Tokens.** The Fivic brand as CSS variables, shipped by the `theme` item.
  Five ramps, the full semantic layer, light and dark, a 14px type scale and
  workspace density.
- **Fonts.** The `@font-face` rules plus a setup time fetch script, because
  FIVIC OS doesn't talk to another origin at runtime.
- **Components.** Branded shadcn components under `registry/fivic/`.
- **Agent rules.** `AGENTS.md`, installed into each app and repo so Claude
  Code and Cursor default to this registry.
- **Catalog.** `registry.json` at the root says what's installable, and it's
  the single source of truth for every token.
- **Preview.** `preview.html` shows the ramps, the type scale, the contrast
  audit and the components in both skins. Open it straight in a browser. Every
  name, quantity and figure on it is invented to exercise the components, none
  of it is Fivic data.

## Brand reference

Worked out in OKLCH from the Fivic logo artwork and fivic.net. Every
foreground and background pair below meets WCAG 2.2 AA in both modes. That's
measured, not assumed.

| Role | Token | Light | Dark |
|------|-------|-------|------|
| Identity, nothing written on it | `--brand` | `#2997B0` | `#3FA7C1` |
| Interactive, carries a label | `--primary` | `#177B91` | `#3FA7C1` |
| Page background | `--background` | `#F8FAFC` | `#061116` |
| Panels and rows | `--card` | `#FFFFFF` | `#152227` |
| Body text | `--foreground` | `#061116` | `#F2F5F6` |
| Search hit inside a document | `--highlight` | `#FCD8AC` | `#7E4A00` |

Brand hue is 217, taken off the logo. Neutrals sit at hue 225, nudged toward
the colour of the nav bar on fivic.net, so the grey surfaces read as Fivic
instead of generic charcoal. Warning is hue 73 to match the amber already on
their site. The cyan on fivic.net (`#00BCD4`) isn't a second brand colour.
It's six degrees off the logo hue at a higher lightness, so it lands on
`brand-400`.

Type is Bai Jamjuree for display at 20px and up, Inter for all UI and data.
Radius is `0.25rem`, which comes off the hard corners in the logo.

### The two rules that matter most

**`--brand` and `--primary` are different colours on purpose.** White text on
the logo teal is 3.42:1 and fails AA. White on `--primary` is 4.91:1 and
passes. The brand colour carries identity, never a label.

**Bai Jamjuree never sets a number.** Its digits are proportional. At 40px
the "1" is 14.3px against 25.8px for the "0", so a column of figures doesn't
line up and can't be scanned. Inter carries every number, with tabular
figures on by default in the base layer.

## For developers: installing in an app

The app has to be on shadcn with Tailwind v4. For a fresh app run
`npx shadcn@latest init` first.

### First time in a project

```bash
npx shadcn add Sentir-intelligence/fivic-ui/theme    # first, and only once
npx shadcn add Sentir-intelligence/fivic-ui/fonts
node scripts/fetch-fonts.mjs                         # pulls down the woff2 files
npx shadcn add Sentir-intelligence/fivic-ui/agents
```

Commit `public/fonts/` afterwards so the build doesn't need the network.

### Day to day

```bash
npx shadcn add Sentir-intelligence/fivic-ui/logo
npx shadcn add Sentir-intelligence/fivic-ui/button
npx shadcn add Sentir-intelligence/fivic-ui/status-chip
```

### In a monorepo

Install `theme`, `fonts` and the components **into the front end package**,
next to its `components.json`. The CLI works out where `src/globals.css` and
`@/components` live from that file, so running it at the root of a monorepo
drops everything in the wrong place.

`agents` is the exception. `AGENTS.md` goes at the **repo root**, next to
`CLAUDE.md`, so every agent session picks it up no matter which package it's
in. Have `CLAUDE.md` point at it rather than repeat it, otherwise the two
drift and you've got two answers to the same question.

### Pin to a tag

```bash
npx shadcn add Sentir-intelligence/fivic-ui/button#v0.1.0
```

Review updates with `npx shadcn add ... --diff` before applying them.

### Using the mark

The mark draws from `currentColor`, so one component covers every context.

```tsx
import { FivicLogo, FivicMark } from "@/components/brand/logo"

<FivicLogo className="h-8 w-auto" />                    {/* brand teal */}
<FivicMark className="h-6 w-auto text-white" />         {/* on dark or a photo */}
<FivicMark className="h-4 w-auto" title={null} />       {/* decorative */}
```

The full lockup isn't in here. The wordmark reverses to white and we couldn't
rebuild it from the raster artwork we were given. Get the vector files off
Fivic and add a `variant="full"` when they land.

## For maintainers

### Change a token

1. Edit the value in the `theme` item in `registry.json`. That's the source
   of truth.
2. Run `node scripts/sync-globals.mjs` to rebuild `app/globals.css`. Don't
   edit that file by hand, the script overwrites it. CI can guard it with
   `node scripts/sync-globals.mjs --check`.
3. Add the token to **both** `light` and `dark`. A token that only exists in
   one mode puts one theme's text on the other theme's background.
4. Validate, commit and tag.

```bash
npx shadcn registry validate
node scripts/sync-globals.mjs --check
git commit -am "feat(theme): add --surface-overlay"
git tag v0.2.0 && git push --tags
```

### Add a component

Put the file under `registry/fivic/`, then register it in `registry.json`
with `name`, `type`, `title`, `description` and `files`. The description is
what the CLI and the coding agents read when they're deciding whether to use
it, so write it for them. Say what it's for and what's unusual about it, not
just what it's called.

## For coding agents

Install `Sentir-intelligence/fivic-ui/agents` into every FIVIC repo. It drops
an `AGENTS.md` covering registry first, theme ordering, the `--brand` versus
`--primary` split, no colour values in components, tabular numbers, the 20px
typeface boundary, density, both modes in one commit, and the no third party
requests rule.

## Status

`v0.1.0`, draft. Still open:

- Fivic's vector logo artwork, for the full lockup.
- Chart colours are provisional. Five hues are reserved and they pass
  contrast, but the series palette should be settled against real quote and
  pipeline data rather than guessed at now.
- Domain components, so the document row, the citation, the quantity table,
  aren't here yet on purpose. They wait until the chat surface is settled, so
  the vocabulary comes out of the real workflow instead of being invented.
