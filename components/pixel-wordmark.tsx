"use client";

import { useEffect, useRef } from "react";
import type { SkyPhase } from "@/components/landing/hero-scene";
import { measureGlyphs, sampleGlyphs, type GlyphData } from "@/lib/pixel-glyphs";

/**
 * Interactive pixel-art "PAWSE" wordmark anchored at the bottom of the footer.
 *
 * Samples the site's loaded Pixelify Sans font (weight 700) onto an integer
 * pixel grid (mirroring "A" and "W" for exact symmetry) and paints each letter
 * in the app's companion colours, framed by a crisp pixel perimeter contour so
 * every letter maintains high graphic contrast against all 4 sky phases and
 * skyline rooftops:
 * - Entrance: letters drop in one by one and bounce onto the sill.
 * - Hover: the letter under the cursor hops two grid pixels (its 1px drop
 *   shadow stays put on the sill).
 * - Pointer move: leaves fading pixel paw-print stamps behind the letters.
 * - Click / tap: bursts pixel confetti and sends a hop wave across the letters.
 * - Sleeps when idle or off-screen, and renders statically under
 *   `prefers-reduced-motion: reduce`.
 */

interface LetterPaint {
    face: string;
    shade: string;
    light: string;
}

interface WordmarkPalette {
    letters: readonly LetterPaint[];
    outline: string;
    pawRgb: string;
    pawAlpha: number;
    sparks?: readonly string[];
    glow?: string;
    fallbackClass: string;
}

const COMPANION_PALETTES: Record<SkyPhase, WordmarkPalette> = {
    morning: {
        letters: [
            { face: "#CFE58A", shade: "#465B12", light: "#ECFEA9" }, // P: Classic green
            { face: "#F8C47F", shade: "#824B04", light: "#FEE1A9" }, // A: Sprint orange
            { face: "#BDA9FE", shade: "#562D94", light: "#E4DAFF" }, // W: Focused purple
            { face: "#7CC8F8", shade: "#124F7A", light: "#D3EDFF" }, // S: Site sky blue
            { face: "#FFA08C", shade: "#8B2E1B", light: "#FFD8CF" }, // E: Coral
        ],
        outline: "#232323",
        pawRgb: "35,35,35",
        pawAlpha: 0.14,
        fallbackClass: "text-ink",
    },
    day: {
        letters: [
            { face: "#C2DC72", shade: "#465B12", light: "#ECFEA9" },
            { face: "#F4B867", shade: "#824B04", light: "#FEE1A9" },
            { face: "#AE96FC", shade: "#562D94", light: "#E4DAFF" },
            { face: "#54B2EE", shade: "#124F7A", light: "#D3EDFF" },
            { face: "#F78C76", shade: "#8B2E1B", light: "#FFD8CF" },
        ],
        outline: "#232323",
        pawRgb: "26,116,174",
        pawAlpha: 0.16,
        fallbackClass: "text-ink",
    },
    dusk: {
        letters: [
            { face: "#D4DF82", shade: "#465B12", light: "#FFF0B8" },
            { face: "#F5B26B", shade: "#824B04", light: "#FFE2B0" },
            { face: "#C4A2F0", shade: "#562D94", light: "#F2D9FF" },
            { face: "#7EBBE8", shade: "#124F7A", light: "#FFE3D6" },
            { face: "#F28D82", shade: "#8B2E1B", light: "#FFD8C9" },
        ],
        outline: "#232323",
        pawRgb: "35,35,35",
        pawAlpha: 0.15,
        fallbackClass: "text-ink",
    },
    night: {
        letters: [
            { face: "#A9C46C", shade: "#141414", light: "#FFE7B0" },
            { face: "#E0A35C", shade: "#141414", light: "#FFE7B0" },
            { face: "#9C89E0", shade: "#141414", light: "#FFE7B0" },
            { face: "#68A8DC", shade: "#141414", light: "#FFE7B0" },
            { face: "#DE847A", shade: "#141414", light: "#FFE7B0" },
        ],
        outline: "#141414",
        pawRgb: "20,20,20",
        pawAlpha: 0.18,
        sparks: ["#FFE7B0", "#A9C46C", "#E0A35C", "#9C89E0", "#68A8DC"],
        glow: "rgba(255,231,176,0.3)",
        fallbackClass: "text-ink-strong",
    },
};

const BLEED_TOP = 0.35;
const BLEED_BOTTOM = 0.12;

const DROP_MS = 760;
const DROP_STAGGER_MS = 120;
const HOP_MS = 300;
const STAMP_LIFE_MS = 1500;
const SPARK_LIFE_MS = 950;

/** 6×6 paw print, drawn at half the wordmark's pixel size. */
const PAW_PATTERN = [".X..X.", "X....X", "..XX..", ".XXXX.", ".XXXX.", "..XX.."] as const;

interface Cell {
    col: number;
    row: number;
    letter: number;
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
}

interface LetterBox {
    left: number;
    right: number;
    topRow: number;
}

interface Stamp {
    x: number;
    y: number;
    at: number;
}

interface Spark {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    at: number;
}

function easeOutBounce(t: number): number {
    const n = 7.5625;
    const d = 2.75;
    if (t < 1 / d) return n * t * t;
    if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
    if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
    return n * (t -= 2.625 / d) * t + 0.984375;
}

export default function PixelWordmark({ phase = "day" }: { phase?: SkyPhase }) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const paletteRef = useRef<WordmarkPalette>(COMPANION_PALETTES[phase]);
    const redrawRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        paletteRef.current = COMPANION_PALETTES[phase];
        redrawRef.current?.();
    }, [phase]);

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const finePointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");

        let disposed = false;
        let glyphData: GlyphData | null = null;
        let width = 0;
        let height = 0;
        let bleedTop = 0;
        let bleedBottom = 0;
        let step = 0;
        let rows = 20;
        let yOffset = 0;
        let cellsByLetter: Cell[][] = [];
        let letters: LetterBox[] = [];

        let entranceStart = -1;
        const hops = [-1, -1, -1, -1, -1];
        const stamps: Stamp[] = [];
        const sparks: Spark[] = [];
        let hovered = -1;
        let lastStampX = Number.NaN;
        let lastStampY = Number.NaN;
        let stampSide = 1;

        let inView = false;
        let rafId: number | null = null;

        const colX = (col: number) => (col + 0.25) * step;
        const rowY = (row: number) => bleedTop + yOffset + row * step;
        const snap = (v: number) => Math.round(v / step) * step;

        const buildGrid = () => {
            if (!glyphData) return;
            const rect = wrap.getBoundingClientRect();
            if (rect.width < 2 || rect.height < 2) return;

            width = rect.width;
            height = rect.height;
            rows = width < 520 ? 14 : 20;
            const gapCols = width < 520 ? 2 : 3;
            const sampled = sampleGlyphs(glyphData, rows);
            if (!sampled) return;

            const cols = sampled.reduce((sum, g) => sum + g.gCols, 0) + gapCols * (sampled.length - 1);
            // Leave 0.25 col on the left for the outer contour and 1 col/row on the right/bottom for the drop shadow
            step = width / (cols + 1.25);
            yOffset = Math.max(0, height - (rows + 1) * step);
            bleedTop = Math.round(height * BLEED_TOP);
            bleedBottom = Math.round(height * BLEED_BOTTOM);

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round((height + bleedTop + bleedBottom) * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            cellsByLetter = [];
            letters = [];
            let colStart = 0;
            sampled.forEach((g, i) => {
                const list: Cell[] = [];
                let topRow = rows;
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < g.gCols; c++) {
                        if (!g.grid[r][c]) continue;
                        if (r < topRow) topRow = r;
                        list.push({
                            col: colStart + c,
                            row: r,
                            letter: i,
                            top: r === 0 || !g.grid[r - 1][c],
                            bottom: r === rows - 1 || !g.grid[r + 1][c],
                            left: c === 0 || !g.grid[r][c - 1],
                            right: c === g.gCols - 1 || !g.grid[r][c + 1],
                        });
                    }
                }
                cellsByLetter.push(list);
                letters.push({ left: colX(colStart), right: colX(colStart + g.gCols), topRow });
                colStart += g.gCols + gapCols;
            });
        };

        const entranceOffset = (i: number, now: number, reduced: boolean): number | null => {
            if (reduced) return 0;
            if (entranceStart < 0) return null;
            const t = (now - entranceStart - i * DROP_STAGGER_MS) / DROP_MS;
            if (t <= 0) return null;
            if (t >= 1) return 0;
            // Start fully above the canvas, fall, and bounce on the sill
            return -rowY(rows) * (1 - easeOutBounce(t));
        };

        const landed = (i: number, now: number) =>
            reducedMq.matches || (entranceStart >= 0 && now - entranceStart - i * DROP_STAGGER_MS >= DROP_MS);

        const hopOffset = (i: number, now: number) => {
            const start = hops[i];
            if (start < 0) return 0;
            const t = (now - start) / HOP_MS;
            if (t < 0) return 0; // queued by a click wave
            if (t >= 1) {
                hops[i] = -1;
                return 0;
            }
            return -step * 2 * Math.sin(Math.PI * t);
        };

        const drawFrame = (now: number, reduced: boolean) => {
            if (!width || letters.length === 0) return;
            ctx.clearRect(0, 0, width, height + bleedTop + bleedBottom);
            ctx.globalAlpha = 1;
            const palette = paletteRef.current;

            // 1. Paw prints (behind the letters), fading out in steps
            const paw = step * 0.5;
            for (const s of stamps) {
                const age = now - s.at;
                if (age >= STAMP_LIFE_MS) continue;
                const level = Math.ceil((1 - age / STAMP_LIFE_MS) * 4) / 4;
                ctx.fillStyle = `rgba(${palette.pawRgb},${(palette.pawAlpha * level).toFixed(3)})`;
                const ox = s.x - 3 * paw;
                const oy = s.y - 3 * paw;
                for (let r = 0; r < PAW_PATTERN.length; r++) {
                    for (let c = 0; c < PAW_PATTERN[r].length; c++) {
                        if (PAW_PATTERN[r][c] !== "X") continue;
                        const x0 = Math.round(ox + c * paw);
                        const y0 = Math.round(oy + r * paw);
                        ctx.fillRect(x0, y0, Math.round(ox + (c + 1) * paw) - x0, Math.round(oy + (r + 1) * paw) - y0);
                    }
                }
            }

            // 2. Letters: 1-cell drop shadow, outer pixel contour, bright face, and top highlight
            const drops = letters.map((_, i) => {
                const e = entranceOffset(i, now, reduced);
                return e === null ? null : snap(e);
            });
            const lifts = letters.map((_, i) => (reduced ? 0 : snap(hopOffset(i, now))));
            const lightH = Math.max(1, Math.round(step * 0.28));
            const b = Math.max(1, Math.round(step * 0.14));

            cellsByLetter.forEach((list, i) => {
                const drop = drops[i];
                if (drop === null) return;
                const paint = palette.letters[i % palette.letters.length];
                const shade = new Path2D();
                const border = new Path2D();
                const face = new Path2D();
                const light = new Path2D();

                for (const cell of list) {
                    const x0 = Math.round(colX(cell.col));
                    const x1 = Math.round(colX(cell.col + 1));
                    const w = x1 - x0;
                    // Shadow stays anchored on the sill while the letter hops
                    const sy0 = Math.round(rowY(cell.row) + drop + step);
                    const sy1 = Math.round(rowY(cell.row + 1) + drop + step);
                    shade.rect(Math.round(x0 + step), sy0, Math.round(x1 + step) - Math.round(x0 + step), sy1 - sy0);

                    const y0 = Math.round(rowY(cell.row) + drop + lifts[i]);
                    const y1 = Math.round(rowY(cell.row + 1) + drop + lifts[i]);
                    const h = y1 - y0;
                    face.rect(x0, y0, w, h);
                    if (cell.top) {
                        light.rect(x0, y0, w, lightH);
                        border.rect(x0 - b, y0 - b, w + b * 2, b);
                    }
                    if (cell.bottom) border.rect(x0 - b, y1, w + b * 2, b);
                    if (cell.left) border.rect(x0 - b, y0 - b, b, h + b * 2);
                    if (cell.right) border.rect(x1, y0 - b, b, h + b * 2);
                }

                ctx.fillStyle = paint.shade;
                ctx.fill(shade);
                ctx.fillStyle = palette.outline;
                ctx.fill(border);

                if (palette.glow) {
                    ctx.save();
                    ctx.shadowColor = palette.glow;
                    ctx.shadowBlur = step * 0.9;
                    ctx.fillStyle = paint.face;
                    ctx.fill(face);
                    ctx.fillStyle = paint.light;
                    ctx.fill(light);
                    ctx.restore();
                } else {
                    ctx.fillStyle = paint.face;
                    ctx.fill(face);
                    ctx.fillStyle = paint.light;
                    ctx.fill(light);
                }
            });

            // 3. Click confetti, snapped to half pixels, fading in steps
            const q = step / 2;
            const g = 0.0022 * (step / 13);
            for (const p of sparks) {
                const t = now - p.at;
                if (t >= SPARK_LIFE_MS) continue;
                const x = Math.round((p.x + p.vx * t) / q) * q;
                const y = Math.round((p.y + p.vy * t + 0.5 * g * t * t) / q) * q;
                ctx.globalAlpha = Math.ceil((1 - t / SPARK_LIFE_MS) * 3) / 3;
                ctx.fillStyle = p.color;
                ctx.fillRect(Math.round(x - p.size / 2), Math.round(y - p.size / 2), Math.round(p.size), Math.round(p.size));
            }
            ctx.globalAlpha = 1;
        };

        const tick = (now: number) => {
            rafId = null;
            const reduced = reducedMq.matches;

            for (let i = stamps.length - 1; i >= 0; i--) if (now - stamps[i].at > STAMP_LIFE_MS) stamps.splice(i, 1);
            for (let i = sparks.length - 1; i >= 0; i--) if (now - sparks[i].at > SPARK_LIFE_MS) sparks.splice(i, 1);

            drawFrame(now, reduced);

            const busy =
                (entranceStart >= 0 && now - entranceStart < DROP_STAGGER_MS * 4 + DROP_MS + 60) ||
                hops.some((h) => h >= 0) ||
                stamps.length > 0 ||
                sparks.length > 0;

            if (!reduced && inView && !document.hidden && busy) {
                rafId = window.requestAnimationFrame(tick);
            }
        };

        const wake = () => {
            if (!glyphData || rafId !== null || !inView || document.hidden) return;
            rafId = window.requestAnimationFrame(tick);
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!glyphData || reducedMq.matches || !finePointerMq.matches) return;
            const rect = wrap.getBoundingClientRect();
            const lx = e.clientX - rect.left;
            const wy = e.clientY - rect.top;
            const inside = lx >= 0 && lx <= width && wy >= -height * 0.25 && wy <= height * 1.05;
            if (!inside) {
                hovered = -1;
                lastStampX = Number.NaN;
                return;
            }
            const now = performance.now();
            const ly = wy + bleedTop;

            // Hop the letter under the cursor, once per visit
            const idx = letters.findIndex(
                (box) => lx >= box.left - step && lx <= box.right + step && ly >= rowY(box.topRow) - step * 3
            );
            if (idx !== hovered) {
                hovered = idx;
                if (idx >= 0 && hops[idx] < 0 && landed(idx, now)) {
                    hops[idx] = now;
                    wake();
                }
            }

            // Leave a trail of paw prints, alternating left and right feet
            if (Number.isNaN(lastStampX)) {
                lastStampX = lx;
                lastStampY = ly;
                return;
            }
            const dx = lx - lastStampX;
            const dy = ly - lastStampY;
            const dist = Math.hypot(dx, dy);
            if (dist < step * 4.5) return;
            const half = step / 2;
            const side = stampSide * step * 1.1;
            stamps.push({
                x: Math.round((lx + (-dy / dist) * side) / half) * half,
                y: Math.round((ly + (dx / dist) * side) / half) * half,
                at: now,
            });
            if (stamps.length > 28) stamps.shift();
            stampSide *= -1;
            lastStampX = lx;
            lastStampY = ly;
            wake();
        };

        const onPointerDown = (e: PointerEvent) => {
            if (!glyphData || reducedMq.matches) return;
            const rect = wrap.getBoundingClientRect();
            const lx = e.clientX - rect.left;
            const ly = e.clientY - rect.top + bleedTop;
            const now = performance.now();
            const k = step / 13;
            const palette = paletteRef.current;
            const sparkColors = palette.sparks ?? palette.letters.map((p) => p.face);

            for (let n = 0; n < 22; n++) {
                sparks.push({
                    x: lx,
                    y: ly,
                    vx: (Math.random() - 0.5) * 0.75 * k,
                    vy: -(0.35 + Math.random() * 0.6) * k,
                    size: step * (Math.random() < 0.3 ? 1 : 0.5),
                    color: sparkColors[n % sparkColors.length],
                    at: now,
                });
            }
            if (sparks.length > 88) sparks.splice(0, sparks.length - 88);

            // Hop wave spreading out from the click
            letters.forEach((box, i) => {
                if (!landed(i, now)) return;
                hops[i] = now + Math.abs((box.left + box.right) / 2 - lx) * 0.55;
            });
            wake();
        };

        const syncVisibility = () => {
            if (!glyphData) return;
            if (reducedMq.matches) {
                if (rafId !== null) window.cancelAnimationFrame(rafId);
                rafId = null;
                drawFrame(0, true);
                return;
            }
            if (inView && !document.hidden) {
                if (entranceStart < 0) entranceStart = performance.now() + 80;
                wake();
            } else if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
                rafId = null;
            }
        };

        const io = new IntersectionObserver(
            ([entry]) => {
                inView = entry.isIntersecting;
                syncVisibility();
            },
            { threshold: 0.35 }
        );
        io.observe(wrap);

        const ro = new ResizeObserver(() => {
            buildGrid();
            drawFrame(performance.now(), reducedMq.matches);
            wake();
        });
        ro.observe(wrap);

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        wrap.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("visibilitychange", syncVisibility);
        reducedMq.addEventListener("change", syncVisibility);

        document.fonts.ready.then(() => {
            if (disposed) return;
            const fontFamily = getComputedStyle(wrap).fontFamily || '"Pixelify Sans", monospace';
            glyphData = measureGlyphs(fontFamily);
            if (!glyphData) return;
            buildGrid();
            wrap.dataset.ready = "";
            syncVisibility();
        });

        redrawRef.current = () => {
            drawFrame(performance.now(), reducedMq.matches);
        };

        return () => {
            disposed = true;
            redrawRef.current = null;
            if (rafId !== null) window.cancelAnimationFrame(rafId);
            io.disconnect();
            ro.disconnect();
            window.removeEventListener("pointermove", onPointerMove);
            wrap.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("visibilitychange", syncVisibility);
            reducedMq.removeEventListener("change", syncVisibility);
        };
    }, []);

    const fallbackClass = COMPANION_PALETTES[phase].fallbackClass;

    return (
        <div ref={wrapRef} className="group/wm relative w-full font-pixel select-none cursor-pointer aspect-[82/20]">
            {/* Pixelify Sans fallback until the canvas is ready */}
            <svg
                aria-hidden="true"
                viewBox="0 0 702 172"
                className={`absolute inset-0 h-full w-full transition-opacity duration-300 group-data-ready/wm:opacity-0 ${fallbackClass}`}
                fill="currentColor"
            >
                <text
                    x="50%"
                    y="53%"
                    dominantBaseline="central"
                    textAnchor="middle"
                    fontFamily="inherit"
                    fontWeight="700"
                    fontSize="260"
                    letterSpacing="6"
                >
                    PAWSE
                </text>
            </svg>

            <canvas
                ref={canvasRef}
                aria-hidden="true"
                className="pointer-events-none absolute left-0 z-[5] w-full"
                style={{ top: `-${BLEED_TOP * 100}%`, height: `${(1 + BLEED_TOP + BLEED_BOTTOM) * 100}%` }}
            />
        </div>
    );
}
