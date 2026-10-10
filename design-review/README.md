# Design review

Five design directions for the website, packaged as **one self-contained HTML file** (fonts embedded) that can be
emailed, attached or opened by double-click, offline.

Rebuild after editing anything in `src/`:

```bash
node design-review/build.mjs
```

Output: `design-review/dist/azerbaijan-youth-design-review.html` (generated, not committed).

- `src/common.js` / `common.css`: springs, drag with momentum, the draggable Join sheet, the picker, and the "Choose this design" flow
- `src/v1-…` to `v5-…`: one file pair per design (`AZ.variants.push(...)`); the build picks up any `vN-*.js/css`
- Sample events and the sample episode are placeholders for design purposes only.

The `src/prototypes/` folder in the app is an earlier, dev-only round of three designs (Halı, Kaspi, Alov).
