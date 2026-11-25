/**
 * HOW IT WORKS: TUNING
 * ---------------------------------------------------------------------------
 * Every layout number for the wall of notes (lg and up) lives here, so the
 * design can be adjusted without touching the component.
 *
 * How to use: run `npm run dev`, open http://localhost:3000/#how-it-works,
 * change a number below and save. The page updates by itself.
 *
 * Units: px on the wall's core board, which is 1120 wide × 600 tall. The
 * whole board scales down on smaller screens, so these are "full-size" px.
 * Tilt is in degrees: negative leans left (counter-clockwise), positive right.
 *
 * Colours live in app/globals.css (search for --hiw-).
 */

import type { Bend } from "./paper-bends";
import type { StampFrame, StampName } from "./pixel-stamps";

export type Paper = "yellow" | "sky" | "mint" | "lavender" | "pink" | "peach" | "cream" | "white";
export type Ink = "blue" | "red" | "violet" | "green" | "black";

/* ------------------------------------------------------------------------ */
/* 1. The four step notes (each is 236 × 236)                               */
/* ------------------------------------------------------------------------ */

export const STEP_LAYOUT = {
    "01": {
        left: 88, //  distance from the board's left edge
        top: 196, //  distance from the board's top edge
        tilt: -3,
        // The stamp in the top-right corner. `top` / `right` nudge it:
        // negative pulls it further up / further right.
        stamp: { size: 62, top: -10, right: -8, tilt: 6 },
        // How the paper bends: "flat", "bow" (bottom edge lifts), "cup" (sides
        // curl), "curl-r" / "curl-l" (a bottom corner curls up; "-sm" = smaller)
        bend: "bow",
    },
    "02": {
        left: 340,
        top: 168,
        tilt: 2.2,
        stamp: { size: 50, top: -4, right: 2, tilt: -4 },
        bend: "curl-r-sm",
    },
    "03": {
        left: 575,
        top: 200,
        tilt: -1.8,
        stamp: { size: 56, top: -6, right: -2, tilt: 4 },
        bend: "cup",
    },
    "04": {
        left: 824,
        top: 172,
        tilt: 2.8,
        stamp: { size: 50, top: -4, right: 2, tilt: -4 },
        bend: "curl-l-sm",
    },
} as const satisfies Record<string, { bend: Bend } & Record<string, unknown>>;

/* ------------------------------------------------------------------------ */
/* 2. The background notes behind the steps (generated, not hand-placed)    */
/* ------------------------------------------------------------------------ */

export const BACKGROUND = {
    /** Change to any whole number for a completely different (but repeatable) shuffle. */
    seed: 11,
    /** Each note's size is picked between these. */
    noteSize: { min: 112, max: 144 },
    /**
     * The notes are scattered in a rough oval (a spiral, shuffled), piled up in
     * the middle and loosening toward the rim, so the wall reads as a radial
     * cluster rather than a box.
     *   count:        how many notes in the scatter
     *   radiusX / Y:  half the oval's width / height (the board is 1120 × 600)
     *   centerPile:   1 = even spread; higher = more piled up in the middle
     *   messiness:    0 = tidy spiral, 1 = very scattered
     *   raggedEdge:   share of notes dropped near the rim, for an uneven outline
     */
    count: 36,
    radiusX: 545,
    radiusY: 340,
    centerPile: 0.8,
    messiness: 0.7,
    raggedEdge: 0.3,
    /**
     * Breathing room, so the middle doesn't look cramped.
     *   minSpacing: closest two note centres may be, in px (notes are ~128)
     *   maxHidden:  a note this much under the steps (0 to 1) is left out,
     *               since only a sliver of it would show
     */
    minSpacing: 104,
    maxHidden: 0.5,
    /**
     * No paper should show through right around the four steps. Every spot
     * within `gapPad` px of a step is checked; any uncovered spot gets a note.
     */
    gapPad: 46,
    /** Each note tilts up to this many degrees either way. */
    maxTilt: 7,
    /** Share of notes with washi tape, 0 to 1. */
    tapedShare: 0.38,
    /**
     * Calmer background, so the steps stand out without blurring anything.
     *   inkStrength: how strong the writing and stamps on background notes
     *                are (1 = full, like the steps; lower = quieter)
     *   blankShare:  share of background notes left blank (some keep a doodle)
     */
    inkStrength: 0.85,
    blankShare: 0,
    /**
     * Paper colours the background notes draw from. Listing a colour twice
     * makes it twice as common; white and cream are the palest.
     */
    /** Extra notes along the very top and the very bottom of the wall, each. */
    edgeNotes: 7,
    /** How much of each cat photo tucks under other notes (0 = on top of everything). */
    photoTuck: 0.2,
    papers: ["yellow", "sky", "mint", "lavender", "pink", "peach", "yellow", "sky", "pink", "mint", "lavender", "cream", "white"] as Paper[],
    /**
     * How the background notes bend (real notes curl, especially stacked).
     * Relative weights: a higher number means more notes bend that way.
     *   bow: bottom edge lifts   cup: sides curl
     *   curl-r / curl-l: a bottom corner curls up ("-sm" = smaller curl)
     */
    bends: { flat: 3, bow: 3, cup: 2, "curl-r": 2, "curl-l": 2, "curl-r-sm": 2, "curl-l-sm": 2 } satisfies Record<Bend, number>,
};

/* ------------------------------------------------------------------------ */
/* 3. What's written on the background notes                               */
/* ------------------------------------------------------------------------ */

/**
 * One entry per note. New line = "\n". Marks: ~~crossed out~~, **big**.
 * Notes with 3 or more lines are lists: written smaller on a slightly bigger
 * note, each given its own open spot on the wall so it can be read. Keep one-liners under ~30 characters. Anything also
 * used on a side note (section 5) is left off the wall so it doesn't repeat.
 * The pixel-stamp notes are separate (STAMPS in how-it-works-section.tsx).
 */
export const NOTES: string[] = [
    "Tux knocked my pen off the desk. again.",
    "Ginger did zoomies at 3am",
    "Void was here",
    "a group of cats is a \"clowder\"",
    "pet the cat (non-negotiable)",
    "cats sleep ~70% of their lives. goals.",
    "a cat's nose print is unique, like a fingerprint",
    "I'm not procrastinating, I'm loafing",
    "**25:00**\nthen 5:00",
    "finish the essay",
    "~~check email~~",
    "locked in. do not disturb.",
    "you got this :)",
    "small steps still count",
    "done is better than perfect",
    "rest is productive too",
    "drink water!",
    "deep breath",
    "to do:\n~~read ch. 4~~\n~~lab report~~\nmath problem set\nemail prof",
    "sat:\n9am vet (Ginger)\n2pm study @ library\n6pm feed the cats",
    "the cat already ate.\ndo NOT believe her.",
    "**4** days\nuntil finals",
    "meow meow meow",
    "sunday:\n~~laundry~~\n~~groceries~~\n~~clean desk~~\n~~call mom~~\ndone!!",
    "~~buy cat food~~\n~~litter~~\nreturn library books\n~~pay phone bill~~",
    "HIST 101 essay\ndue fri 11:59pm\n1,500 words\n(0 written)",
    "today:\n~~3 focus sessions~~\nflashcards\n~~outline essay~~",
];

/** List notes (3+ lines) are this much bigger than the others. */
export const LIST_NOTE_SCALE = 1.1;

/* ------------------------------------------------------------------------ */
/* 4. Cat photos: printed photos taped on the wall                          */
/* ------------------------------------------------------------------------ */

/**
 * Files live in public/images/cat-memes/. Each print takes the place of one
 * background note, picked automatically: notes that stay fully visible, as
 * far from the steps and from each other as possible (the outer ring).
 * Order matters: if there are fewer good spots than photos, the last ones
 * are left out. Remove a row to drop a photo.
 *
 * `tuck` (0 to 1) is how much of a photo hides under neighbouring notes,
 * like it was pinned up first and covered over time; it defaults to
 * BACKGROUND.photoTuck. The middle of the photo is always kept clear.
 */
export const PHOTOS: { src: string; tilt?: number; tuck?: number }[] = [
    { src: "/images/cat-memes/lock-in.jpg", tilt: -4 },
    { src: "/images/cat-memes/thinking-cat.jpg", tilt: 5 },
    { src: "/images/cat-memes/banana-cat.jpg", tilt: -6 },
    { src: "/images/cat-memes/table-cat.jpg", tilt: 3 },
    { src: "/images/cat-memes/throne-kitten.jpg", tilt: -3 },
    { src: "/images/cat-memes/standing-kitten.jpg", tilt: 6 },
    { src: "/images/cat-memes/muejeje.jpg", tilt: -5 },
];

/* ------------------------------------------------------------------------ */
/* 5. The side notes (only visible where the page is wider than the         */
/*    section; they spread out to the header's edges)                       */
/* ------------------------------------------------------------------------ */

type SideNote = {
    side: "left" | "right";
    /** Gap from that outer edge. Keep it 4 or more so nothing gets cut. */
    inset: number;
    /** Where the note's centre sits, from the top (0 to 600). */
    y: number;
    size: number;
    tilt: number;
    paper: Paper;
    ink: Ink;
    taped: boolean;
    bend?: Bend;
} & (
    | { text: string }
    | { stamp: StampName; caption?: string; frame?: StampFrame }
);

/**
 * Stamps available: cat, loaf, fish, heart, star, mug, paw, yarn, tux,
 * sparkle, phone, zzz, clock, chart. Frames: "none", "round", "square".
 * Add or remove rows freely.
 */
export const SIDE_NOTES: SideNote[] = [
    { side: "left", inset: 10, y: 74, size: 110, tilt: -7, text: "drink water!", paper: "white", ink: "blue", taped: true },
    { side: "left", inset: 6, y: 222, size: 120, tilt: 5, stamp: "paw", paper: "pink", ink: "red", taped: false },
    { side: "left", inset: 22, y: 372, size: 104, tilt: -4, text: "deep breath", paper: "cream", ink: "black", taped: true },
    { side: "left", inset: 8, y: 516, size: 114, tilt: 6, stamp: "fish", caption: "x4", frame: "round", paper: "sky", ink: "blue", taped: false },
    { side: "right", inset: 12, y: 104, size: 116, tilt: 6, stamp: "star", caption: "nice!", paper: "lavender", ink: "violet", taped: true },
    { side: "right", inset: 24, y: 262, size: 104, tilt: -5, text: "meow meow meow", paper: "peach", ink: "black", taped: false },
    { side: "right", inset: 6, y: 408, size: 120, tilt: 4, stamp: "mug", frame: "square", paper: "mint", ink: "green", taped: true },
    { side: "right", inset: 18, y: 532, size: 100, tilt: -6, text: "Void was here", paper: "yellow", ink: "black", taped: false },
];
