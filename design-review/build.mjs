// Bundles a design-review round into ONE self-contained HTML file (fonts and logo embedded),
// so it can be emailed or opened by double-click, offline.
//   node design-review/build.mjs            -> round1
//   node design-review/build.mjs round2     -> round2
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const nm = join(here, "..", "node_modules");
const round = process.argv[2] || "round1";
const roundDir = join(here, round);
const shared = join(here, "shared");
const cfg = JSON.parse(readFileSync(join(roundDir, "round.json"), "utf8"));

const LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
// latin-ext carries Azerbaijani letters such as Ə ə Ğ ğ Ş ş Ç ç
const EXT = "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";

const fonts = [
  { family: "Archivo", pkg: "@fontsource-variable/archivo", file: (s) => `archivo-${s}-wdth-normal.woff2`, weight: "100 900", stretch: "62% 125%" },
  { family: "Fraunces", pkg: "@fontsource-variable/fraunces", file: (s) => `fraunces-${s}-full-normal.woff2`, weight: "100 900" },
  { family: "Bricolage", pkg: "@fontsource-variable/bricolage-grotesque", file: (s) => `bricolage-grotesque-${s}-standard-normal.woff2`, weight: "200 800", stretch: "75% 100%" },
  { family: "InstrumentSans", pkg: "@fontsource-variable/instrument-sans", file: (s) => `instrument-sans-${s}-wght-normal.woff2`, weight: "400 700" },
  { family: "Jost", pkg: "@fontsource-variable/jost", file: (s) => `jost-${s}-wght-normal.woff2`, weight: "100 900" },
  { family: "Montserrat", pkg: "@fontsource-variable/montserrat", file: (s) => `montserrat-${s}-wght-normal.woff2`, weight: "100 900" },
  { family: "InstrumentSerif", pkg: "@fontsource/instrument-serif", file: (s) => `instrument-serif-${s}-400-normal.woff2`, weight: "400", style: "normal" },
  { family: "InstrumentSerif", pkg: "@fontsource/instrument-serif", file: (s) => `instrument-serif-${s}-400-italic.woff2`, weight: "400", style: "italic" },
].filter((f) => cfg.fonts.includes(f.family));

let fontCss = "";
let bytes = 0;
for (const f of fonts) {
  for (const [subset, range] of [["latin", LATIN], ["latin-ext", EXT]]) {
    const data = readFileSync(join(nm, f.pkg, "files", f.file(subset)));
    bytes += data.length;
    fontCss +=
      `@font-face{font-family:"${f.family}";font-style:${f.style ?? "normal"};font-display:swap;font-weight:${f.weight};` +
      (f.stretch ? `font-stretch:${f.stretch};` : "") +
      `src:url(data:font/woff2;base64,${data.toString("base64")}) format("woff2");unicode-range:${range}}\n`;
  }
}

const read = (dir, n) => readFileSync(join(dir, n), "utf8");
const own = readdirSync(roundDir).filter((n) => /^[vr]\d+-.*\.(js|css)$/.test(n)).sort();
const sharedOpt = (n) => (existsSync(join(shared, n)) ? [read(shared, n)] : []);
const css = [read(shared, "common.css"), ...(cfg.logo ? sharedOpt("crochet.css") : []), ...own.filter((n) => n.endsWith(".css")).map((n) => read(roundDir, n))].join("\n");
const logoJs = cfg.logo ? [`window.AZ_LOGO = ${JSON.stringify(Object.fromEntries(Object.entries(JSON.parse(readFileSync(join(here, "assets", "logo-paths.json"), "utf8"))).map(([k, v]) => [k, v.d])))};`] : [];
const js = [
  ...logoJs,
  read(shared, "common.js"),
  ...(cfg.logo ? sharedOpt("logo.js").concat(sharedOpt("crochet.js")) : []),
  ...own.filter((n) => n.endsWith(".js")).map((n) => read(roundDir, n)),
  "try { AZ.start(); } catch (e) { AZ.fail(e && e.message ? e.message : e); }",
].join("\n");

const html = read(shared, "template.html")
  .replace("/*FONTS*/", () => fontCss)
  .replace("/*CSS*/", () => css)
  .replace("/*JS*/", () => js.replace(/<\/script/gi, "<\\/script"));

mkdirSync(join(here, "dist"), { recursive: true });
const out = join(here, "dist", cfg.output);
writeFileSync(out, html);
console.log(`Built ${out}\n  fonts: ${(bytes / 1024).toFixed(0)} KB raw, file: ${(html.length / 1024 / 1024).toFixed(2)} MB, designs: ${own.filter((n) => n.endsWith(".js")).join(", ") || "(none yet)"}`);
