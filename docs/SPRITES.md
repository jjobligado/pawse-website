# Cat Sprites

All companion sprites live in `public/sprites/`, served at `/sprites/<file>`.

## Naming

```
{cat}-{view}-{action}[-{n}][-sheet].png
```

| Part | Values | Meaning |
|---|---|---|
| `cat` | `tux`, `ginger`, `void` | The companion's product name (Tuxedo, Orange, Black in the app's source files) |
| `view` | `body` | Full body, sitting (64px frames) |
| | `head` | Head peeking up from the bottom edge (64px frames) |
| | `portrait` | Close-up head at an angle, for cards (64px frames) |
| | `mini` | Small full-body cat used on the homepage (512px frames) |
| `action` | `idle` | Resting / blinking |
| | `focus` | During a focus session (Tux sips from a mug, Ginger naps, Void reads) |
| | `break` | During a break (Tux grooms, Ginger does zoomies, Void does a shadow poof) |
| | `peek` | Head peeking and looking around |
| | `tap` | Reaction when the visitor clicks/taps the cat |
| `n` | `1`–`4` | A single frame pulled out of a sheet |
| `-sheet` | | Horizontal strip of square frames, left to right. Without it, the file is one still image |

Examples: `ginger-body-break-sheet.png` (Ginger's zoomies animation), `tux-body-idle.png` (Tux sitting, still).

## Rules

- Lowercase, hyphens only, no spaces or underscores.
- Every still that has a matching sheet uses the same name without `-sheet`.
- Render with `image-rendering: pixelated` at whole-number scales (64px → 128, 192, 256) so pixels stay crisp.
- Animate sheets with CSS `steps(<frames>)` on `background-position`; respect `prefers-reduced-motion` by showing the still.

## Sheets

| File | Frame | Frames |
|---|---|---|
| `ginger-body-break-sheet.png` | 64×64 | 9 |
| `ginger-body-focus-sheet.png` | 64×64 | 3 |
| `ginger-body-idle-sheet.png` | 64×64 | 5 |
| `ginger-head-peek-sheet.png` | 64×64 | 4 |
| `ginger-mini-tap-sheet.png` | 512×512 | 8 |
| `ginger-portrait-idle-sheet.png` | 64×64 | 3 |
| `tux-body-break-sheet.png` | 64×64 | 10 |
| `tux-body-focus-sheet.png` | 64×64 | 5 |
| `tux-body-idle-sheet.png` | 64×64 | 4 |
| `tux-head-peek-sheet.png` | 64×64 | 4 |
| `tux-mini-tap-sheet.png` | 512×512 | 10 |
| `tux-portrait-idle-sheet.png` | 64×64 | 4 |
| `void-body-break-sheet.png` | 64×64 | 7 |
| `void-body-focus-sheet.png` | 64×64 | 5 |
| `void-body-idle-sheet.png` | 64×64 | 5 |
| `void-head-peek-sheet.png` | 64×64 | 4 |
| `void-mini-tap-sheet.png` | 512×512 | 12 |
| `void-portrait-idle-sheet.png` | 64×64 | 3 |

## Stills without a matching sheet frame

`*-mini-idle.png`, `*-portrait-idle.png` (Ginger, Void), `ginger-body-break.png` and `ginger-body-focus.png` are drawn separately rather than cut from a sheet. `void-mini-idle.png` is identical to `public/images/black-cat.png` currently used on the homepage.

Missing compared with Ginger: `tux-body-break.png` and `void-body-break.png` (no still for the break pose).
