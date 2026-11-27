# Hero Room Ideas

A backlog of ideas for the hero "room": the window view, the laptop and the desk.
Started 2026-11-27. Nothing here is built unless it is marked as being built.

Status key: **Loved** = picked to build next · **Parked** = keep for later · **Not chosen** = kept for reference

---

## Window view

The depth-plane perspective fix is done (`fix/window-view-depth`). Ideas 2–6 are built on stacked
branches, waiting to be merged (Nov 27). The scroll perspective was then reworked
(`fix/sky-independent-depth`). The sky backdrop holds still, and each cloud, the sun, the moon, the
birds, the hills, the town and each visitor moves on its own depth and curve, so nothing slides as one block.

| # | Idea | Status |
|---|------|--------|
| W1 | **Lean to look:** on desktop, the mouse nudges the view sideways a few percent, as if leaning toward the glass | Dropped: the view follows scroll only, not the cursor |
| W2 | **Wider sun path along the top:** the sun crosses the top of the window from right to left over the day, staying above the headline | Built (`feat/sky-sun-top-arc`) |
| W3 | **Golden hour:** when the sun is low, warm the bottom of the sky and tint the edges of the clouds | Dropped (user decision, Nov 27) |
| W4 | **The town at night:** lit windows switch on one by one at dusk, stay on all night and go out through dawn (no late-night thinning, user decision Nov 27) | Built (`feat/sky-town-lights`, changed on `experiment/sky-updates`) |
| W5 | **Occasional visitors:** a rare plane by day, a shooting star at night, light pixel rain on some days | Built: plane by day, shooting stars at night. Rain dropped: no weather (decided Nov 27) |
| W6 | **Glass that reacts to the sky:** the glare on the open panels follows the sun; the wall light below the window shifts with it | Built (`feat/sky-glass-light`) |
| W7 | **Cats that notice:** the sill cat turns its head to follow a passing bird | Parked |

---

## Laptop and desk

### Loved

| # | Idea | Notes |
|---|------|-------|
| 2 | **A soft landing:** when the laptop lands on the desk, the felt mat dips slightly and a puff of pixel dust rises from under it, then it settles with a tiny bounce | Motion |
| 3 | **The camera leans in:** over the desk section the viewing angle slowly drops from looking down on the desk to eye level with the screen, as if you sat down. Ends with the screen filling the frame, leading into How It Works | Motion |
| 5 | **The window light moves across the desk:** the window's rectangle of light (with the shadow of the bars between the panes) sits on the desk, slides with the sun's position, and turns blue-white at night | Motion · pairs with W6 |
| 6 | **Desk props that follow the time of day:** a mug that steams in the morning and turns into tea at night; a small desk lamp that switches on at dusk; a sticky note on the bezel whose text changes by time ("drink water", "go to bed") | Design and props |
| 7 | **Things that show progress:** a stack of pixel notebooks that grows as you scroll; a small desk plant that sprouts a new leaf with each completed section | Design and props |
| 11 | **Lean to look for the desk (scroll-driven):** the desk's viewing angle follows the scroll position, like the window view, so the desk and the window feel like one room in 3D. Not mouse-driven (decided Nov 27). The desk's parts (laptop, mat, props, light) each move on their own, not as one block | Perspective · uses the window's scroll perspective |

### Not chosen (for reference)

| # | Idea | Area |
|---|------|------|
| 1 | **The lid opens as you arrive:** the laptop starts closed, hinges open as you scroll to the desk, and the screen glows on, so the demo video starts the moment it is fully open | Motion |
| 4 | **The keyboard types along with the demo:** keys press down to match the video (a session starting, a task typed, the space bar pausing) | Motion |
| 8 | **Stickers on the lid:** when the laptop is closed, its back shows pixel stickers (the cats, a tomato, a "do not disturb" sign) | Design and props |
| 9 | **A cat on the desk:** a sill cat jumps down to sit on the warm keyboard deck, or swats at the cursor in the demo | Design and props |
| 10 | **A glowing reflection on the desk:** the screen's colour spills onto the mat and changes with the demo (focus blue, break green) | Design and props |
| 12 | **The screen as a second window:** scroll far enough and the camera passes into the screen, where the app's sky continues the window's sky | Perspective |
| 13 | **Two layers of depth in the demo video:** the app UI floats slightly in front of the screen glass and the reflection stays on the glass, so tilting moves them apart | Perspective |
| 14 | **Clickable laptop:** clicking the screen pauses or plays the demo; hovering over keys shows tooltips like "Space = start focus" | Interaction |
| 15 | **A working timer on the screen:** a real, tiny 25-minute timer you can start; if you are still on the page when it ends, a cat stretches on the sill | Interaction |
| 16 | **Cursor as a cat paw:** over the laptop only, with paw prints that fade off the keyboard | Interaction |
| 17 | **The download as part of the scene:** pressing Download plays a pixel progress bar on the laptop screen and a cat dragging a box across the desk | Story and launch |

> **Note:** idea 18 (**Seasons:** snow on the sill in December, petals in spring, a pumpkin in October) is off the list. No weather/snow in the window (decided Nov 27).
