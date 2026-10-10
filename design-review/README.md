# Design review

Design directions for the website, packaged as **one self-contained HTML file** (fonts and logo embedded) that can be
emailed, attached or opened by double-click, offline.

```bash
node design-review/build.mjs round1   # first five directions
node design-review/build.mjs round2   # second round: Siluet, Ilmə, Alov (with the new logo)
node design-review/build.mjs round7   # seventh round: the whole logo ignites; arcs never cross the letters; mosque redrawn
node design-review/build.mjs round6   # sixth round: flames emerge through a feathered wipe, one clean skyline
node design-review/build.mjs round5   # fifth round: Siluet, logo ignites, then blue/red/green flames, calm sway
node design-review/build.mjs round4   # fourth round: Siluet only, with real fire
node design-review/build.mjs round3   # third round: refined Alov, quicker Ilmə, refined Siluet (logo colours, phone-first motion)
```

Output goes to `design-review/dist/` (generated, not committed).

- `shared/common.js` / `common.css`: springs, drag with momentum, the draggable Join sheet, the picker, the "Choose this design" flow
- `shared/logo.js`: the logo as vector parts, in solid / "draw" / crocheted ("yarn") versions, plus flames that lean toward the pointer
- `shared/crochet.js` / `crochet.css`: crocheted scrollbar, moon and star, stitched dividers, scroll-reveal
- `assets/logo-mark.svg` + `logo-paths.json`: the logo traced from the supplied PDF with `tools/trace-logo.py` and `tools/build-logo.py`
  (needs `pip install pillow numpy potracer`). The wordmark is set in live text (Montserrat).
- `round1/`, `round2/`, `round3/`: one file pair per design; `round.json` lists the fonts to embed
- Sample events and the sample episode are placeholders for design purposes only.

`src/prototypes/` in the app is an earlier dev-only round (Halı, Kaspi, Alov).
