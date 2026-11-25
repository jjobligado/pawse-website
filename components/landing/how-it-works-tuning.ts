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

import type { StampFrame, StampName } from "./pixel-stamps";

export type Paper = "yellow" | "sky" | "mint" | "lavender" | "pink" | "peach" | "cream" | "white";
export type Ink = "blue" | "red" | "violet" | "green" | "black";

/* ------------------------------------------------------------------------ */
/* 1. The four step notes (each is 236 × 236)                               */
/* ------------------------------------------------------------------------ */

export const STEP_LAYOUT = {
    "01": {
        left: 78, //  distance from the board's left edge
        top: 196, //  distance from the board's top edge
        tilt: -3,
        // The stamp in the top-right corner. `top` / `right` nudge it:
        // negative pulls it further up / further right.
        stamp: { size: 62, top: -10, right: -8, tilt: 6 },
    },
    "02": {
        left: 330,
        top: 168,
        tilt: 2.2,
        stamp: { size: 50, top: -4, right: 2, tilt: -4 },
    },
    "03": {
        left: 582,
        top: 200,
        tilt: -1.8,
        stamp: { size: 56, top: -6, right: -2, tilt: 4 },
    },
    "04": {
        left: 834,
        top: 172,
        tilt: 2.8,
        stamp: { size: 50, top: -4, right: 2, tilt: -4 },
    },
} as const;

/* ------------------------------------------------------------------------ */
/* 2. The background notes behind the steps (generated, not hand-placed)    */
/* ------------------------------------------------------------------------ */

export const BACKGROUND = {
    /** Change to any whole number for a completely different (but repeatable) shuffle. */
    seed: 11,
    /** Each note's size is picked between these. */
    noteSize: { min: 112, max: 144 },
    /** How far the notes fan out from the centre. 1 = no fan, 1.2 = 20% wider. */
    spreadX: 1.1,
    spreadY: 1.04,
    /**
     * Density. Notes in the inner part of the board are always kept; past that
     * they thin out toward the edges.
     *   denseCore: how far out (0 = centre, 1 = edge) the wall stays full
     *   fadeRate:  how quickly it thins after that (higher = emptier edges)
     */
    denseCore: 0.55,
    fadeRate: 1.5,
    /** Lower = keeps more notes toward that edge. */
    sideWeight: 0.88, // left / right edges
    topBottomWeight: 0.9, // top / bottom edges
    /** Each note tilts up to this many degrees either way. */
    maxTilt: 7,
    /** Share of notes with washi tape, 0 to 1. */
    tapedShare: 0.38,
};

/* ------------------------------------------------------------------------ */
/* 3. The side notes (only visible where the page is wider than the         */
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
    { side: "left", inset: 10, y: 74, size: 110, tilt: -7, text: "stretch your back", paper: "white", ink: "blue", taped: true },
    { side: "left", inset: 6, y: 222, size: 120, tilt: 5, stamp: "paw", paper: "pink", ink: "red", taped: false },
    { side: "left", inset: 22, y: 372, size: 104, tilt: -4, text: "deep breath", paper: "cream", ink: "black", taped: true },
    { side: "left", inset: 8, y: 516, size: 114, tilt: 6, stamp: "fish", caption: "x4", frame: "round", paper: "sky", ink: "blue", taped: false },
    { side: "right", inset: 12, y: 104, size: 116, tilt: 6, stamp: "star", caption: "nice!", paper: "lavender", ink: "violet", taped: true },
    { side: "right", inset: 24, y: 262, size: 104, tilt: -5, text: "lo-fi on", paper: "peach", ink: "black", taped: false },
    { side: "right", inset: 6, y: 408, size: 120, tilt: 4, stamp: "mug", frame: "square", paper: "mint", ink: "green", taped: true },
    { side: "right", inset: 18, y: 532, size: 100, tilt: -6, text: "purr purr", paper: "yellow", ink: "black", taped: false },
];
