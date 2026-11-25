import type { CSSProperties, ReactNode } from "react";
import PixelStamp, { StampFilters } from "./pixel-stamp";
import type { StampFrame, StampName } from "./pixel-stamps";
import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";
import WallFit from "./wall-fit";
import { BACKGROUND as BG, SIDE_NOTES, STEP_LAYOUT, type Ink, type Paper } from "./how-it-works-tuning";

/**
 * The PAWSE loop as four paper step notes on a wall of small notes. Every
 * drawing is a pixel-art rubber stamp pressed into the paper. From lg the
 * wall's core is a fixed 1120×600 board scaled to fit the section, with
 * sparser notes out to the header's edges where the page is wider; hovering a step note
 * peels its lower corner. Below lg the steps stack (one column on phones,
 * 2×2 on tablets) between two short rows of small notes. Everything except
 * the four step notes is decorative and hidden from assistive tech.
 *
 * Layout numbers (positions, sizes, spread, side notes) are in
 * how-it-works-tuning.ts.
 */

const STEPS: {
    step: string;
    title: string;
    body: string;
    paper: Paper;
    stamp: StampName;
    frame: StampFrame;
    ink: Ink;
    hand: string;
}[] = [
    { step: "01", title: "Pick Your Companion", body: "Three cats, three paces. Pick who focuses with you.", paper: "yellow", stamp: "tux", frame: "round", ink: "blue", hand: "Tux!" },
    { step: "02", title: "Focus with Your Companion", body: "Work alongside your cat’s routine. Zero distractions.", paper: "sky", stamp: "clock", frame: "square", ink: "red", hand: "25:00" },
    { step: "03", title: "Time to Play and Recharge", body: "Take a breather, play, and see what they have to say.", paper: "mint", stamp: "yarn", frame: "round", ink: "violet", hand: "zoomies" },
    { step: "04", title: "Watch Your Progress Build", body: "Every session gets logged. Small sessions, big streaks.", paper: "lavender", stamp: "chart", frame: "square", ink: "green", hand: "day 12" },
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
    taped: boolean;
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
 * The small notes behind the steps, scattered radially: a shuffled golden-angle
 * spiral in an oval, piled up in the middle and loosening toward a ragged rim.
 * A second pass then plugs any bare spot right around the steps. Every note is
 * kept whole on the 1120×600 core. Layout and stamp styling draw from separate
 * random streams so either can change without moving the other.
 */
type WallNote = SmallNoteData & { x: number; y: number; size: number; z: number };
const WALL: WallNote[] = (() => {
    const r = rng(BG.seed);
    const r2 = rng(97);
    const cx = BOARD_W / 2;
    const cy = BOARD_H / 2;
    const out: WallNote[] = [];
    // [centre x, centre y, half size] of every note placed, for the gap check
    const boxes: [number, number, number][] = [];
    let press = 0;

    const add = (px: number, py: number, size: number, z: number) => {
        const rot = (r() - 0.5) * 2 * BG.maxTilt;
        const paper = PAPERS[Math.floor(r() * PAPERS.length)];
        const taped = r() < BG.tapedShare;
        const ink = INKS[Math.floor(r2() * INKS.length)];
        const fr = r2();
        const stampRot = (r2() - 0.5) * 18;
        const ghost = r2() < 0.16;
        const markRoll = r2();
        const markName = MARKS[Math.floor(r2() * MARKS.length)];
        const markRot = (r2() - 0.5) * 30;
        const m = size * 0.6 + 4; // keeps the tilted note and its tape whole
        const x = Math.min(BOARD_W - m, Math.max(m, px));
        const y = Math.min(BOARD_H - m, Math.max(m, py));
        const item = ITEMS[(press * 11) % ITEMS.length]; // 11 shares no factor with the list length, so every item shows before any repeats
        boxes.push([x, y, size / 2]);
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
            mark: !("stamp" in item) && markRoll < 0.24 ? markName : null,
            markRot,
            press: press++,
            taped,
        });
    };
    const noteSize = () => BG.noteSize.min + r() * (BG.noteSize.max - BG.noteSize.min);

    const steps = Object.values(STEP_LAYOUT);
    /** Share of a note (centre x, y, side size) that sits under the steps, 0 to 1. */
    const hiddenShare = (x: number, y: number, size: number) => {
        let a = 0;
        for (const s of steps) {
            const w = Math.min(x + size / 2, s.left + 236) - Math.max(x - size / 2, s.left);
            const h = Math.min(y + size / 2, s.top + 236) - Math.max(y - size / 2, s.top);
            if (w > 0 && h > 0) a += w * h;
        }
        return Math.min(1, a / (size * size));
    };

    // 1. The radial scatter. A note is skipped when it would mostly hide under
    //    the steps (only a sliver would show) or sit too close to another one.
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < BG.count; i++) {
        const t = (i + 0.5) / BG.count;
        const rad = Math.min(1.06, Math.pow(t, 1 / BG.centerPile) + (r() - 0.5) * 0.22 * BG.messiness);
        const ang = i * golden + (r() - 0.5) * 1.4 * BG.messiness;
        const size = noteSize();
        const drop = rad > 0.78 && r() < BG.raggedEdge;
        // inner notes sit higher in the pile, so the middle looks most layered
        const z = Math.round((1 - Math.max(0, rad)) * 14 + r() * 8);
        if (drop) continue;
        const x = cx + Math.cos(ang) * BG.radiusX * rad;
        const y = cy + Math.sin(ang) * BG.radiusY * rad;
        if (hiddenShare(x, y, size) > BG.maxHidden) continue;
        if (boxes.some(([bx, by]) => Math.hypot(x - bx, y - by) < BG.minSpacing)) continue;
        add(x, y, size, z);
    }

    // 2. Plug any bare spot within gapPad of a step. The filler note is nudged
    //    away from that step so most of it shows instead of tucking underneath.
    const covered = (px: number, py: number) =>
        boxes.some(([bx, by, h]) => Math.abs(px - bx) < h && Math.abs(py - by) < h) ||
        steps.some((s) => px > s.left + 6 && px < s.left + 230 && py > s.top + 6 && py < s.top + 230);
    const pad = BG.gapPad;
    for (const s of steps) {
        const sx = s.left + 118;
        const sy = s.top + 118;
        for (let py = s.top - pad; py <= s.top + 236 + pad; py += 36) {
            for (let px = s.left - pad; px <= s.left + 236 + pad; px += 36) {
                if (covered(px, py)) continue;
                const size = noteSize();
                const d = Math.hypot(px - sx, py - sy) || 1;
                const push = size * 0.28;
                add(px + ((px - sx) / d) * push + (r() - 0.5) * 16, py + ((py - sy) / d) * push + (r() - 0.5) * 16, size, 8 + Math.floor(r() * 10));
            }
        }
    }
    return out;
})();

/**
 * Where the page is wider than the section, the wall reaches out to the
 * header's edges. These notes sit along those outer edges, sparser than the
 * core and beneath it, so the wall thins out as it spreads. Each is anchored
 * to its own edge (inset in px), so it stays whole at any width; when there is
 * no extra room it simply tucks under the core's outer notes.
 */
const SIDE: (SmallNoteData & { side: "left" | "right"; inset: number; y: number; size: number })[] = SIDE_NOTES.map((n, i) => ({
    side: n.side,
    inset: n.inset,
    y: n.y - n.size / 2,
    size: n.size,
    item: "text" in n ? T(n.text) : S(n.stamp, n.caption),
    paper: n.paper,
    ink: n.ink,
    rot: n.tilt,
    frame: "stamp" in n ? (n.frame ?? "none") : "none",
    taped: n.taped,
    stampRot: n.tilt * -1.5,
    ghost: false,
    mark: null,
    markRot: 0,
    press: i,
}));

/** Small notes above and below the stacked steps (below lg). */
const STRIP_NOTE = (item: Item, paper: Paper, ink: Ink, rot: number, frame: StampFrame = "none"): SmallNoteData => ({
    item, paper, ink, rot, frame, stampRot: rot * -1.5, ghost: false, mark: null, markRot: 0, press: 0, taped: false,
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
            {note.taped && <i className="hiw-tape" />}
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
    const l = STEP_LAYOUT[s.step as keyof typeof STEP_LAYOUT];
    const style: CSSProperties = {
        ...vars({ "--paper": `var(--hiw-${s.paper})`, "--ink-c": `var(--hiw-ink-${s.ink})` }),
        rotate: `${l.tilt}deg`,
        ...(onWall ? { left: l.left, top: l.top, ...vars({ "--z": String(50 + i) }) } : {}),
    };
    return (
        <li className="hiw-note hiw-step" style={style}>
            <div className="hiw-paper">
                <div className="hiw-content">
                    <div className="hiw-step-head">
                        <span>{s.step}</span>
                        <span
                            className="hiw-step-art"
                            style={{ rotate: `${l.stamp.tilt}deg`, width: l.stamp.size, height: l.stamp.size, margin: `${l.stamp.top}px ${l.stamp.right}px 0 0` }}
                        >
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
                        <div className="hiw-sides" aria-hidden="true">
                            {SIDE.map((n, idx) => (
                                <SmallNote key={idx} note={n} style={{ [n.side]: n.inset, top: n.y, width: n.size, height: n.size }} />
                            ))}
                        </div>
                        <div className="hiw-core">
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
