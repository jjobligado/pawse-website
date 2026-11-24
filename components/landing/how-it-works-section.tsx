import type { CSSProperties, ReactNode } from "react";
import PixelStamp, { StampFilters } from "./pixel-stamp";
import type { StampFrame, StampName } from "./pixel-stamps";
import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";
import WallFit from "./wall-fit";

/**
 * The PAWSE loop as four paper step notes on a wall of small notes. Every
 * drawing is a pixel-art rubber stamp pressed into the paper. From lg the
 * wall is a fixed 1120×600 board scaled to fit, and hovering a step note
 * peels its lower corner. Below lg the steps stack (one column on phones,
 * 2×2 on tablets) between two short rows of small notes. Everything except
 * the four step notes is decorative and hidden from assistive tech.
 */

type Paper = "yellow" | "sky" | "mint" | "lavender" | "pink" | "peach" | "cream" | "white";
type Ink = "blue" | "red" | "violet" | "green" | "black";

const STEPS: {
    step: string;
    title: string;
    body: string;
    paper: Paper;
    stamp: StampName;
    frame: StampFrame;
    ink: Ink;
    hand: string;
    /** left, top, rotation on the 1120×600 board */
    pos: [number, number, number];
    stampRot: number;
}[] = [
    { step: "01", title: "Pick Your Companion", body: "Three cats, three paces. Pick who focuses with you.", paper: "yellow", stamp: "tux", frame: "round", ink: "blue", hand: "Tux!", pos: [78, 196, -3], stampRot: 6 },
    { step: "02", title: "Focus with Your Companion", body: "Work alongside your cat’s routine. Zero distractions.", paper: "sky", stamp: "clock", frame: "square", ink: "red", hand: "25:00", pos: [330, 168, 2.2], stampRot: -5 },
    { step: "03", title: "Time to Play and Recharge", body: "Take a breather, play, and see what they have to say.", paper: "mint", stamp: "yarn", frame: "round", ink: "violet", hand: "zoomies", pos: [582, 200, -1.8], stampRot: 4 },
    { step: "04", title: "Watch Your Progress Build", body: "Every session gets logged. Small sessions, big streaks.", paper: "lavender", stamp: "chart", frame: "square", ink: "green", hand: "day 12", pos: [834, 172, 2.8], stampRot: -7 },
];

type Item = { text: ReactNode } | { stamp: StampName; caption?: string };
const T = (text: ReactNode): Item => ({ text });
const S = (stamp: StampName, caption?: string): Item => ({ stamp, caption });

const ITEMS: Item[] = [
    T("drink water!"), T(<s>37 open tabs</s>), T(<s>check email</s>),
    T(<span className="hiw-timer">25:00<small>then 5:00</small></span>),
    T("Tux needs a coffee refill"), T(<><s>doomscroll</s><br />nope.</>),
    T(<>streak:<br /><span className="hiw-big">day 12</span></>),
    T("Ginger did zoomies again"), T("Void was here"), T("4 fish today!"), T("stretch your back"), T("you got this :)"),
    T("one tab only"), T("lo-fi on"), T("nap break?"), T("finish the essay"), T("pet the cat"), T("phone in the drawer"),
    T("deep breath"), T(<s>quick scroll</s>), T("snack o’clock"), T("3 sessions done"), T("be kind to you"), T("purr purr"),
    S("cat"), S("loaf", "zzz"), S("fish", "x4"), S("heart"), S("star", "nice!"), S("mug"),
    S("paw"), S("yarn"), S("tux", "hi!"), S("loaf"), S("fish"), S("sparkle"), S("phone", "away"),
    S("heart", "focus"), S("zzz"), S("clock", "25 min"),
];

const PAPERS: Paper[] = ["yellow", "sky", "mint", "lavender", "pink", "peach", "cream", "white", "yellow", "white", "cream"];
const INKS: Ink[] = ["blue", "red", "violet", "green", "black"];
const MARKS: StampName[] = ["star", "heart", "paw", "sparkle", "fish"];
const PIN_COLORS = ["#2394DF", "#F08AA6", "#7FCB76", "#F5B83D", "#A98BE6"];

type SmallNoteData = {
    item: Item;
    paper: Paper;
    ink: Ink;
    rot: number;
    frame: StampFrame;
    stampRot: number;
    ghost: boolean;
    mark: StampName | null;
    markRot: number;
    press: number;
    fastener: "tape" | "pin" | null;
    pinColor: string;
};

/** Seeded random, so the wall is the same on every render. */
function rng(seed: number) {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const BOARD_W = 1120;
const BOARD_H = 600;

/**
 * The small notes: an 11×6 jittered grid, thinning toward the edges, every
 * note kept whole inside the board. Layout and stamp styling draw from
 * separate random streams so either can change without moving the other.
 */
const WALL: (SmallNoteData & { x: number; y: number; size: number; z: number })[] = (() => {
    const r = rng(11);
    const r2 = rng(97);
    const cols = 11;
    const rows = 6;
    const cw = BOARD_W / cols;
    const ch = BOARD_H / rows;
    const out: (SmallNoteData & { x: number; y: number; size: number; z: number })[] = [];
    let k = 0;
    let press = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const size = 112 + r() * 32;
            let x = (col + 0.5) * cw + (r() - 0.5) * 40;
            let y = (row + 0.5) * ch + (r() - 0.5) * 34;
            const e = Math.max(Math.abs(x - BOARD_W / 2) / (BOARD_W / 2), (Math.abs(y - BOARD_H / 2) / (BOARD_H / 2)) * 0.9);
            const keep = e < 0.55 ? 1 : 1 - (e - 0.55) * 1.5;
            const skip = r() > keep;
            const rot = (r() - 0.5) * 14;
            const paper = PAPERS[Math.floor(r() * PAPERS.length)];
            const f = r();
            const pinColor = PIN_COLORS[Math.floor(r() * PIN_COLORS.length)];
            const z = Math.floor(r() * 20);
            const ink = INKS[Math.floor(r2() * INKS.length)];
            const fr = r2();
            const stampRot = (r2() - 0.5) * 18;
            const ghost = r2() < 0.16;
            const markRoll = r2();
            const markName = MARKS[Math.floor(r2() * MARKS.length)];
            const markRot = (r2() - 0.5) * 30;
            if (skip) continue;
            const m = size * 0.6 + 4;
            x = Math.min(BOARD_W - m, Math.max(m, x));
            y = Math.min(BOARD_H - m, Math.max(m, y));
            const item = ITEMS[(k++ * 7 + row) % ITEMS.length];
            const isStamp = "stamp" in item;
            out.push({
                x: x - size / 2,
                y: y - size / 2,
                size,
                z,
                item,
                paper,
                ink,
                rot,
                frame: fr < 0.3 ? "square" : fr < 0.5 ? "round" : "none",
                stampRot,
                ghost,
                mark: !isStamp && markRoll < 0.24 ? markName : null,
                markRot,
                press: press++,
                fastener: f < 0.22 ? "tape" : f < 0.38 ? "pin" : null,
                pinColor,
            });
        }
    }
    return out;
})();

/** Small notes above and below the stacked steps (below lg). */
const STRIP_NOTE = (item: Item, paper: Paper, ink: Ink, rot: number, frame: StampFrame = "none"): SmallNoteData => ({
    item, paper, ink, rot, frame, stampRot: rot * -1.5, ghost: false, mark: null, markRot: 0, press: 0, fastener: null, pinColor: "",
});
const STRIP_TOP = [
    STRIP_NOTE(T("drink water!"), "pink", "blue", -6),
    STRIP_NOTE(S("fish", "x4"), "cream", "blue", 4, "round"),
    STRIP_NOTE(T(<s>37 open tabs</s>), "peach", "red", -3),
];
const STRIP_BOTTOM = [
    STRIP_NOTE(S("heart", "focus"), "white", "red", 5),
    STRIP_NOTE(T(<>streak:<br /><span className="hiw-big">day 12</span></>), "lavender", "violet", -4),
    STRIP_NOTE(S("loaf", "zzz"), "sky", "violet", 6, "square"),
];

const vars = (v: Record<string, string>) => v as CSSProperties;

function SmallNote({ note, style, className = "" }: { note: SmallNoteData; style?: CSSProperties; className?: string }) {
    const { item } = note;
    let inner: ReactNode;
    if ("stamp" in item) {
        const scale = note.frame === "none" ? (item.caption ? 78 : 86) : item.caption ? 92 : 100;
        inner = (
            <>
                <div className="hiw-art">
                    <div className="hiw-stamp-box" style={{ width: `${scale}%`, height: `${scale}%`, rotate: `${note.stampRot}deg` }}>
                        <PixelStamp name={item.stamp} frame={note.frame} press={note.press} ghost={note.ghost} />
                    </div>
                </div>
                {item.caption && <span>{item.caption}</span>}
            </>
        );
    } else {
        inner = item.text;
    }
    return (
        <div
            className={`hiw-note ${className}`}
            style={{ ...vars({ "--paper": `var(--hiw-${note.paper})`, "--ink-c": `var(--hiw-ink-${note.ink})` }), rotate: `${note.rot}deg`, ...style }}
        >
            <div className="hiw-paper">
                <div className="hiw-content">{inner}</div>
                {note.mark && (
                    <div className="hiw-mark" style={{ rotate: `${note.markRot}deg` }}>
                        <PixelStamp name={note.mark} press={note.press} />
                    </div>
                )}
            </div>
            {note.fastener === "tape" && <i className="hiw-tape" />}
            {note.fastener === "pin" && <i className="hiw-pin" style={vars({ "--pin-c": note.pinColor })} />}
        </div>
    );
}

const CURL = (
    <svg className="hiw-curl" viewBox="0 0 236 236" aria-hidden="true" focusable="false">
        <path className="hiw-cast" />
        <path className="hiw-under" />
        <path className="hiw-back" />
        <path className="hiw-shade" />
    </svg>
);

function StepNote({ s, i, onWall }: { s: (typeof STEPS)[number]; i: number; onWall: boolean }) {
    const style: CSSProperties = {
        ...vars({ "--paper": `var(--hiw-${s.paper})`, "--ink-c": `var(--hiw-ink-${s.ink})` }),
        rotate: `${s.pos[2]}deg`,
        ...(onWall ? { left: s.pos[0], top: s.pos[1], zIndex: 50 + i } : {}),
    };
    return (
        <li className="hiw-note hiw-step" style={style}>
            <div className="hiw-paper">
                <div className="hiw-content">
                    <div className="hiw-step-head">
                        <span>{s.step}</span>
                        <span className="hiw-step-art" style={{ rotate: `${s.stampRot}deg` }}>
                            <PixelStamp name={s.stamp} frame={s.frame} press={i} />
                        </span>
                    </div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    <span className="hiw-hand" aria-hidden="true">
                        {s.hand}
                    </span>
                </div>
            </div>
            {onWall && CURL}
            <i className="hiw-tape hiw-tape-wide" />
        </li>
    );
}

export default function HowItWorksSection() {
    return (
        <Section id="how-it-works">
            <SectionTitle>How It Works</SectionTitle>
            <SectionSubtitle className="text-center text-balance">
                From choosing your companion to seeing your progress grow.
            </SectionSubtitle>

            <div className="hiw">
                <StampFilters />

                {/* lg+: the wall, scaled to fit */}
                <WallFit width={BOARD_W} className="hiw-wall hidden lg:block">
                    <div className="hiw-board">
                        <div className="hiw-small" aria-hidden="true">
                            {WALL.map((n, idx) => (
                                <SmallNote key={idx} note={n} style={{ left: n.x, top: n.y, width: n.size, height: n.size, zIndex: n.z }} />
                            ))}
                        </div>
                        <ol className="hiw-steps">
                            {STEPS.map((s, i) => (
                                <StepNote key={s.step} s={s} i={i} onWall />
                            ))}
                        </ol>
                    </div>
                </WallFit>

                {/* Below lg: the steps stacked between two rows of small notes */}
                <div className="hiw-stack flex flex-col items-center gap-7 lg:hidden">
                    <div className="hiw-strip" aria-hidden="true">
                        {STRIP_TOP.map((n, idx) => (
                            <SmallNote key={idx} note={n} />
                        ))}
                    </div>
                    <ol className="hiw-steps grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-12">
                        {STEPS.map((s, i) => (
                            <StepNote key={s.step} s={s} i={i} onWall={false} />
                        ))}
                    </ol>
                    <div className="hiw-strip" aria-hidden="true">
                        {STRIP_BOTTOM.map((n, idx) => (
                            <SmallNote key={idx} note={n} />
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
}
