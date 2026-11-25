import type { CSSProperties } from "react";
import type { Bend } from "./paper-bends";
import { BentPaper, S, SmallNote, T, vars, writing, type Item, type SmallNoteData } from "./paper-note";
import PixelStamp from "./pixel-stamp";
import type { StampName } from "./pixel-stamps";
import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";
import type { Ink, Paper } from "./how-it-works-tuning";

/**
 * What's next, on the same paper as How It Works, but as drafts rather than a
 * finished wall: three notes hung from one crooked strip of masking tape, the
 * drawing only half-inked inside a pencilled box, a red SOON stamp pressed on
 * each, and a few loose notes tucked behind. No dense background, so the
 * section reads as a quieter corner of the same wall.
 *
 * Layout is plain CSS (no scaled board), so it reflows with the screen:
 *   phones (under 36rem): one zig-zag column, a tucked note in each empty side
 *   36rem to 64rem: two notes in a row, the third centred below
 *   64rem up: all three in a row; from 75rem loose notes out at the sides
 * Positions per layout are the CSS variables on each note below (see .cs- in
 * app/globals.css). Hovering a note lifts it off the wall, like the steps.
 * Everything but the three notes is decorative and hidden from assistive tech.
 */

type Tuck = { item: Item; paper: Paper; ink: Ink; tilt: number; bend?: Bend; taped?: boolean };

const ITEMS: {
    title: string;
    body: string;
    paper: Paper;
    ink: Ink;
    stamp: StampName;
    hand: string;
    tilt: number;
    bend: Bend;
    /** The masking tape: px off centre and its tilt. */
    tape: [number, number];
    /** The red SOON stamp's tilt. */
    soon: number;
    /** A loose note tucked behind this one. */
    tuck: Tuck;
    /** Where the tucked note sits, from the main note's top-left, per layout: [left, top] px. */
    at: { col: [number, number]; row: [number, number] };
}[] = [
    {
        title: "Save Your Progress",
        body: "Create a profile to safely back up your streaks and history to the cloud.",
        paper: "sky",
        ink: "blue",
        stamp: "cloud",
        hand: "~~poof~~ saved",
        tilt: -2.6,
        bend: "bow",
        tape: [-14, -4],
        soon: -11,
        tuck: { item: S("sparkle", "wip"), paper: "mint", ink: "green", tilt: 8, bend: "curl-r-sm" },
        at: { col: [212, 96], row: [-58, -40] },
    },
    {
        title: "Custom Sessions",
        body: "Set your own focus and break durations to fit your personal workflow.",
        paper: "yellow",
        ink: "red",
        stamp: "sliders",
        hand: "~~25~~ 40 min",
        tilt: 2,
        bend: "curl-r-sm",
        tape: [12, 3],
        soon: 9,
        tuck: { item: T("you pick\nthe pace"), paper: "pink", ink: "red", tilt: -7, taped: true },
        at: { col: [-62, -30], row: [176, -62] },
    },
    {
        title: "Expanded Audio",
        body: "A richer library of ambient purrs, lo‑fi tracks, and low-stimulation alarms.",
        paper: "lavender",
        ink: "violet",
        stamp: "note",
        hand: "more purrs",
        tilt: -1.4,
        bend: "cup",
        tape: [4, -2],
        soon: -7,
        tuck: { item: S("loaf", "zzz"), paper: "cream", ink: "violet", tilt: 6, bend: "cup" },
        at: { col: [212, 112], row: [184, -44] },
    },
];

/** Loose notes out at the wall's sides, on wide screens only: which side, px in from it, px down, size. */
const SIDES: (Tuck & { side: "left" | "right"; inset: number; y: number; size: number })[] = [
    { side: "left", inset: 8, y: 20, size: 136, item: T("ideas pile:\n~~ship v1~~\nlisten to you\nmore purrs?"), paper: "peach", ink: "black", tilt: -4, taped: true },
    { side: "left", inset: 64, y: 196, size: 92, item: S("star", "ooh"), paper: "white", ink: "red", tilt: 5, bend: "curl-l-sm" },
    { side: "right", inset: 14, y: 46, size: 112, item: T("ask beta\nusers?"), paper: "mint", ink: "green", tilt: 5, taped: true, bend: "curl-r-sm" },
    { side: "right", inset: 70, y: 216, size: 88, item: S("heart"), paper: "pink", ink: "red", tilt: -6 },
];

const small = (t: Tuck, press: number): SmallNoteData => ({
    item: t.item,
    paper: t.paper,
    ink: t.ink,
    rot: t.tilt,
    frame: "none",
    stampRot: t.tilt * -1.5,
    ghost: false,
    mark: null,
    markRot: 0,
    press,
    taped: t.taped ?? false,
    bend: t.bend ?? "flat",
});

/** A rubber SOON stamp, pressed in red with the same ink as the drawings. */
function SoonStamp({ tilt, press }: { tilt: number; press: number }) {
    return (
        <svg className="cs-soon" viewBox="0 0 30 12" style={{ rotate: `${tilt}deg` }} aria-hidden="true" focusable="false">
            <g filter={`url(#stamp-press-${press % 4})`}>
                <rect x="0.7" y="0.7" width="28.6" height="10.6" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <rect x="2.1" y="2.1" width="25.8" height="7.8" rx="0.6" fill="none" stroke="currentColor" strokeWidth="0.45" />
                <text x="15" y="8.55" textAnchor="middle" fill="currentColor">
                    SOON
                </text>
            </g>
        </svg>
    );
}

export default function ComingSoonSection() {
    return (
        <Section id="coming-soon">
            <SectionTitle>Coming Soon</SectionTitle>
            <SectionSubtitle className="text-center text-balance">
                We&apos;re just getting started. Here&apos;s a sneak peek at what&apos;s
                next for PAWSE.
            </SectionSubtitle>

            <div className="hiw cs-wall">
                <div className="cs-sides" aria-hidden="true">
                    {SIDES.map((n, i) => (
                        <SmallNote key={i} note={small(n, i + 1)} style={{ [n.side]: n.inset, top: n.y, width: n.size, height: n.size }} />
                    ))}
                </div>

                <ul className="cs-notes">
                    {ITEMS.map((it, i) => (
                        <li
                            key={it.title}
                            className="cs-item"
                            style={vars({
                                "--tcx": `${it.at.col[0]}px`,
                                "--tcy": `${it.at.col[1]}px`,
                                "--trx": `${it.at.row[0]}px`,
                                "--try": `${it.at.row[1]}px`,
                            })}
                        >
                            <SmallNote note={small(it.tuck, i + 2)} className="cs-tuck" />
                            <div
                                className="hiw-note hiw-step cs-note"
                                style={vars({ "--paper": `var(--hiw-${it.paper})`, "--ink-c": `var(--hiw-ink-${it.ink})`, "--tilt": `${it.tilt}deg`, "--z": String(10 + i) })}
                            >
                                <BentPaper bend={it.bend}>
                                    <div className="hiw-content">
                                        <div className="hiw-step-head">
                                            <span>NEXT · 0{i + 1}</span>
                                            <span className="hiw-step-art cs-art" aria-hidden="true">
                                                <PixelStamp name={it.stamp} press={i + 1} ghost />
                                            </span>
                                        </div>
                                        <h3>{it.title}</h3>
                                        <p>{it.body}</p>
                                        <span className="hiw-hand" aria-hidden="true">
                                            {writing(it.hand)}
                                        </span>
                                    </div>
                                    <SoonStamp tilt={it.soon} press={i} />
                                </BentPaper>
                                <i
                                    className="cs-tape"
                                    style={{ translate: `${it.tape[0]}px 0`, rotate: `${it.tape[1]}deg` } as CSSProperties}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Section>
    );
}
