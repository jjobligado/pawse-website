/**
 * The hero's "room": a window onto the sky with a sill in front, and the
 * visitor's laptop peeking up from below. Pixel art is used for the things the
 * cats would see (clouds, sun, birds, skyline, plant); the room itself (frame,
 * sill, laptop) is drawn smooth, so the pixel world reads as the view outside.
 *
 * Every pixel graphic here is authored as a character grid and rendered as
 * crisp SVG rects, so it stays sharp at any size.
 */

import { useEffect, useRef, useSyncExternalStore } from "react";
import { DEFAULT_SKY_PHASE, SKY_PHASES, THEMES, isSkyPhase, type SkyPhase } from "@/lib/sky-phase";
import { onSmoothScroll } from "@/lib/smooth-scroll";

type Palette = Record<string, string>;

/** Renders a character grid as pixel-perfect SVG. "." is transparent. */
export function PixelArt({
    rows,
    palette,
    className,
    title,
}: {
    rows: readonly string[];
    palette: Palette;
    className?: string;
    title?: string;
}) {
    const width = rows[0].length;
    const height = rows.length;
    const rects: React.ReactNode[] = [];
    rows.forEach((row, y) => {
        // Merge horizontal runs of the same color into one rect (fewer nodes, no seams).
        let x = 0;
        while (x < width) {
            const ch = row[x];
            if (ch === "." || !palette[ch]) {
                x++;
                continue;
            }
            let run = 1;
            while (x + run < width && row[x + run] === ch) run++;
            const fill = palette[ch];
            rects.push(
                fill.startsWith("var(") ? (
                    <rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} style={{ fill }} />
                ) : (
                    <rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={fill} />
                ),
            );
            x += run;
        }
    });
    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            shapeRendering="crispEdges"
            className={className}
            aria-hidden={title ? undefined : true}
            role={title ? "img" : undefined}
        >
            {title && <title>{title}</title>}
            {rects}
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/* Sky                                                                 */
/* ------------------------------------------------------------------ */

const CLOUD_LARGE = [
    "..........WWWWW.............",
    "........WWWWWWWWW...........",
    "...WWW.WWWWWWWWWWW..WWWW....",
    "..WWWWWWWWWWWWWWWWWWWWWWWW..",
    ".WWWWWWWWWWWWWWWWWWWWWWWWWW.",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "SWWWWWWWWWWWWWWWWWWWWWWWWWWS",
    ".SSSSWWWWWWWWWWWWWWWWWWSSSS.",
    "....SSSSSSSSSSSSSSSSSSSS....",
] as const;

const CLOUD_SMALL = [
    ".....WWWW.......",
    "...WWWWWWWW.WW..",
    ".WWWWWWWWWWWWWW.",
    "WWWWWWWWWWWWWWWW",
    "SSWWWWWWWWWWWWSS",
    "..SSSSSSSSSSSS..",
] as const;

const SUN = [
    "....YYYYY....",
    "..YYYYYYYYY..",
    ".YYHHYYYYYYY.",
    ".YHHYYYYYYYY.",
    "YYHYYYYYYYYYY",
    "YYYYYYYYYYYYY",
    "YYYYYYYYYYYYY",
    "YYYYYYYYYYYYO",
    "YYYYYYYYYYYYO",
    ".YYYYYYYYYYO.",
    ".YYYYYYYYYOO.",
    "..YYYYYYYOO..",
    "....YYOOO....",
] as const;

const BIRD_UP = ["B...B", ".B.B.", "..B.."] as const;
const BIRD_DOWN = [".....", "BB.BB", "..B.."] as const;

/** Deterministic stepped silhouette: column heights from a few summed waves. */
function silhouette(cols: number, base: number, amp: number, seed: number) {
    return Array.from({ length: cols }, (_, x) =>
        Math.round(
            base +
                amp * Math.sin((x + seed) / 9) +
                (amp / 2) * Math.sin((x + seed * 3) / 4.3) +
                (amp / 4) * Math.sin((x + seed * 7) / 2.1),
        ),
    );
}

/** Rooftops: blocks of varying width/height, deterministic. */
function rooftops(cols: number, seed: number) {
    const heights: number[] = [];
    let x = 0;
    let n = seed;
    while (x < cols) {
        n = (n * 9301 + 49297) % 233280;
        const w = 4 + (n % 7);
        const h = 5 + ((n >> 3) % 9);
        for (let i = 0; i < w && x < cols; i++, x++) heights.push(h);
        n = (n * 9301 + 49297) % 233280;
        const gap = n % 3;
        for (let i = 0; i < gap && x < cols; i++, x++) heights.push(3 + (n % 3));
    }
    return heights;
}

const SKY_COLS = 240;
const SKY_ROWS = 22;
const HILLS = silhouette(SKY_COLS, 9, 3, 11);
const ROOFS = rooftops(SKY_COLS, 7);

/** Lit windows on the taller buildings (shown at dusk and night). Deterministic. */
const LIT_WINDOWS = ROOFS.flatMap((h, x) =>
    h >= 8 && x % 3 === 1 && (x * 7) % 5 !== 0 ? [{ x, y: SKY_ROWS - h + 2 + ((x * 5) % 3) * 2 }] : [],
);

/* ------------------------------------------------------------------ */
/* Time of day                                                         */
/* ------------------------------------------------------------------ */

/*
 * The phase lives on <html data-sky> (set before the first paint, see
 * lib/sky-phase.ts), so everything below switches on it in CSS rather than
 * on a React value that only knows the real phase after hydration.
 */

/** Shows a per-phase layer only in its phase (crossfading when the phase changes). */
const SHOW_IN: Record<SkyPhase, string> = {
    dawn: "in-data-[sky=dawn]:opacity-100",
    morning: "in-data-[sky=morning]:opacity-100",
    day: "in-data-[sky=day]:opacity-100",
    dusk: "in-data-[sky=dusk]:opacity-100",
    night: "in-data-[sky=night]:opacity-100",
};

const CLOUD_PALETTE = { W: "var(--sky-cloud-w)", S: "var(--sky-cloud-s)" } as const;

function subscribePhase(onChange: () => void) {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-sky"] });
    return () => observer.disconnect();
}

function getClientPhase(): SkyPhase {
    const phase = document.documentElement.dataset.sky;
    return isSkyPhase(phase) ? phase : DEFAULT_SKY_PHASE;
}

/**
 * The phase as a React value, for art drawn in script (the footer's canvases).
 * It reads <html data-sky>, but is "day" on the server and in the first client
 * render, so markup should switch on the attribute in CSS instead.
 */
export function useSkyPhase(): SkyPhase {
    return useSyncExternalStore(subscribePhase, getClientPhase, () => DEFAULT_SKY_PHASE);
}

export type { SkyPhase };

/* ------------------------------------------------------------------ */
/* Celestial bodies                                                    */
/* ------------------------------------------------------------------ */

const MOON = [
    "....MMMM...",
    "..MMMMM....",
    ".MMMMM.....",
    ".SMMM......",
    "SMMM.......",
    "SMMM.......",
    "SMMM.......",
    ".SMMM......",
    ".MMMMM.....",
    "..MMMMM....",
    "....MMMM...",
] as const;

const STAR = [".S.", "SSS", ".S."] as const;

/** Fixed spots across the upper sky (percent), with varied twinkle timing. */
const STARS = [
    { x: 9, y: 12, d: 0 }, { x: 18, y: 30, d: 1.2 }, { x: 27, y: 8, d: 2.1 }, { x: 34, y: 22, d: 0.6 },
    { x: 46, y: 6, d: 1.7 }, { x: 58, y: 14, d: 2.6 }, { x: 66, y: 28, d: 0.9 }, { x: 74, y: 9, d: 1.4 },
    { x: 81, y: 24, d: 2.3 }, { x: 88, y: 40, d: 0.3 }, { x: 4, y: 38, d: 1.9 }, { x: 52, y: 32, d: 2.9 },
] as const;

/*
 * Where the sun and moon sit: a point on a low arc over the right of the
 * window, driven by --sun-t / --moon-t (0 at rise, 1 at set; lib/sky-phase.ts).
 * They climb from low on the right edge, peak around the middle of their time
 * up, and sink again, drifting a little rightward the whole way, so over a
 * visit the visitor sees them creep. The right side keeps them clear of the
 * copy. `a` is the arc's height (0 at rise and set, 1 at the peak).
 */
const SUN_PATH = {
    right: "calc(13% - 9% * var(--sun-t, 0.5))",
    top: "calc(54% - 38% * 4 * var(--sun-t, 0.5) * (1 - var(--sun-t, 0.5)))",
};
const MOON_PATH = {
    right: "calc(14% - 9% * var(--moon-t, 0.5))",
    top: "calc(50% - 34% * 4 * var(--moon-t, 0.5) * (1 - var(--moon-t, 0.5)))",
};

/** Centres its children on a point of the sky. */
const CENTRED = "absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2";

const SUN_PALETTES: Partial<Record<SkyPhase, Palette>> = {
    dawn: { Y: "#FFB88E", H: "#FFDCC6", O: "#F2906E" },
    morning: { Y: "#FFD69C", H: "#FFF1D9", O: "#FFBC80" },
    day: { Y: "#FFE59A", H: "#FFF6D6", O: "#FFD27A" },
    dusk: { Y: "#FFB36B", H: "#FFD7A3", O: "#F28E4E" },
};

function Celestial() {
    const show = (p: SkyPhase) => `opacity-0 ${SHOW_IN[p]}`;
    const fade = "transition-opacity duration-1000 ease-out";
    const glow = (p: SkyPhase) => (
        <div
            key={p}
            className={`${CENTRED} w-[420px] h-[420px] rounded-full ${fade} ${show(p)}`}
            style={{ background: THEMES[p].glow }}
        />
    );
    return (
        <>
            {/* Sun: one body on its arc, its colour warming at morning and dusk (crossfaded) */}
            <div className="absolute w-0 h-0" style={SUN_PATH}>
                {(["dawn", "morning", "day", "dusk"] as const).map(glow)}
                {(["dawn", "morning", "day", "dusk"] as const).map((p) => (
                    <PixelArt
                        key={p}
                        rows={SUN}
                        palette={SUN_PALETTES[p]!}
                        className={`hidden sm:block ${CENTRED} w-[65px] xl:w-[78px] h-auto ${fade} ${show(p)}`}
                    />
                ))}
            </div>

            {/* Night: moon on its own arc, and twinkling stars. At dawn the moon is
                setting and the stars fade with the first light. */}
            <div className="absolute w-0 h-0" style={MOON_PATH}>
                {glow("night")}
                <div className={`${fade} ${show("night")} ${SHOW_IN.dawn}`}>
                    <PixelArt
                        rows={MOON}
                        palette={{ M: "#FFF3C9", S: "#EBD99E" }}
                        className={`hidden sm:block ${CENTRED} w-[46px] lg:w-[56px] h-auto`}
                    />
                </div>
            </div>
            <div className={`${fade} ${show("night")} in-data-[sky=dawn]:opacity-40`}>
                {STARS.map((s, i) => (
                    <span
                        key={i}
                        // Phones: only the stars near the edges, so none land on the headline.
                        className={`absolute animate-twinkle ${s.x > 14 && s.x < 86 ? "hidden sm:block" : ""}`}
                        style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.d}s` }}
                    >
                        <PixelArt rows={STAR} palette={{ S: "#FFFBEA" }} className={i % 3 === 0 ? "w-[9px] h-auto" : "w-[6px] h-auto"} />
                    </span>
                ))}
            </div>
        </>
    );
}

/*
 * Looking through the window from where you stand. Each window tracks --look on
 * its sky: 0 when the window is level with the middle of the screen, rising to
 * 1 as it scrolls up and away (you look up at it, from below) and falling to -1
 * while it is still low on the screen (you look down into it, from above).
 *
 * Seen through a near frame, far things shift with your eye and near things
 * hardly at all, so each layer moves by its own share of the window's height:
 * looking up, the horizon sinks and more sky shows; looking down, the town
 * comes up into view. The sky, sun, moon and stars are farthest and shift most.
 */
const DEPTH = { sky: 14, farClouds: 11, hills: 10, town: 8, nearClouds: 6 } as const;

/** Shifts a window-sized layer by `percent` of the window's height at full look. */
const lookShift = (percent: number): React.CSSProperties => ({ translate: `0 calc(var(--look, 0) * ${percent}%)` });

/** Keeps --look on `ref` in step with the window's place on the screen. */
function useWindowLook(ref: React.RefObject<HTMLDivElement | null>) {
    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let frame = 0;
        let visible = false;
        const apply = () => {
            frame = 0;
            if (!visible) return;
            const rect = el.getBoundingClientRect();
            const half = window.innerHeight / 2;
            // -1 just below the screen, 0 centred, 1 just above it
            const look = (half - (rect.top + rect.height / 2)) / (half + rect.height / 2);
            el.style.setProperty("--look", Math.min(1, Math.max(-1, look)).toFixed(4));
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(apply);
        };

        // Only track while near the screen
        const observer = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting;
                schedule();
            },
            { rootMargin: "100px 0px" },
        );
        observer.observe(el);

        // Move in the same frame as Lenis moves the page, so the view never lags the frame
        const unsubscribe = onSmoothScroll(apply);
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            unsubscribe();
            observer.disconnect();
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [ref]);
}

const SKYLINE_HEIGHT = "h-[72px] sm:h-[88px] lg:h-[104px]";

/*
 * Window panes on the town's lower floors (below the drawn rooftops), as two
 * offset grids of one-pixel squares. --u is one skyline pixel. Faint glass by
 * day; at dusk and night some of them light up.
 */
const pane = (color: string, w: number, h: number, x: number, y: number) =>
    `conic-gradient(from 270deg at var(--u) var(--u),${color} 25%,transparent 0) calc(var(--u)*${x}) calc(var(--u)*${y})/calc(var(--u)*${w}) calc(var(--u)*${h})`;
const PANES = [pane("rgb(40 60 120/0.1)", 7, 6, 2, 3), pane("rgb(40 60 120/0.1)", 11, 5, 6, 1)].join(",");
const LIT_PANES = pane("#FFE08A", 7, 6, 2, 3);

/**
 * One row of the skyline: the hills behind, or the town in front. It stands
 * --sky-lift above the bottom of the glass (the hero raises the town clear of
 * the laptop), and its ground carries on below, down past the sill, so no
 * shift of the view ever opens a gap under it.
 */
function SkylineLayer({ part }: { part: "hills" | "town" }) {
    const town = part === "town";
    const fill = town ? "var(--sky-roof)" : "var(--sky-hill)";
    return (
        <div className="absolute inset-0 will-change-[translate]" style={lookShift(town ? DEPTH.town : DEPTH.hills)}>
            <div className="absolute inset-x-0 bottom-[var(--sky-lift,0px)]">
                <svg
                    viewBox={`0 0 ${SKY_COLS} ${SKY_ROWS}`}
                    preserveAspectRatio="xMidYMax slice"
                    shapeRendering="crispEdges"
                    className={`block w-full ${SKYLINE_HEIGHT}`}
                    aria-hidden="true"
                >
                    {town
                        ? ROOFS.map((h, x) => (
                              <rect key={x} x={x} y={SKY_ROWS - h} width={1.02} height={h + 0.1} style={{ fill }} />
                          ))
                        : HILLS.map((h, x) => (
                              <rect key={x} x={x} y={SKY_ROWS - h - 4} width={1.02} height={h + 4.1} style={{ fill }} />
                          ))}
                    {town && (
                        <g style={{ opacity: "var(--sky-lights)" }} className="transition-opacity duration-1000">
                            {LIT_WINDOWS.map(({ x, y }) => (
                                <rect key={`w${x}`} x={x} y={y} width={1} height={1} fill="#FFE08A" />
                            ))}
                        </g>
                    )}
                </svg>
                {/* The ground under it, carried on past the bottom of the glass */}
                <div
                    className="absolute inset-x-0 top-[calc(100%_-_1px)] h-[calc(var(--sky-lift,0px)_+_45vh)] [--u:calc(72px/22)] sm:[--u:calc(88px/22)] lg:[--u:calc(104px/22)]"
                    style={{ background: town ? `${PANES},${fill}` : fill }}
                >
                    {town && (
                        <div
                            className="absolute inset-0 transition-opacity duration-1000"
                            style={{ background: LIT_PANES, opacity: "var(--sky-lights)" }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Everything seen through the glass, for the visitor's time of day, shifting
 * with where you look from as the page scrolls (see DEPTH).
 */
export function WindowSky({
    entrance = true,
    lift,
}: {
    /** Play the load-in settle (hero only; scenes further down skip it). */
    entrance?: boolean;
    /** How far to raise the skyline off the bottom of the glass (a CSS length), e.g. clear of the laptop. */
    lift?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useWindowLook(ref);
    return (
        <div
            ref={ref}
            aria-hidden="true"
            className={`absolute inset-0 overflow-hidden ${entrance ? "animate-hero-sky" : ""}`}
            style={lift ? ({ "--sky-lift": lift } as React.CSSProperties) : undefined}
        >
            {/* Farthest: the sky itself with the sun, moon and stars */}
            <div className="absolute inset-0 will-change-[translate]" style={lookShift(DEPTH.sky)}>
                {/* Sky gradients, crossfaded when the phase changes. Each is padded above
                    and below with its end colours, so a shifted view never runs out of sky. */}
                {SKY_PHASES.map((p) => (
                    <div
                        key={p}
                        className={`absolute inset-x-0 -top-[20%] -bottom-[20%] opacity-0 transition-opacity duration-1000 ease-out ${SHOW_IN[p]}`}
                        style={{
                            background: `${THEMES[p].gradient} center/100% calc(100% / 1.4) no-repeat,linear-gradient(${THEMES[p].top},${THEMES[p].top}) top/100% 50% no-repeat,linear-gradient(${THEMES[p].horizon},${THEMES[p].horizon}) bottom/100% 50% no-repeat`,
                        }}
                    />
                ))}

                <Celestial />
            </div>

            {/* Far layer: small clouds + birds */}
            <div className="absolute inset-0 will-change-[translate]" style={lookShift(DEPTH.farClouds)}>
                <div className="absolute top-[14%] left-[8%] animate-cloud-drift-slow [animation-delay:-60s]">
                    <PixelArt rows={CLOUD_SMALL} palette={CLOUD_PALETTE} className="w-[96px] h-auto opacity-90" />
                </div>
                <div className="absolute top-[46%] left-[62%] animate-cloud-drift-slow [animation-delay:-150s]">
                    <PixelArt rows={CLOUD_SMALL} palette={CLOUD_PALETTE} className="w-[80px] h-auto opacity-80" />
                </div>
                {/* Birds: morning to dusk, none at night */}
                <div className="absolute top-[22%] left-[30%] animate-bird-flight in-data-[sky=night]:hidden">
                    <div className="flex gap-3 items-start">
                        <Bird className="w-[15px]" />
                        <Bird className="w-[12px] mt-2 [animation-delay:-180ms]" />
                    </div>
                </div>
            </div>

            {/* Near layer: big clouds, which shift least (still behind the town) */}
            <div className="absolute inset-0 will-change-[translate]" style={lookShift(DEPTH.nearClouds)}>
                <div className="absolute top-[6%] left-[20%] animate-cloud-drift [animation-delay:-20s]">
                    <PixelArt rows={CLOUD_LARGE} palette={CLOUD_PALETTE} className="w-[168px] lg:w-[196px] h-auto" />
                </div>
                <div className="absolute top-[58%] left-[74%] animate-cloud-drift [animation-delay:-75s]">
                    <PixelArt rows={CLOUD_LARGE} palette={CLOUD_PALETTE} className="w-[140px] lg:w-[168px] h-auto" />
                </div>
            </div>

            <SkylineLayer part="hills" />
            <SkylineLayer part="town" />

            {/* Soft shade under the head of the frame */}
            <div className="absolute inset-0 shadow-[inset_0_14px_28px_-16px_rgb(16_60_100/0.35)]" />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Paw prints on the glass                                             */
/* ------------------------------------------------------------------ */

export const PAW = [
    "..T..T..",
    ".TT..TT.",
    "T......T",
    "TT.PP.TT",
    "..PPPP..",
    ".PPPPPP.",
    ".PPPPPP.",
    "..PP.PP.",
] as const;

/* ------------------------------------------------------------------ */
/* The window: a walnut French casement, opened out                    */
/* ------------------------------------------------------------------ */

/** Walnut frame colours (tokens in globals.css, shared with the sill). */
export const FRAME = {
    face: "var(--color-window-frame)",
    shade: "var(--color-window-frame-shade)",
    edge: "var(--color-window-frame-edge)",
} as const;

/**
 * Soft paw prints left on the glass of the open panels (from lg up). They sit in
 * the panel's own plane, so they swing with it. Decoration: they only fade in,
 * after the cats have landed on the sill.
 */
const PANEL_PRINTS = [
    { x: 30, y: 46, rot: -14, big: true, delay: 1.7 },
    { x: 58, y: 54, rot: 12, big: true, delay: 1.85 },
    { x: 36, y: 63, rot: -6, big: false, delay: 2.0 },
] as const;

// Bevels: a lit edge and a dark edge on every wooden piece, so nothing reads flat.
// (Written out in full: Tailwind only generates classes it can read literally.)
const STILE = "absolute wood-v shadow-[inset_1px_0_0_rgb(255_232_205/0.22),inset_-1px_0_0_rgb(30_14_4/0.5)]";
const RAIL = "absolute wood-h shadow-[inset_0_1px_0_rgb(255_232_205/0.22),inset_0_-1px_0_rgb(30_14_4/0.5)]";

/**
 * One casement panel, hinged on the jamb and swung outward (away from the
 * visitor), so it recedes behind the frame. Real 3D: perspective and width step
 * up with the screen so the panel always reads as half the window, opened about
 * 60 degrees. Built like a real sash: two stiles, a top rail, a deeper bottom
 * rail, and glazing bars (2 x 3 panes) over clear, faintly tinted glass.
 */
function CasementPanel({ side, alwaysOpen }: { side: "left" | "right"; alwaysOpen?: boolean }) {
    const left = side === "left";
    // Phones: panels nearly closed (the hero's copy sits above the window there),
    // unless the copy sits on the glass at every size.
    const phone = alwaysOpen ? "w-[clamp(72px,20vw,290px)] [--a:60deg]" : "w-[calc(50%_-_clamp(9px,1.45vw,20px))] [--a:14deg]";
    return (
        <div
            className={`absolute inset-y-0 ${left ? "left-[clamp(9px,1.45vw,20px)] origin-left" : "right-[clamp(9px,1.45vw,20px)] origin-right"} ${phone} sm:w-[clamp(72px,20vw,290px)] [--p:clamp(480px,90vw,1300px)] sm:[--a:60deg] lg:[--a:58deg] shadow-[0_0_0_1px_var(--color-window-frame-edge)]`}
            style={{ transform: `perspective(var(--p)) rotateY(calc(var(--a) * ${left ? 1 : -1}))` }}
        >
            {/* Glass: a cool tint, one broad glint and one thin one */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(205_232_255/0.16),rgb(255_255_255/0.05))]" />
            <div className="absolute inset-0 bg-[linear-gradient(125deg,rgb(255_255_255/0.26)_0%,rgb(255_255_255/0.07)_30%,transparent_31%,transparent_58%,rgb(255_255_255/0.14)_59%,transparent_66%)]" />

            {/* Paw prints on the glass */}
            <div aria-hidden="true" className="hidden lg:block absolute inset-0">
                {PANEL_PRINTS.map((p, i) => (
                    <span
                        key={i}
                        className="absolute animate-paw-fade"
                        style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `rotate(${p.rot}deg)`, animationDelay: `${p.delay}s` }}
                    >
                        <PixelArt
                            rows={PAW}
                            palette={{ T: "rgb(255 255 255 / 0.6)", P: "rgb(255 255 255 / 0.55)" }}
                            className={`${p.big ? "w-[24px] xl:w-[28px]" : "w-[18px] xl:w-[22px]"} h-auto`}
                        />
                    </span>
                ))}
            </div>

            {/* Glazing bars: one upright, two across */}
            <div className={`${STILE} inset-y-0 left-1/2 -translate-x-1/2 w-[2px] sm:w-[3px] lg:w-1 xl:w-[5px]`} />
            <div className={`${RAIL} inset-x-0 top-1/3 -translate-y-1/2 h-[2px] sm:h-[3px] lg:h-1 xl:h-[5px]`} />
            <div className={`${RAIL} inset-x-0 top-2/3 -translate-y-1/2 h-[2px] sm:h-[3px] lg:h-1 xl:h-[5px]`} />

            {/* Sash: stiles, top rail, deeper bottom rail */}
            <div className={`${STILE} inset-y-0 left-0 w-1 sm:w-1.5 lg:w-2 xl:w-2.5`} />
            <div className={`${STILE} inset-y-0 right-0 w-1 sm:w-1.5 lg:w-2 xl:w-2.5`} />
            <div className={`${RAIL} inset-x-0 top-0 h-1 sm:h-1.5 lg:h-2 xl:h-2.5`} />
            <div className={`${RAIL} inset-x-0 bottom-0 h-1.5 sm:h-2 lg:h-3 xl:h-3.5`} />

            {/* Copper handle on its backplate, on the free edge */}
            <div
                className={`absolute top-[50%] ${left ? "right-0" : "left-0"} w-1 sm:w-1.5 lg:w-2 xl:w-2.5 h-5 sm:h-7 lg:h-10 xl:h-12 rounded-[2px] bg-[#3B2A20]`}
            >
                <div
                    className={`absolute top-1/2 -translate-y-1/2 ${left ? "-right-[2px] sm:-right-[3px] lg:-right-1" : "-left-[2px] sm:-left-[3px] lg:-left-1"} w-[3px] sm:w-1 lg:w-1.5 xl:w-2 h-3/4 rounded-full bg-[linear-gradient(90deg,#F0B184,#C27245_55%,#8E4C2A)] shadow-[0_1px_2px_rgb(40_20_10/0.5)]`}
                />
            </div>
        </div>
    );
}

/** An iron butt hinge on the jamb's inner edge. */
function Hinge({ side, at }: { side: "left" | "right"; at: "top" | "bottom" }) {
    return (
        <div
            className={`absolute ${at === "top" ? "top-[13%]" : "bottom-[13%]"} ${
                side === "left" ? "left-[calc(clamp(9px,1.45vw,20px)_-_4px)]" : "right-[calc(clamp(9px,1.45vw,20px)_-_4px)]"
            } w-[5px] sm:w-1.5 lg:w-2 xl:w-2.5 h-4 sm:h-6 lg:h-8 xl:h-9 rounded-[2px] bg-[linear-gradient(90deg,#2B2623,#5C544E_45%,#2B2623)] shadow-[0_1px_2px_rgb(0_0_0/0.45)]`}
        >
            {/* Knuckle joints */}
            <span className="absolute inset-x-0 top-1/3 h-px bg-black/50" />
            <span className="absolute inset-x-0 top-2/3 h-px bg-black/50" />
        </div>
    );
}

/**
 * The window, at every screen size: a walnut frame around the whole sky (head
 * under the header, jambs at the edges, a bottom rail on the sill) with its two
 * casement panels opened out on iron hinges. The middle is open air, so nothing
 * crosses the copy. The sill is drawn by the hero, since the cats sit on it.
 */
export function WindowFrame({ alwaysOpen = false }: { alwaysOpen?: boolean } = {}) {
    const jamb = "absolute inset-y-0 w-[clamp(9px,1.45vw,20px)] wood-v";
    return (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            {/* Panels hang outside, behind the frame */}
            <CasementPanel side="left" alwaysOpen={alwaysOpen} />
            <CasementPanel side="right" alwaysOpen={alwaysOpen} />

            {/* Depth: light comes from above, so the head shades the top of the opening, the jambs a little, the bottom not at all */}
            <div className="absolute inset-0 shadow-[inset_0_22px_28px_-20px_rgb(40_20_10/0.3),inset_14px_0_22px_-18px_rgb(40_20_10/0.2),inset_-14px_0_22px_-18px_rgb(40_20_10/0.2)]" />

            {/* Frame: casing with an inner stop moulding (the two-step edge facing the opening) */}
            <div
                className={`${jamb} left-0 shadow-[inset_1px_0_0_rgb(255_232_205/0.2),inset_-3px_0_0_var(--color-window-frame-shade),inset_-4px_0_0_var(--color-window-frame-edge),5px_0_9px_-4px_rgb(40_20_10/0.5)]`}
            />
            <div
                className={`${jamb} right-0 shadow-[inset_-1px_0_0_rgb(255_232_205/0.2),inset_3px_0_0_var(--color-window-frame-shade),inset_4px_0_0_var(--color-window-frame-edge),-5px_0_9px_-4px_rgb(40_20_10/0.5)]`}
            />
            <div className="absolute inset-x-0 top-0 h-[clamp(9px,1.45vw,20px)] wood-h shadow-[inset_0_-3px_0_var(--color-window-frame-shade),inset_0_-4px_0_var(--color-window-frame-edge),0_5px_9px_-4px_rgb(40_20_10/0.5)]" />
            <div className="absolute inset-x-0 bottom-0 h-1.5 sm:h-2 lg:h-2.5 xl:h-3 wood-h shadow-[inset_0_1px_0_rgb(255_232_205/0.28),inset_0_-1px_0_rgb(30_14_4/0.4)]" />

            <Hinge side="left" at="top" />
            <Hinge side="left" at="bottom" />
            <Hinge side="right" at="top" />
            <Hinge side="right" at="bottom" />
        </div>
    );
}


function Bird({ className = "" }: { className?: string }) {
    const palette = { B: "#5B7FA3" };
    return (
        <span className={`relative block aspect-[5/3] ${className}`}>
            <PixelArt rows={BIRD_UP} palette={palette} className="absolute inset-0 w-full h-full animate-wing-up" />
            <PixelArt rows={BIRD_DOWN} palette={palette} className="absolute inset-0 w-full h-full animate-wing-down" />
        </span>
    );
}

/* ------------------------------------------------------------------ */
/* Sill                                                                */
/* ------------------------------------------------------------------ */

/**
 * The window sill: a deep walnut board, a little wider than the window, seen
 * slightly from above (its top, lit by the window, then its rounded front edge),
 * casting a shadow on the wall. `children` sit on it (cats, plant), positioned
 * against the board.
 */
export function WindowSill({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <div className={`relative w-[calc(100%_+_2*var(--so))] ${className}`}>
            <div className="relative h-3.5 sm:h-[18px] lg:h-6 xl:h-7 wood-h [--wood:#94634A] [--si:calc(var(--so)*0.85)] [clip-path:polygon(var(--si)_0,calc(100%_-_var(--si))_0,100%_100%,0_100%)] shadow-[inset_0_1px_0_rgb(40_20_10/0.25),inset_0_4px_6px_-3px_rgb(40_20_10/0.28)]">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_10%,rgb(255_236_210/0.2))]" />
            </div>
            <div className="h-2 sm:h-2.5 lg:h-3 xl:h-3.5 rounded-b-[4px] wood-h [--wood:#6A422C] shadow-[inset_0_1px_0_rgb(255_226_196/0.4),inset_0_-1px_0_rgb(30_14_4/0.55),0_1px_2px_rgb(40_20_10/0.3)]" />
            <div aria-hidden="true" className="absolute left-[3%] right-[3%] top-[calc(100%_-_4px)] h-3 sm:h-4 lg:h-5 -z-10 rounded-[50%] bg-[rgb(40_20_10/0.22)] blur-[6px] sm:blur-[8px] pointer-events-none" />
            {children && <div className="absolute inset-0">{children}</div>}
        </div>
    );
}

/** Soft contact shadow under a cat sitting on the sill. */
export function SillShadow() {
    return (
        <span aria-hidden="true" className="absolute left-1/2 -translate-x-1/2 bottom-[3px] sm:bottom-1 lg:bottom-1.5 w-3/4 h-2 sm:h-2.5 lg:h-3 rounded-[50%] bg-[rgb(40_20_10/0.3)] blur-[2px]" />
    );
}

/* ------------------------------------------------------------------ */
/* Sill props                                                          */
/* ------------------------------------------------------------------ */

const PLANT = [
    ".......g......",
    "......gG..g...",
    "..g...gG.gG...",
    "..Gg..GgGG....",
    "...GGgGG..gg..",
    ".gg.GGG..gGG..",
    "..GGgGG.GGg...",
    "....GGGGG.....",
    "...PPPPPPPP...",
    "...pPPPPPPp...",
    "....pPPPPp....",
    "....pPPPPp....",
    ".....pppp.....",
] as const;

export function SillPlant({ className }: { className?: string }) {
    return (
        <PixelArt
            rows={PLANT}
            palette={{ G: "#5DB37E", g: "#86D19E", P: "#F2A37E", p: "#D9835F" }}
            className={className}
        />
    );
}

/* ------------------------------------------------------------------ */
/* Laptop                                                              */
/* ------------------------------------------------------------------ */

/**
 * The visitor's own laptop, seen from the chair: the lid faces us and its screen
 * holds the app preview. Drawn smooth on purpose (it's the real-world object),
 * in the window's art style:
 * - warm materials: champagne brushed aluminium (`metal-h`) and a warm charcoal
 *   bezel, so it sits in the room's light instead of reading as cold grey;
 * - crisp stacked edge bands like the frame and sill (a shade band, then a darker
 *   edge line) rather than soft gradients;
 * - a warm cream highlight on every top edge and warm brown shadows beneath;
 * - the window it faces, faintly reflected in the screen glass.
 *
 * Top to bottom: the aluminium shell rim around the bezel (lens, thicker chin),
 * the hinge, then the keyboard deck lying flat in the desk's perspective, with
 * its keyboard, trackpad and front edge. The deck sits outside the layout flow,
 * so the laptop's box is the lid and hinge only.
 */
export function Laptop({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative w-full">
            {/* Lid: the aluminium shell shows as a bright rim, with a crisp outer edge line */}
            <div className="metal-h [--metal:#CFC7BC] relative rounded-t-[24px] sm:rounded-t-[31px] p-[2px] sm:p-[3px] shadow-[inset_0_1px_0_rgb(255_250_242/0.95),inset_0_0_0_1px_rgb(70_54_40/0.35),0_30px_60px_-30px_rgb(40_20_10/0.45),0_3px_8px_-2px_rgb(40_20_10/0.2)]">
                {/* Bezel: warm charcoal glass, lit along the top, with a shaded chin band */}
                <div className="relative rounded-t-[22px] sm:rounded-t-[28px] bg-[linear-gradient(180deg,#36302C_0%,#26211E_38%,#1C1816_100%)] p-2.5 sm:p-3.5 pb-[clamp(10px,2.6%,26px)] shadow-[inset_0_1px_0_rgb(255_236_214/0.18),inset_0_0_0_1px_rgb(20_14_10/0.6),inset_0_-3px_0_#14110F]">
                    {/* Camera: a lens with a warm glint */}
                    <span
                        aria-hidden="true"
                        className="absolute top-[5px] sm:top-[7px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#6B6A78_0%,#1A1716_55%,#0B0908_100%)] ring-1 ring-[rgb(255_236_214/0.08)]"
                    />
                    {/* Screen: a crisp dark edge where the panel meets the bezel */}
                    <div className="relative overflow-hidden rounded-t-[12px] sm:rounded-t-[16px] rounded-b-[3px] bg-white aspect-[16/10] shadow-[0_0_0_1px_#0E0B0A]">
                        {children}
                        {/* Screen glass: a faint reflection of the window it faces (two pane
                            panels, warm daylight), a diagonal sheen, and a glow along the top */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-[linear-gradient(104deg,transparent_0_6%,rgb(255_246_232/0.09)_6%_15%,transparent_15%_17%,rgb(255_246_232/0.07)_17%_25%,transparent_25%),linear-gradient(115deg,rgb(255_255_255/0.14)_0%,transparent_34%),linear-gradient(180deg,rgb(255_244_228/0.1),transparent_10%)]"
                        />
                        {/* Inner shadow cast by the bezel lip onto the glass */}
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_2px_3px_rgb(20_14_10/0.25)]" />
                    </div>
                    {/* Glossy edge along the chin */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-[6%] bottom-[3px] h-px bg-[linear-gradient(90deg,transparent,rgb(255_236_214/0.14),transparent)]"
                    />
                </div>
            </div>
            <div aria-hidden="true" className="relative">
                {/* Hinge: warm dark band in the lid's shadow, crisp edge underneath */}
                <div className="relative mx-[2%] h-[clamp(3px,0.5%,5px)] bg-[linear-gradient(180deg,#2E2724,#130F0D)] shadow-[inset_0_-1px_0_#0A0807]" />
                {/*
                  Keyboard deck: lies in the desk's plane at the desk's camera angle (--pitch)
                  and recedes toward the desk's vanishing point (--vp, below the hinge). It
                  hangs off the hinge toward the viewer, outside the layout flow, so its
                  camera sits twice as far back (--cam × 2) to give the gentle flare it
                  would have resting deeper in the scene. --deck-pitch lets the landing
                  hold the front edge up a little in the air.
                */}
                <div className="absolute inset-x-0 top-full h-0 [perspective:calc(var(--cam,2000px)*2)] [perspective-origin:50%_var(--vp,0px)]">
                    <div data-laptop-deck className="bg-[#E2DBD0] relative w-full aspect-[var(--deck-aspect,1/0.6)] origin-top [transform:rotateX(var(--deck-pitch,var(--pitch,68deg)))] [transform-style:preserve-3d] rounded-t-[3px] rounded-b-[clamp(10px,2.4%,26px)] shadow-[inset_0_5px_6px_-2px_rgb(40_28_18/0.45),inset_0_0_0_1px_rgb(70_54_40/0.25),inset_0_-2px_0_rgb(255_252_246/0.7)]">
                        {/* Keyboard: light keycaps (14 × 5) with thin outlines, shaded along their bottom edge */}
                        <div className="absolute left-[8%] right-[8%] top-[8%] h-[46%] rounded-[1.5%/3%] bg-[#F5F1EA] bg-[linear-gradient(90deg,#B9AE9F_0_8%,transparent_8%),linear-gradient(180deg,#B9AE9F_0_13%,transparent_13%),linear-gradient(180deg,transparent_80%,rgb(120_100_80/0.14)_80%)] bg-[length:calc(100%/14)_100%,100%_calc(100%/5),100%_calc(100%/5)] shadow-[inset_0_0_0_2px_#B9AE9F,0_1px_0_rgb(255_252_246/0.6)]" />
                        {/* Trackpad */}
                        <div className="bg-[#D8D0C4] absolute left-1/2 -translate-x-1/2 top-[59%] w-[38%] h-[33%] rounded-[5%/8%] shadow-[inset_0_0_0_1px_rgb(70_54_40/0.3),inset_0_1px_0_rgb(255_252_246/0.8),0_1px_0_rgb(255_252_246/0.5)]" />
                        {/* Front edge face: cream top line, shade band and darker edge, like the sill */}
                        <div className="bg-[#E4DDD3] absolute inset-x-0 top-full h-[clamp(7px,1.5%,15px)] origin-top [transform:rotateX(-90deg)] rounded-b-[clamp(10px,2.4%,26px)] shadow-[inset_0_1px_0_rgb(255_252_246/0.95),inset_0_-2px_0_#B4AA9D,inset_0_-3px_0_#8F8578]">
                            {/* Thumb notch, cut into the edge */}
                            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-[14%] h-[55%] rounded-b-md bg-[linear-gradient(180deg,#A39A8E,#C9C1B6)] shadow-[inset_0_1px_2px_rgb(40_28_18/0.35)]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
