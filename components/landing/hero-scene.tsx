/**
 * The hero's "room": a window onto the sky with a sill in front, and the
 * visitor's laptop peeking up from below. Pixel art is used for the things the
 * cats would see (clouds, sun, birds, skyline, plant); the room itself (frame,
 * sill, laptop) is drawn smooth, so the pixel world reads as the view outside.
 *
 * Every pixel graphic here is authored as a character grid and rendered as
 * crisp SVG rects, so it stays sharp at any size.
 */

import { useSyncExternalStore } from "react";

type Palette = Record<string, string>;

/** Renders a character grid as pixel-perfect SVG. "." is transparent. */
function PixelArt({
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
            rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={palette[ch]} />);
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

export type SkyPhase = "morning" | "day" | "dusk" | "night";

const SKY_PHASES: readonly SkyPhase[] = ["morning", "day", "dusk", "night"];

interface PhaseTheme {
    /** Sky gradient, top to horizon. The copy sits on its lighter middle. */
    gradient: string;
    glow: string;
    cloud: Palette;
    hill: string;
    roof: string;
    /** Opacity of the lit town windows */
    lights: number;
    birds: boolean;
}

/*
 * Contrast: the headline (ink) stays ≥3:1 on each gradient's top half, and the
 * subtitle switches to a darker ink on dusk and night (see hero-section.tsx),
 * so body copy stays ≥4.5:1 wherever it sits.
 */
const THEMES: Record<SkyPhase, PhaseTheme> = {
    morning: {
        gradient: "linear-gradient(180deg,#B9DDFB 0%,#D6E8FA 40%,#FBE4D4 80%,#FFF2E8 100%)",
        glow: "radial-gradient(circle,rgb(255 220 180/0.9) 0%,rgb(255 220 180/0.35) 35%,transparent 68%)",
        cloud: { W: "#FFFFFF", S: "#F6DCCD" },
        hill: "#D8DEF0",
        roof: "#C0CAE6",
        lights: 0,
        birds: true,
    },
    day: {
        gradient: "linear-gradient(180deg,#9FD6FF 0%,#C6E8FF 42%,#E6F5FF 78%,#F3FAFF 100%)",
        glow: "radial-gradient(circle,rgb(255 244 204/0.85) 0%,rgb(255 244 204/0.35) 35%,transparent 68%)",
        cloud: { W: "#FFFFFF", S: "#DDEFFC" },
        hill: "#C4E4FA",
        roof: "#A9D6F5",
        lights: 0,
        birds: true,
    },
    dusk: {
        gradient: "linear-gradient(180deg,#F0A79C 0%,#F6C2A6 40%,#FCDDC2 75%,#FFEEDF 100%)",
        glow: "radial-gradient(circle,rgb(255 196 140/0.9) 0%,rgb(255 196 140/0.4) 35%,transparent 68%)",
        cloud: { W: "#FFF1E7", S: "#EFB8A8" },
        hill: "#E2B3B0",
        roof: "#C6939C",
        lights: 0.75,
        birds: true,
    },
    night: {
        gradient: "linear-gradient(180deg,#5E73B8 0%,#8597D2 30%,#B9C5EC 55%,#D3DAF3 80%,#E4E8F8 100%)",
        glow: "radial-gradient(circle,rgb(226 232 255/0.6) 0%,rgb(226 232 255/0.2) 35%,transparent 68%)",
        cloud: { W: "#DDE3F7", S: "#AEB9E0" },
        hill: "#8F9ED1",
        roof: "#6E7EB9",
        lights: 1,
        birds: false,
    },
};

function phaseForHour(hour: number): SkyPhase {
    if (hour >= 5 && hour < 9) return "morning";
    if (hour >= 9 && hour < 17) return "day";
    if (hour >= 17 && hour < 20) return "dusk";
    return "night";
}

function getClientPhase(): SkyPhase {
    // QA override in development only: ?sky=morning|day|dusk|night
    if (process.env.NODE_ENV === "development") {
        const forced = new URLSearchParams(window.location.search).get("sky");
        if (forced && (SKY_PHASES as readonly string[]).includes(forced)) return forced as SkyPhase;
    }
    return phaseForHour(new Date().getHours());
}

function subscribePhase(onChange: () => void) {
    // Re-check once a minute so a long visit crosses into dusk on its own.
    const id = window.setInterval(onChange, 60_000);
    return () => window.clearInterval(id);
}

/**
 * The visitor's local time of day. The page is prerendered as "day"; the real
 * phase takes over right after hydration (while the sky is still settling in).
 */
export function useSkyPhase(): SkyPhase {
    return useSyncExternalStore(subscribePhase, getClientPhase, () => "day");
}

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

function Celestial({ phase }: { phase: SkyPhase }) {
    const show = (p: SkyPhase) => (phase === p ? "opacity-100" : "opacity-0");
    const fade = "transition-opacity duration-1000 ease-out";
    return (
        <>
            {/* Glows (one per phase, crossfaded) */}
            {SKY_PHASES.map((p) => (
                <div
                    key={p}
                    className={`absolute w-[420px] h-[420px] rounded-full ${fade} ${show(p)} ${
                        p === "dusk" ? "top-[18%] -right-24" : p === "morning" ? "-top-6 -right-24" : "-top-28 -right-24"
                    }`}
                    style={{ background: THEMES[p].glow }}
                />
            ))}

            {/* Sun: high at day, lower and warmer at morning and dusk */}
            <PixelArt
                rows={SUN}
                palette={{ Y: "#FFE59A", H: "#FFF6D6", O: "#FFD27A" }}
                className={`hidden sm:block absolute top-20 lg:top-28 right-[7%] lg:right-[5.5%] w-[65px] xl:w-[78px] h-auto ${fade} ${show("day")}`}
            />
            <PixelArt
                rows={SUN}
                palette={{ Y: "#FFD69C", H: "#FFF1D9", O: "#FFBC80" }}
                className={`hidden sm:block absolute top-[26%] right-[7%] lg:right-[5.5%] w-[65px] xl:w-[78px] h-auto ${fade} ${show("morning")}`}
            />
            <PixelArt
                rows={SUN}
                palette={{ Y: "#FFB36B", H: "#FFD7A3", O: "#F28E4E" }}
                className={`hidden sm:block absolute top-[44%] right-[7%] lg:right-[5.5%] w-[65px] xl:w-[78px] h-auto ${fade} ${show("dusk")}`}
            />

            {/* Night: moon and twinkling stars */}
            <div className={`${fade} ${show("night")}`}>
                <PixelArt
                    rows={MOON}
                    palette={{ M: "#FFF3C9", S: "#EBD99E" }}
                    className="hidden sm:block absolute top-20 lg:top-28 right-[8%] lg:right-[6.5%] w-[46px] lg:w-[56px] h-auto"
                />
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

/** Distant hills and a low town, on the bottom edge of the glass. */
function Skyline({ phase, className }: { phase: SkyPhase; className?: string }) {
    const theme = THEMES[phase];
    return (
        <svg
            viewBox={`0 0 ${SKY_COLS} ${SKY_ROWS}`}
            preserveAspectRatio="xMidYMax slice"
            shapeRendering="crispEdges"
            className={className}
            aria-hidden="true"
        >
            {HILLS.map((h, x) => (
                <rect key={`h${x}`} x={x} y={SKY_ROWS - h - 4} width={1.02} height={h + 4} fill={theme.hill} />
            ))}
            {ROOFS.map((h, x) => (
                <rect key={`r${x}`} x={x} y={SKY_ROWS - h} width={1.02} height={h} fill={theme.roof} />
            ))}
            <g opacity={theme.lights} className="transition-opacity duration-1000">
                {LIT_WINDOWS.map(({ x, y }) => (
                    <rect key={`w${x}`} x={x} y={y} width={1} height={1} fill="#FFE08A" />
                ))}
            </g>
        </svg>
    );
}

/**
 * Everything seen through the glass, for the visitor's time of day. Parallax
 * refs are attached by the hero (far layers move less than near ones).
 */
export function WindowSky({
    phase,
    farRef,
    nearRef,
}: {
    phase: SkyPhase;
    farRef?: React.Ref<HTMLDivElement>;
    nearRef?: React.Ref<HTMLDivElement>;
}) {
    const theme = THEMES[phase];
    return (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden animate-hero-sky">
            {/* Sky gradients, crossfaded when the phase changes */}
            {SKY_PHASES.map((p) => (
                <div
                    key={p}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-out ${phase === p ? "opacity-100" : "opacity-0"}`}
                    style={{ background: THEMES[p].gradient }}
                />
            ))}

            <Celestial phase={phase} />

            {/* Far layer: small clouds + birds, slow */}
            <div ref={farRef} className="absolute inset-0 will-change-transform">
                <div className="absolute top-[14%] left-[8%] animate-cloud-drift-slow [animation-delay:-60s]">
                    <PixelArt rows={CLOUD_SMALL} palette={theme.cloud} className="w-[96px] h-auto opacity-90" />
                </div>
                <div className="absolute top-[46%] left-[62%] animate-cloud-drift-slow [animation-delay:-150s]">
                    <PixelArt rows={CLOUD_SMALL} palette={theme.cloud} className="w-[80px] h-auto opacity-80" />
                </div>
                {theme.birds && (
                    <div className="absolute top-[22%] left-[30%] animate-bird-flight">
                        <div className="flex gap-3 items-start">
                            <Bird className="w-[15px]" />
                            <Bird className="w-[12px] mt-2 [animation-delay:-180ms]" />
                        </div>
                    </div>
                )}
            </div>

            {/* Near layer: big clouds, a little faster */}
            <div ref={nearRef} className="absolute inset-0 will-change-transform">
                <div className="absolute top-[6%] left-[20%] animate-cloud-drift [animation-delay:-20s]">
                    <PixelArt rows={CLOUD_LARGE} palette={theme.cloud} className="w-[168px] lg:w-[196px] h-auto" />
                </div>
                <div className="absolute top-[58%] left-[74%] animate-cloud-drift [animation-delay:-75s]">
                    <PixelArt rows={CLOUD_LARGE} palette={theme.cloud} className="w-[140px] lg:w-[168px] h-auto" />
                </div>
            </div>

            <Skyline phase={phase} className="absolute inset-x-0 bottom-0 w-full h-[72px] sm:h-[88px] lg:h-[104px]" />

            {/* Soft shade under the head of the frame */}
            <div className="absolute inset-0 shadow-[inset_0_14px_28px_-16px_rgb(16_60_100/0.35)]" />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Paw prints on the glass                                             */
/* ------------------------------------------------------------------ */

const PAW = [
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

/** Walnut frame colours (tokens in globals.css, shared with the sill and header). */
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
function CasementPanel({ side }: { side: "left" | "right" }) {
    const left = side === "left";
    return (
        <div
            className={`absolute inset-y-0 ${left ? "left-[9px] sm:left-3 lg:left-4 xl:left-5 origin-left" : "right-[9px] sm:right-3 lg:right-4 xl:right-5 origin-right"} w-[80px] sm:w-[150px] lg:w-[230px] xl:w-[290px] [--p:500px] sm:[--p:800px] lg:[--p:1100px] xl:[--p:1300px] [--a:64deg] sm:[--a:60deg] lg:[--a:58deg] shadow-[0_0_0_1px_var(--color-window-frame-edge)]`}
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
                side === "left" ? "left-[6px] sm:left-[9px] lg:left-3 xl:left-4" : "right-[6px] sm:right-[9px] lg:right-3 xl:right-4"
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
export function WindowFrame() {
    const jamb = "absolute inset-y-0 w-[9px] sm:w-3 lg:w-4 xl:w-5 wood-v";
    return (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            {/* Panels hang outside, behind the frame */}
            <CasementPanel side="left" />
            <CasementPanel side="right" />

            {/* Depth: the frame shades the edges of the opening */}
            <div className="absolute inset-0 shadow-[inset_0_0_32px_rgb(40_20_10/0.22)]" />

            {/* Frame: casing with an inner stop moulding (the two-step edge facing the opening) */}
            <div
                className={`${jamb} left-0 shadow-[inset_1px_0_0_rgb(255_232_205/0.2),inset_-3px_0_0_var(--color-window-frame-shade),inset_-4px_0_0_var(--color-window-frame-edge),5px_0_9px_-4px_rgb(40_20_10/0.5)]`}
            />
            <div
                className={`${jamb} right-0 shadow-[inset_-1px_0_0_rgb(255_232_205/0.2),inset_3px_0_0_var(--color-window-frame-shade),inset_4px_0_0_var(--color-window-frame-edge),-5px_0_9px_-4px_rgb(40_20_10/0.5)]`}
            />
            <div className="absolute inset-x-0 top-0 h-[9px] sm:h-3 lg:h-4 xl:h-5 wood-h shadow-[inset_0_-3px_0_var(--color-window-frame-shade),inset_0_-4px_0_var(--color-window-frame-edge),0_5px_9px_-4px_rgb(40_20_10/0.5)]" />
            <div className="absolute inset-x-0 bottom-0 h-1.5 sm:h-2 lg:h-2.5 xl:h-3 wood-h shadow-[inset_0_3px_0_var(--color-window-frame-shade),inset_0_4px_0_var(--color-window-frame-edge),0_-4px_8px_-4px_rgb(40_20_10/0.4)]" />

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
 * holds the app preview. Drawn smooth on purpose (it's the real-world object).
 */
export function Laptop({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative w-full">
            {/* Lid */}
            <div className="relative rounded-t-[22px] sm:rounded-t-[28px] bg-[linear-gradient(180deg,#2B2D31,#1C1D20)] p-2.5 sm:p-3.5 pb-0 shadow-[0_30px_60px_-30px_rgb(20_30_50/0.45)] ring-1 ring-black/40">
                {/* Camera */}
                <span
                    aria-hidden="true"
                    className="absolute top-[5px] sm:top-[7px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0D0E10] ring-1 ring-white/10"
                />
                {/* Screen */}
                <div className="relative overflow-hidden rounded-t-[12px] sm:rounded-t-[16px] bg-white aspect-[16/10]">
                    {children}
                    {/* Screen sheen */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.18)_0%,transparent_38%)]"
                    />
                </div>
            </div>
            {/* Base: the front lip of the keyboard deck, a touch wider than the lid */}
            <div
                aria-hidden="true"
                className="relative -mx-[4%] h-3 sm:h-4 rounded-b-[18px] bg-[linear-gradient(180deg,#E3E6EA,#BFC4CB)] shadow-[0_18px_30px_-12px_rgb(20_30_50/0.35)]"
            >
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-[14%] h-1.5 rounded-b-md bg-[#AEB3BA]" />
            </div>
        </div>
    );
}
