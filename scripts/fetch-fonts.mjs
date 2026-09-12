#!/usr/bin/env node
/**
 * Pulls the FIVIC brand faces down into public/fonts/.
 *
 * Run it once per project, and after that only when you want to refresh the
 * files:
 *
 *   node scripts/fetch-fonts.mjs
 *
 * This runs at SETUP time, not at runtime. The shipped app still doesn't talk
 * to another origin: the woff2 files come off our own origin, and they get
 * committed with the rest of the app.
 *
 * Both families are SIL Open Font License 1.1.
 *   Bai Jamjuree, by Cadson Demak
 *   Inter, by Rasmus Andersson
 *
 * If your network blocks fonts.googleapis.com, grab the two families by hand
 * off fonts.google.com and drop them in public/fonts/ under the names in
 * TARGETS below. Nothing else in the build cares whether this script ran.
 */

import { mkdir, writeFile, access } from "node:fs/promises"
import { join } from "node:path"

const OUT = join(process.cwd(), "public", "fonts")

// Google serves ttf instead of woff2 unless the UA looks modern.
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"

const TARGETS = [
  {
    file: "bai-jamjuree-600.woff2",
    css: "https://fonts.googleapis.com/css2?family=Bai+Jamjuree:wght@600&display=swap",
  },
  {
    file: "bai-jamjuree-700.woff2",
    css: "https://fonts.googleapis.com/css2?family=Bai+Jamjuree:wght@700&display=swap",
  },
  {
    file: "inter-variable.woff2",
    css: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
    variable: true,
  },
]

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function urlsFrom(cssUrl) {
  const res = await fetch(cssUrl, { headers: { "User-Agent": UA } })
  if (!res.ok) throw new Error(`${cssUrl} -> HTTP ${res.status}`)
  const css = await res.text()
  // The latin block is the last @font-face Google writes out, and it's the
  // only one we want. Grab every woff2 URL and keep the last one.
  const urls = [...css.matchAll(/url\((https:\/\/[^)]+\.woff2)\)/g)].map((m) => m[1])
  if (!urls.length) throw new Error(`no woff2 in ${cssUrl}`)
  return urls[urls.length - 1]
}

async function main() {
  await mkdir(OUT, { recursive: true })
  let failed = 0

  for (const t of TARGETS) {
    const dest = join(OUT, t.file)
    if (await exists(dest)) {
      console.log(`skip  ${t.file} (already present)`)
      continue
    }
    try {
      const url = await urlsFrom(t.css)
      const res = await fetch(url, { headers: { "User-Agent": UA } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      await writeFile(dest, buf)
      console.log(`write ${t.file}  ${(buf.length / 1024).toFixed(1)} KB`)
    } catch (err) {
      failed++
      console.error(`FAIL  ${t.file}: ${err.message}`)
    }
  }

  if (failed) {
    console.error(
      `\n${failed} file(s) didn't come down. Grab them by hand off fonts.google.com ` +
        `and save them into public/fonts/ under the names above.`
    )
    process.exitCode = 1
  } else {
    console.log(`\nDone. Commit public/fonts/ so the build doesn't need the network.`)
  }
}

main()
