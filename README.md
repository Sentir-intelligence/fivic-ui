# FIVIC UI

The design system for FIVIC OS, the operating system sentir is building for
Flooring Innovations Victoria. It's a shadcn registry, and the registry is
just this public github repo, so there's nothing to build, nothing to deploy
and no server to keep running. The shadcn CLI reads `registry.json` and pulls
files straight out of here.

Components get copied into the app instead of installed as a locked package,
so the team owns what it pulls and can change it, and the brand layer still
stays the same everywhere.

This repo is public so private app repos can install from it without tokens.
Only the brand layer is open, application code stays private.

## What's in here

- **Tokens.** The fivic brand as CSS variables, shipped by the `theme` item.
  Five ramps, every named colour in light and dark, a 14px type scale and
  tighter spacing than shadcn ships.
- **Fonts.** The `@font-face` rules and a script you run once at setup,
  because a FIVIC app never calls out to another server.
- **Components.** Branded shadcn components under `registry/fivic/`.
- **Agent rules.** `AGENTS.md`, installed into each app and repo so Claude
  Code and Cursor reach for this registry first. It briefs an agent working
  in the Figma file too, which is why it carries the file keys.
- **Catalog.** `registry.json` at the root says what's installable, and it's
  where every token actually lives.
- **Preview.** `preview.html` shows the ramps, the type scale and the
  components in both skins. Open it straight in a browser. Every name,
  quantity and figure on it is made up to give the components something to
  hold, none of it is fivic data.

## Brand reference

Worked out in OKLCH from the fivic logo artwork and fivic.net. Every pair
below meets WCAG 2.2 AA in both modes. That's measured, not assumed.

| Role | Token | Light | Dark |
|------|-------|-------|------|
| Identity, nothing written on it | `--brand` | `#2997B0` | `#3FA7C1` |
| Anything carrying a label | `--primary` | `#177B91` | `#3FA7C1` |
| Page background | `--background` | `#F8FAFC` | `#061116` |
| Panels and rows | `--card` | `#FFFFFF` | `#152227` |
| Body text | `--foreground` | `#061116` | `#F2F5F6` |
| Search hit inside a document | `--highlight` | `#FCD8AC` | `#7E4A00` |

Brand hue is 217, taken off the logo. The greys sit at hue 225, pulled a
little toward the colour of the nav bar on fivic.net so they read as fivic
rather than as flat charcoal. Warning is hue 73, which matches the amber
already on their site. The cyan on fivic.net (`#00BCD4`) isn't a second brand
colour, it's six degrees off the logo hue and lighter, so it lands on
`brand-400`.

Type is Bai Jamjuree for display at 20px and up, Inter for everything else.
Radius is `0.25rem`, off the hard corners in the logo. Labels are sentence
case throughout, and `text-overline` is the only step that shouts, which it
does itself.

### The two rules that matter most

**`--brand` and `--primary` are different colours on purpose.** White on the
logo teal is 3.42:1 and fails AA. White on `--primary` is 4.91:1 and passes.
The brand colour carries identity, never a label.

**Bai Jamjuree never sets a number.** Its digits are all different widths. At
40px the "1" is 14.3px against 25.8px for the "0", so a column of figures
doesn't line up and can't be read by shape. Inter carries every number, with
tabular figures on by default.

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
npx shadcn add Sentir-intelligence/fivic-ui/select
npx shadcn add Sentir-intelligence/fivic-ui/status-chip
```

### In a monorepo

Install `theme`, `fonts` and the components **into the front end package**,
next to its `components.json`. The CLI works out where `src/globals.css` and
`@/components` live from that file, so running it at the root of a monorepo
drops everything in the wrong place.

`agents` is the exception. `AGENTS.md` goes at the **repo root**, next to
`CLAUDE.md`, so every agent session picks it up whichever package it's in.
Have `CLAUDE.md` point at it rather than repeat it, or the two drift and
you've got two answers to the same question.

### Pin to a tag

```bash
npx shadcn add Sentir-intelligence/fivic-ui/button#v0.2.0
```

Check updates with `npx shadcn add ... --diff` before applying them.

### Using the mark

The mark draws from `currentColor`, so one component covers every context.

```tsx
import { FivicLogo, FivicMark } from "@/components/brand/logo"

<FivicLogo className="h-8 w-auto" />                    {/* brand teal */}
<FivicMark className="h-6 w-auto text-white" />         {/* on dark or a photo */}
<FivicMark className="h-4 w-auto" title={null} />       {/* decorative */}
```

The full lockup isn't in here. The wordmark turns white, so there was nothing
to trace on the white artwork we were given. Get the vector files off fivic
and add a `variant="full"` when they land.

## For maintainers

### Change a token

1. Edit the value in the `theme` item in `registry.json`. That's where tokens
   live.
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
what the CLI and the coding agents read when they're working out whether to
use it, so write it for them. Say what it's for and what's odd about it, not
just what it's called.

## For agents

Install `Sentir-intelligence/fivic-ui/agents` into every FIVIC repo. It drops
an `AGENTS.md` covering registry first, theme ordering, the `--brand` against
`--primary` split, no colour values in components, tabular numbers, the 20px
typeface boundary, which type step goes where, sentence case, density, both
modes in one commit, and the rule about not calling out to another server.

The same file briefs an agent working in Figma rather than in code. Its last
section carries the Platform file key, what sits on each page, the variable
mode collection and the plugin API traps that cost an hour each. Nothing
installs in Figma, so pointing an agent at this one file and the file key is
the whole briefing:

```
Read github.com/Sentir-intelligence/fivic-ui/blob/main/registry/rules/AGENTS.md
and follow it. The components and screens are in the Figma Platform file,
01cohbqiutxB8qfCr3ynOU.
```

## Status

`v0.2.0`, draft. Still open:

- Fivic's vector logo artwork, for the full lockup.
- Chart colours are a placeholder. Five hues are reserved and they pass
  contrast, but the set should be settled against real quote and pipeline
  data rather than guessed at now.
- Domain components are designed and not yet written. DocRow, FolderRow,
  Citation, QuestionCard, RfiRow, RfiAnswer and RevisionCard all sit in the
  Figma file and none of them are in the registry. They come across once the
  screens stop moving, so the props come out of a built page rather than a
  mockup. The quantity table is the one that hasn't been designed at all.
- `title-lg`, `display` and `display-lg` aren't on a working screen. Three
  steps earning nothing so far. Either something needs them or they come out,
  before somebody reaches for one by accident.
