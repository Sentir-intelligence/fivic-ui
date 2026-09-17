#!/usr/bin/env node
/**
 * Builds app/globals.css out of registry.json.
 *
 *   node scripts/sync-globals.mjs          # write it
 *   node scripts/sync-globals.mjs --check  # fail if it's out of date, for CI
 *
 * registry.json is the source of truth. globals.css is the readable version
 * of it, so nobody has to go digging through JSON to find out what a token
 * is. Edit the JSON, run this, commit both. Don't edit globals.css by hand,
 * this script will just overwrite it.
 */

import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

const ROOT = process.cwd()
const OUT = join(ROOT, "app", "globals.css")
const check = process.argv.includes("--check")

const block = (obj, indent = "  ") =>
  Object.entries(obj)
    .map(([k, v]) =>
      v && typeof v === "object"
        ? `${indent}${k} {\n${block(v, indent + "  ")}\n${indent}}`
        : `${indent}${k}: ${v};`
    )
    .join("\n")

const vars = (obj, indent = "  ") =>
  Object.entries(obj)
    .map(([k, v]) => `${indent}--${k}: ${v};`)
    .join("\n")

/**
 * The @theme inline block maps every semantic token onto a Tailwind colour
 * utility, and it is derived rather than stored. It used to live in the theme
 * item's `css` field, which broke `shadcn add .../theme` outright: that field
 * is for CSS rules, so the CLI's postcss pass read `--color-background:
 * var(--background)` as a rule, dropped the colon and died on
 * `.temp{var(--background)}`. Every entry was only ever `--color-<k>:
 * var(--<k>)` over the same keys as cssVars.light, so nothing is lost by
 * generating it here off the one source of truth.
 */
const themeInline = (light) =>
  Object.keys(light)
    .map((k) => `  --color-${k}: var(--${k});`)
    .join("\n")

const reg = JSON.parse(await readFile(join(ROOT, "registry.json"), "utf8"))
const theme = reg.items.find((i) => i.name === "theme")
if (!theme) throw new Error("no theme item in registry.json")

const { cssVars, css } = theme

const out = `/* =============================================================================
   FIVIC OS design tokens

   GENERATED FILE. Don't edit it by hand.
   The source of truth is registry.json. Rebuild this with:

     node scripts/sync-globals.mjs

   This is the readable version of the 'theme' registry item, kept in the repo
   so developers and coding agents can see every token without reading JSON.
   Apps don't copy this file. They install the registry item:

     npx shadcn add Sentir-intelligence/fivic-ui/theme
   ============================================================================= */

@import "tailwindcss";
@import "tw-animate-css";

/* Our own copies. A FIVIC app never calls out to another server. */
@import "./fonts/fonts.css";

@custom-variant dark (&:is(.dark *));

@theme {
${vars(cssVars.theme)}
}

:root {
${vars(cssVars.light)}
}

.dark {
${vars(cssVars.dark)}
}

${[
  `@theme inline {\n${themeInline(cssVars.light)}\n}`,
  ...Object.entries(css).map(([sel, body]) => `${sel} {\n${block(body)}\n}`),
].join("\n\n")}
`

if (check) {
  let current = ""
  try {
    current = await readFile(OUT, "utf8")
  } catch {}
  if (current !== out) {
    console.error("app/globals.css is out of date. Run: node scripts/sync-globals.mjs")
    process.exit(1)
  }
  console.log("app/globals.css is in sync with registry.json")
} else {
  await writeFile(OUT, out)
  console.log(`wrote app/globals.css (${out.length} bytes)`)
}
