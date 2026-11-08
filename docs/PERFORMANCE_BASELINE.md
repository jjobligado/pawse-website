# Performance & Quality Baseline

Recorded **2026-11-08** on branch `chore/pre-motion-prep`, **before** the background and motion redesign, so the cost of new effects can be measured against it.

- Tool: Lighthouse 12 (headless Chrome), production build (`next build` + `next start`), `http://localhost:3010`
- Mobile = Lighthouse default (simulated mid-range phone, 4× CPU slowdown, slow 4G). Desktop = `--preset=desktop`.

## Scores

| | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| **Mobile** | 92 | 96 | 96 | 100 |
| **Desktop** | 100 | 96 | 100 | 100 |

## Core metrics

| | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|
| **Mobile** | 1.3 s | 3.3 s | 80 ms | 0 | 3.1 s |
| **Desktop** | 0.4 s | 0.7 s | 0 ms | 0 | 1.0 s |

## Known findings

- **Accessibility 96**: the only contrast failures are the deliberate, documented exception: white semibold labels on `accent-strong` buttons (3.29:1). See the KNOWN EXCEPTION notes in `app/globals.css`.
- **Mobile LCP 3.3 s is almost entirely render delay (~3 s).** The LCP element is the hero headline ("Done"), which starts at `opacity: 0` and fades in via its entrance animation, so the browser can't count it as painted until the animation runs under the throttled CPU. **For the motion redesign:** animate the headline with transform only (no opacity-from-0) or start it visible; that should bring mobile LCP close to FCP.
- **Images (~70–85 KB potential savings)**: mostly `tuxedo-cat.png` (77 KB, resampled art with 3,397 colors; the other cats are ~2 KB). Re-export it from the source pixel file at 512×512 with no smoothing.
- **Best Practices 96 (mobile)**: "incorrect aspect ratio" on the hidden fish sprites over "Done" (they sit at `scale-0` until hover). A measurement artifact, not a visible issue.
- Fixed while recording this baseline: download buttons used `next/link`, which prefetched `/downloads/*.dmg` as a page and logged 404s in the console. They are plain `<a>` links now (console errors: 0).

## Budget for the motion redesign

Keep, after the new backgrounds and motion land:

- Mobile Performance **≥ 90**, Desktop **≥ 95**
- **CLS = 0** (no layout shift from animations)
- **TBT ≤ 150 ms** on mobile (no heavy per-frame JavaScript)
- Animate only `transform` and `opacity`, and respect `prefers-reduced-motion` (already wired globally)

## How to re-run

```bash
npm run build && npx next start -p 3010
# in another terminal (needs Chrome installed):
npx lighthouse http://localhost:3010 --preset=desktop --view
npx lighthouse http://localhost:3010 --view
```
