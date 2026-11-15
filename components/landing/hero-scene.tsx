/**
 * The hero's "room": a window onto the sky with a sill in front, and the
 * visitor's laptop peeking up from below. Pixel art is used for the things the
 * cats would see (clouds, sun, birds, skyline, plant); the room itself (frame,
 * sill, laptop) is drawn smooth, so the pixel world reads as the view outside.
 *
 * Every pixel graphic here is authored as a character grid and rendered as
 * crisp SVG rects, so it stays sharp at any size.
 */

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

const CLOUD_PALETTE: Palette = { W: "#FFFFFF", S: "#DDEFFC" };

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

/** Distant hills and a low town, on the bottom edge of the glass. */
function Skyline({ className }: { className?: string }) {
    return (
        <svg
            viewBox={`0 0 ${SKY_COLS} ${SKY_ROWS}`}
            preserveAspectRatio="xMidYMax slice"
            shapeRendering="crispEdges"
            className={className}
            aria-hidden="true"
        >
            {HILLS.map((h, x) => (
                <rect key={`h${x}`} x={x} y={SKY_ROWS - h - 4} width={1.02} height={h + 4} fill="#C4E4FA" />
            ))}
            {ROOFS.map((h, x) => (
                <rect key={`r${x}`} x={x} y={SKY_ROWS - h} width={1.02} height={h} fill="#A9D6F5" />
            ))}
        </svg>
    );
}

/**
 * Everything seen through the glass. Parallax refs are attached by the hero
 * (far layers move less than near ones).
 */
export function WindowSky({
    farRef,
    nearRef,
}: {
    farRef?: React.Ref<HTMLDivElement>;
    nearRef?: React.Ref<HTMLDivElement>;
}) {
    return (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden animate-hero-sky">
            {/* Sky: deeper blue at the top, hazy toward the horizon */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#9FD6FF_0%,#C6E8FF_42%,#E6F5FF_78%,#F3FAFF_100%)]" />

            {/* Sun + its glow, upper right */}
            <div className="absolute -top-28 -right-24 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgb(255_244_204/0.85)_0%,rgb(255_244_204/0.35)_35%,transparent_68%)]" />
            <PixelArt
                rows={SUN}
                palette={{ Y: "#FFE59A", H: "#FFF6D6", O: "#FFD27A" }}
                className="hidden sm:block absolute top-8 right-[4%] w-[65px] lg:w-[78px] h-auto"
            />

            {/* Far layer: small clouds + birds, slow */}
            <div ref={farRef} className="absolute inset-0 will-change-transform">
                <div className="absolute top-[14%] left-[8%] animate-cloud-drift-slow [animation-delay:-60s]">
                    <PixelArt rows={CLOUD_SMALL} palette={CLOUD_PALETTE} className="w-[96px] h-auto opacity-90" />
                </div>
                <div className="absolute top-[46%] left-[62%] animate-cloud-drift-slow [animation-delay:-150s]">
                    <PixelArt rows={CLOUD_SMALL} palette={CLOUD_PALETTE} className="w-[80px] h-auto opacity-80" />
                </div>
                <div className="absolute top-[22%] left-[30%] animate-bird-flight">
                    <div className="flex gap-3 items-start">
                        <Bird className="w-[15px]" />
                        <Bird className="w-[12px] mt-2 [animation-delay:-180ms]" />
                    </div>
                </div>
            </div>

            {/* Near layer: big clouds, a little faster */}
            <div ref={nearRef} className="absolute inset-0 will-change-transform">
                <div className="absolute top-[6%] left-[20%] animate-cloud-drift [animation-delay:-20s]">
                    <PixelArt rows={CLOUD_LARGE} palette={CLOUD_PALETTE} className="w-[168px] lg:w-[196px] h-auto" />
                </div>
                <div className="absolute top-[58%] left-[74%] animate-cloud-drift [animation-delay:-75s]">
                    <PixelArt rows={CLOUD_LARGE} palette={CLOUD_PALETTE} className="w-[140px] lg:w-[168px] h-auto" />
                </div>
            </div>

            <Skyline className="absolute inset-x-0 bottom-0 w-full h-[72px] sm:h-[88px] lg:h-[104px]" />

            {/* Glass: soft inner shade at the top and two faint reflections */}
            <div className="absolute inset-0 shadow-[inset_0_14px_28px_-16px_rgb(16_60_100/0.35)]" />
            <div className="absolute -inset-y-10 left-[8%] w-24 rotate-[18deg] bg-white/15" />
            <div className="absolute -inset-y-10 left-[15%] w-8 rotate-[18deg] bg-white/10" />
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
