import Image from "next/image";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { backClip, bendClip, hasBack, PaperBends, type Bend } from "./paper-bends";
import PixelStamp, { StampFilters } from "./pixel-stamp";
import type { StampFrame, StampName } from "./pixel-stamps";
import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";
import WallFit from "./wall-fit";
import { BACKGROUND, BOARDS, LIST_NOTE_SCALE, NOTES, PHOTOS, SIDE_NOTES, STEP_STYLE, type BoardName, type Ink, type Paper, type StepPlace } from "./how-it-works-tuning";

/**
 * The PAWSE loop as four paper step notes on a wall of small notes. Every
 * drawing is a pixel-art rubber stamp pressed into the paper. The wall's core
 * is a fixed board scaled to fit the section, in one of three shapes by screen
 * size (four steps in a row, a 2×2 grid, or a zig-zag column on phones), with
 * sparser notes out toward the page's edges where there is room. Hovering a
 * step note lifts it off the wall, above any step it overlaps. Everything
 * except the four step notes is decorative and hidden from assistive tech.
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

type Item = { text: ReactNode; size?: "list" | "dense" | "long" } | { stamp: StampName; caption?: string };

/** Renders one written note: "\n" breaks a line, ~~x~~ crosses out, **x** writes big. */
function writing(text: string): ReactNode {
    return text.split("\n").map((line, i) => (
        <Fragment key={i}>
            {i > 0 && <br />}
            {line.split(/(~~[^~]+~~|\*\*[^*]+\*\*)/).map((part, j) =>
                part.startsWith("~~") ? (
                    <s key={j}>{part.slice(2, -2)}</s>
                ) : part.startsWith("**") ? (
                    <span key={j} className="hiw-big">
                        {part.slice(2, -2)}
                    </span>
                ) : (
                    part
                ),
            )}
        </Fragment>
    ));
}
/** 3+ lines: written small, like a list (6+: smaller still). A long line or two: a size down so it fits. */
function T(text: string): Item {
    const lines = text.split("\n").length;
    const long = text.replace(/~~|\*\*/g, "").length > 24;
    // one span, so the lines flow as text inside the note's flex column
    return { text: <span>{writing(text)}</span>, size: lines >= 6 ? "dense" : lines >= 3 ? "list" : long ? "long" : undefined };
}
const isList = (item: Item) => "size" in item && (item.size === "list" || item.size === "dense");
const S = (stamp: StampName, caption?: string): Item => ({ stamp, caption });

const STAMPS: Item[] = [
    S("cat"), S("loaf", "zzz"), S("fish", "x4"), S("heart"), S("star", "nice!"), S("mug"),
    S("paw"), S("yarn"), S("tux", "hi!"), S("loaf"), S("fish"), S("sparkle"), S("phone", "away"),
    S("heart", "focus"), S("zzz"), S("clock", "25 min"),
];
const SIDE_TEXT = new Set(SIDE_NOTES.flatMap((n) => ("text" in n ? [n.text] : [])));
const WALL_NOTES = NOTES.filter((t) => !SIDE_TEXT.has(t)).map(T);
/** Lists get their own open spots (see buildWall step 7); everything else cycles through the notes. */
const LISTS = WALL_NOTES.filter(isList);
const ITEMS: Item[] = [...WALL_NOTES.filter((i) => !isList(i)), ...STAMPS];
/** Walk the items in steps that share no factor with their count, so every one shows before any repeats. */
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
let ITEM_STEP = 11;
while (gcd(ITEM_STEP, ITEMS.length) !== 1) ITEM_STEP++;

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
    /** No writing, at most a small doodle: gives the eye somewhere to rest. */
    blank?: boolean;
    bend?: Bend;
    /** A taped printed photo instead of a sticky note. */
    photo?: (typeof PHOTOS)[number];
};

/** Picks a bend from the tuning weights. */
const BEND_TOTAL = Object.values(BACKGROUND.bends).reduce((a, b) => a + b, 0);
function pickBend(roll: number): Bend {
    let t = roll * BEND_TOTAL;
    for (const [b, w] of Object.entries(BACKGROUND.bends) as [Bend, number][]) {
        if ((t -= w) < 0) return b;
    }
    return "flat";
}

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

/**
 * The small notes behind the steps, scattered radially: a shuffled golden-angle
 * spiral in an oval, piled up in the middle and loosening toward a ragged rim.
 * A second pass then plugs any bare spot right around the steps. Every note is
 * kept whole on the board. Layout and stamp styling draw from separate
 * random streams so either can change without moving the other.
 */
type WallNote = SmallNoteData & { x: number; y: number; size: number; z: number };
function buildWall(board: (typeof BOARDS)[BoardName]): WallNote[] {
    const BG = { ...BACKGROUND, ...board.background };
    const BOARD_W = board.width;
    const BOARD_H = board.height;
    const r = rng(BG.seed);
    const r2 = rng(97);
    const cx = BOARD_W / 2;
    const cy = BOARD_H / 2;
    const out: WallNote[] = [];
    // [centre x, centre y, half size] of every note placed, for the gap check
    const boxes: [number, number, number][] = [];
    let press = 0;
    let k = 0; // item counter; blank notes skip it so every item still shows

    const add = (px: number, py: number, size: number, z: number) => {
        const rot = (r() - 0.5) * 2 * BG.maxTilt;
        const paper = BG.papers[Math.floor(r() * BG.papers.length)];
        const taped = r() < BG.tapedShare;
        const ink = INKS[Math.floor(r2() * INKS.length)];
        const fr = r2();
        const stampRot = (r2() - 0.5) * 18;
        const ghost = r2() < 0.16;
        const markRoll = r2();
        const markName = MARKS[Math.floor(r2() * MARKS.length)];
        const markRot = (r2() - 0.5) * 30;
        const blank = r2() < BG.blankShare;
        const bend = pickBend(r2());
        const item = ITEMS[((blank ? k : k++) * ITEM_STEP) % ITEMS.length];
        const m = size * 0.6 + 4; // keeps the tilted note and its tape whole
        const x = Math.min(BOARD_W - m, Math.max(m, px));
        const y = Math.min(BOARD_H - m, Math.max(m, py));
        boxes.push([x, y, size / 2]);
        out.push({
            x: x - size / 2,
            y: y - size / 2,
            size,
            // blank notes sit at the very back (0-2); written ones above them. Notes
            // stuck over a photo's corner (z 26+) keep their place on top.
            z: z >= 26 ? z : blank ? z % 3 : Math.max(z, 3),
            item,
            paper,
            ink,
            rot,
            frame: fr < 0.3 ? "square" : fr < 0.5 ? "round" : "none",
            stampRot,
            ghost,
            mark: blank ? (markRoll < 0.4 ? markName : null) : !("stamp" in item) && markRoll < 0.24 ? markName : null,
            markRot,
            press: press++,
            taped,
            blank,
            bend,
        });
    };
    const noteSize = () => BG.noteSize.min + r() * (BG.noteSize.max - BG.noteSize.min);

    const steps: StepPlace[] = Object.values(board.steps);
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
    for (const s of BG.fillGaps ? steps : []) {
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

    // 3. Behind the seams between neighbouring steps: their tilts open thin
    //    wedges that the gap check above can't see, so each seam gets a note
    //    near each end. Side by side, that's its top and foot; one above the
    //    other, its left and right.
    for (const a of BG.fillGaps ? steps : []) {
        for (const b of steps) {
            const gapX = b.left - (a.left + 236);
            const gapY = b.top - (a.top + 236);
            if (gapX > -20 && gapX < 80 && Math.abs(a.top - b.top) < 120) {
                const x = (a.left + 236 + b.left) / 2;
                const top = Math.min(a.top, b.top);
                for (const y of [top + 74, top + 178]) add(x + (r() - 0.5) * 10, y, noteSize(), 6 + Math.floor(r() * 6));
            } else if (gapY > -20 && gapY < 80 && Math.abs(a.left - b.left) < 120) {
                const y = (a.top + 236 + b.top) / 2;
                const left = Math.min(a.left, b.left);
                for (const x of [left + 74, left + 178]) add(x, y + (r() - 0.5) * 10, noteSize(), 6 + Math.floor(r() * 6));
            }
        }
    }

    // 4. A few more notes along the very top and bottom of the wall, spaced
    //    across with some jitter and skipped where a note already sits.
    for (const edge of [0, 1]) {
        for (let i = 0; i < BG.edgeNotes; i++) {
            const size = noteSize();
            const m = size * 0.6 + 4;
            const em = (BOARD_W * 150) / 1120; // left clear at each end
            const x = em + ((BOARD_W - 2 * em) * (i + 0.5)) / BG.edgeNotes + (r() - 0.5) * 60;
            const y = edge ? BOARD_H - m - r() * 18 : m + r() * 18;
            if (boxes.some(([bx, by]) => Math.hypot(x - bx, y - by) < 72)) continue;
            add(x, y, size, 3 + Math.floor(r() * 10));
        }
    }

    // 5. Printed photos take the spots of notes that stay fully visible, picked
    //    one by one as far as possible from the steps and from each other.
    const taken: [number, number][] = steps.map((s) => [s.left + 118, s.top + 118]);
    const spots = out.filter((n) => hiddenShare(n.x + n.size / 2, n.y + n.size / 2, n.size) < 0.15);
    // gaps along the board's short side count a bit more
    const [wx, wy] = BOARD_W >= BOARD_H ? [1, 1.4] : [1.4, 1];
    for (const photo of PHOTOS.slice(0, board.photos)) {
        let best: WallNote | null = null;
        let bestD = 0;
        for (const n of spots) {
            if (n.photo) continue;
            const c = [n.x + n.size / 2, n.y + n.size / 2];
            const d = Math.min(...taken.map(([tx, ty]) => Math.hypot((c[0] - tx) * wx, (c[1] - ty) * wy)));
            if (d > bestD) [best, bestD] = [n, d];
        }
        if (!best || bestD < 110) break;
        Object.assign(best, { photo, rot: photo.tilt ?? best.rot, taped: true, bend: "flat" as Bend });
        taken.push([best.x + best.size / 2, best.y + best.size / 2]);
    }

    // 6. Tuck each photo in: sit it high in the pile, then stick a note or two
    //    over its corners on the side facing the middle of the wall, as if it
    //    was pinned up first and covered over time. Together they hide about
    //    `tuck` of the photo; the middle, where the cat is, stays clear.
    out.filter((p) => p.photo).forEach((p, i) => {
        p.z = 24;
        const tuck = p.photo!.tuck ?? BG.photoTuck;
        if (tuck <= 0) return;
        const corners = i % 2 === 0 ? 2 : 1;
        const a = Math.sqrt(tuck / corners) * p.size; // overlap per corner, px
        const sx = p.x + p.size / 2 < cx ? 1 : -1; // toward the middle
        const sy = p.y + p.size / 2 < cy ? 1 : -1;
        // a note that would have to be pushed back onto the board would slide
        // over the cat, so corners near the board's edge are skipped
        const fits = (x: number, y: number, size: number) => {
            const m = size * 0.6 + 4;
            return x >= m && x <= BOARD_W - m && y >= m && y <= BOARD_H - m;
        };
        let placed = 0;
        for (const [dx, dy] of [[sx, sy], [sx, -sy], [-sx, sy], [-sx, -sy]]) {
            if (placed === corners) break;
            const size = BG.noteSize.min + r() * 12;
            const nx = dx > 0 ? p.x + p.size - a + size / 2 : p.x + a - size / 2;
            const ny = dy > 0 ? p.y + p.size - a + size / 2 : p.y + a - size / 2;
            if (!fits(nx, ny, size)) continue;
            add(nx, ny, size, 26 + Math.floor(r() * 4));
            placed++;
        }
    });
    // 7. Each list gets its own open spot: the place on the wall where the
    //    most of it shows (not under the steps, the photos, the notes over the
    //    photos or another list) without covering much of any photo. It sits
    //    on top of the regular notes.
    const listSize = ((BG.noteSize.min + BG.noteSize.max) / 2) * LIST_NOTE_SCALE;
    const above: WallNote[] = out.filter((n) => n.z >= 24);
    const photosOnly = out.filter((n) => n.photo);
    const inside = (px: number, py: number, o: { x: number; y: number; size: number }) =>
        px > o.x && px < o.x + o.size && py > o.y && py < o.y + o.size;
    const overlap = (x: number, y: number, size: number, o: WallNote) =>
        (Math.max(0, Math.min(x + size, o.x + o.size) - Math.max(x, o.x)) * Math.max(0, Math.min(y + size, o.y + o.size) - Math.max(y, o.y))) /
        (o.size * o.size);
    for (const item of LISTS.slice(0, board.lists)) {
        const size = listSize * (0.94 + r() * 0.12);
        const m = size * 0.6 + 4;
        let best = [cx, cy];
        let bestScore = -Infinity;
        for (let py = m; py <= BOARD_H - m; py += 20) {
            for (let px = m; px <= BOARD_W - m; px += 20) {
                const x0 = px - size / 2;
                const y0 = py - size / 2;
                let open = 0;
                for (let gy = 0.1; gy < 1; gy += 0.2) {
                    for (let gx = 0.1; gx < 1; gx += 0.2) {
                        const qx = x0 + gx * size;
                        const qy = y0 + gy * size;
                        const hid =
                            steps.some((s) => qx > s.left && qx < s.left + 236 && qy > s.top && qy < s.top + 236) ||
                            above.some((o) => inside(qx, qy, o));
                        open += hid ? 0 : gy < 0.6 ? 2 : 1; // the writing starts at the top, so that counts double
                    }
                }
                const covers = photosOnly.reduce((sum, o) => sum + overlap(x0, y0, size, o), 0);
                const score = open / 40 - covers * 2;
                if (score > bestScore) [best, bestScore] = [[px, py], score];
            }
        }
        add(best[0], best[1], size, 23);
        const n = out[out.length - 1];
        Object.assign(n, { item, blank: false, mark: null, z: 23 });
        above.push(n);
    }
    return out;
}

/**
 * Where the page is wider than the board, the wall reaches out toward the
 * page's edges. These notes sit along those outer edges, sparser than the
 * core and beneath it, so the wall thins out as it spreads. Each is anchored
 * to its own edge (inset in px), so it stays whole at any width; when there is
 * no extra room it simply tucks under the core's outer notes. The wide board
 * uses SIDE_NOTES as placed; taller boards repeat each side's notes evenly
 * down their full height.
 */
type SideNote = SmallNoteData & { side: "left" | "right"; inset: number; y: number; size: number };
function buildSides(board: (typeof BOARDS)[BoardName], name: BoardName): SideNote[] {
    const place = (n: (typeof SIDE_NOTES)[number], i: number, y: number, stamp?: Item): SideNote => ({
        side: n.side,
        inset: n.inset,
        y: y - n.size / 2,
        size: n.size,
        item: stamp ?? ("text" in n ? T(n.text) : S(n.stamp, n.caption)),
        paper: n.paper,
        ink: n.ink,
        rot: n.tilt,
        frame: stamp ? (i % 3 === 0 ? "round" : "none") : "stamp" in n ? (n.frame ?? "none") : "none",
        taped: n.taped,
        stampRot: n.tilt * -1.5,
        ghost: false,
        mark: null,
        markRot: 0,
        press: i,
        bend: n.bend ?? (["bow", "curl-r-sm", "cup", "curl-l-sm"] as const)[i % 4],
    });
    if (name === "wide") return SIDE_NOTES.map((n, i) => place(n, i, n.y));
    const out: SideNote[] = [];
    for (const side of ["left", "right"] as const) {
        const own = SIDE_NOTES.filter((n) => n.side === side);
        const count = Math.round(board.height / ("sideSpacing" in board ? board.sideSpacing : 150));
        // the right side starts half a step lower, so the two sides don't mirror
        const offset = side === "right" ? 0.75 : 0.5;
        for (let i = 0; i < count; i++) {
            const n = own[i % own.length];
            const y = Math.min(board.height - n.size * 0.6, Math.max(n.size * 0.6, ((i + offset) * board.height) / count));
            // once a side's own notes run out, the rest carry a stamp instead so no writing repeats
            const stamp = i < own.length ? undefined : STAMPS[(i * 5 + (side === "right" ? 7 : 0)) % STAMPS.length];
            out.push(place(n, out.length, y, stamp));
        }
    }
    return out;
}

const WALLS = (Object.keys(BOARDS) as BoardName[]).map((name) => ({
    name,
    board: BOARDS[name],
    notes: buildWall(BOARDS[name]),
    sides: buildSides(BOARDS[name], name),
}));

const vars = (v: Record<string, string>) => v as CSSProperties;

/**
 * The note's paper, bent: clipped to the bend's shape, with its light and
 * shade on top and, for a corner curl, the curled-over back of the paper.
 */
function BentPaper({ bend = "flat", children }: { bend?: Bend; children: ReactNode }) {
    return (
        <>
            <div className="hiw-paper" style={{ clipPath: bendClip(bend) }}>
                {children}
                {bend !== "flat" && <i className="hiw-bend" data-bend={bend} />}
            </div>
            {hasBack(bend) && <i className="hiw-curl-back" data-bend={bend} style={{ clipPath: backClip(bend) }} />}
        </>
    );
}

function SmallNote({ note, style, className = "" }: { note: SmallNoteData; style?: CSSProperties; className?: string }) {
    const { item } = note;
    let inner: ReactNode;
    if (note.blank) {
        inner = null;
    } else if ("stamp" in item) {
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
    const textSize = !note.blank && "size" in item ? item.size : undefined; // list | dense | long
    if (note.photo) {
        return (
            <div className={`hiw-note hiw-print ${className}`} style={{ rotate: `${note.rot}deg`, ...style }}>
                <div className="hiw-print-img">
                    <Image src={note.photo.src} alt="" fill sizes="160px" />
                </div>
                <i className="hiw-tape" />
            </div>
        );
    }
    return (
        <div
            className={`hiw-note ${className}`}
            style={{ ...vars({ "--paper": `var(--hiw-${note.paper})`, "--ink-c": `var(--hiw-ink-${note.ink})` }), rotate: `${note.rot}deg`, ...style }}
        >
            <BentPaper bend={note.bend}>
                <div className={textSize ? `hiw-content hiw-${textSize}` : "hiw-content"}>{inner}</div>
                {note.mark && (
                    <div className="hiw-mark" style={{ rotate: `${note.markRot}deg` }}>
                        <PixelStamp name={note.mark} press={note.press} />
                    </div>
                )}
            </BentPaper>
            {note.taped && <i className="hiw-tape" />}
        </div>
    );
}

function StepNote({ s, i, place }: { s: (typeof STEPS)[number]; i: number; place: StepPlace }) {
    const l = STEP_STYLE[s.step as keyof typeof STEP_STYLE];
    const style: CSSProperties = {
        // tilt goes through a variable so the hover can ease it toward straight
        ...vars({ "--paper": `var(--hiw-${s.paper})`, "--ink-c": `var(--hiw-ink-${s.ink})`, "--tilt": `${place.tilt}deg`, "--z": String(50 + i) }),
        left: place.left,
        top: place.top,
    };
    return (
        <li className="hiw-note hiw-step" style={style}>
            <BentPaper bend={l.bend}>
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
            </BentPaper>
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
                <PaperBends />

                {WALLS.map(({ name, board, notes, sides }) => (
                    <WallFit
                        key={name}
                        width={board.width}
                        maxScale={board.maxScale}
                        className={`hiw-wall hiw-wall-${name}`}
                        style={vars({ "--bw0": String(board.width), "--bh0": String(board.height), "--max": String(board.maxScale) })}
                    >
                        <div className="hiw-board" style={vars({ "--hiw-bg-ink": String({ ...BACKGROUND, ...board.background }.inkStrength) })}>
                            <div className="hiw-sides" aria-hidden="true">
                                {sides.map((n, idx) => (
                                    <SmallNote key={idx} note={n} style={{ [n.side]: n.inset, top: n.y, width: n.size, height: n.size }} />
                                ))}
                            </div>
                            <div className="hiw-core">
                                <div className="hiw-small" aria-hidden="true">
                                    {notes.map((n, idx) => (
                                        <SmallNote key={idx} note={n} style={{ left: n.x, top: n.y, width: n.size, height: n.size, zIndex: n.z }} />
                                    ))}
                                </div>
                                <ol className="hiw-steps">
                                    {STEPS.map((s, i) => (
                                        <StepNote key={s.step} s={s} i={i} place={board.steps[s.step as keyof typeof board.steps]} />
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </WallFit>
                ))}
            </div>
        </Section>
    );
}
