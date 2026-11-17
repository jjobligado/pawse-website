"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive pixel-art "PAWSE" wordmark anchored at the bottom of the footer.
 *
 * Samples the site's loaded Pixelify Sans font (weight 700) glyph-by-glyph onto
 * an integer pixel grid with uniform cell sizes, and mirrors the sampled grids
 * of "A" and "W" so they remain 100% symmetrical:
 * - Renders an instant Pixelify Sans SVG fallback until the canvas is ready.
 * - Cascades pixels in diagonally with a calm fade-and-settle when scrolled into
 *   view, then rests still without periodic flashing.
 * - Reveals a faint ghost pixel field around the cursor on desktop, gently
 *   repelling and deepening nearby pixels, and emits a shockwave on click.
 * - Sleeps completely when idle or off-screen, and renders statically under
 *   `prefers-reduced-motion: reduce`.
 */

type RGB = readonly [number, number, number];
const COLOR_BASE: RGB = [27, 127, 190]; // #1B7FBE (accent-strong-hover)
const COLOR_HOVER: RGB = [20, 78, 118]; // #144E78 (deep azure ink)
const COLOR_ACCENT: RGB = [211, 237, 255]; // #D3EDFF (soft sky highlight for entrance & click ripples)

const ENTRANCE_TOTAL_MS = 1550;
const RIPPLE_DURATION_MS = 1400;
const BLEED_RATIO = 0.24;
const LETTERS = ["P", "A", "W", "S", "E"] as const;

interface RawGlyph {
    ch: (typeof LETTERS)[number];
    canvas: HTMLCanvasElement;
    minX: number;
    minY: number;
    w: number;
    h: number;
}

interface PixelCell {
    x: number;
    y: number;
    delay: number;
}

interface Ripple {
    x: number;
    y: number;
    at: number;
}

function hash01(c: number, r: number): number {
    let h = (Math.imul(c + 1, 374761393) + Math.imul(r + 1, 668265263)) >>> 0;
    h = (h ^ (h >>> 13)) >>> 0;
    h = Math.imul(h, 1274126177) >>> 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function clamp01(v: number): number {
    return v < 0 ? 0 : v > 1 ? 1 : v;
}

function easeOutCubic(t: number): number {
    const u = 1 - t;
    return 1 - u * u * u;
}

function mixRgb(a: RGB, b: RGB, t: number): RGB {
    return [
        Math.round(a[0] + (b[0] - a[0]) * t),
        Math.round(a[1] + (b[1] - a[1]) * t),
        Math.round(a[2] + (b[2] - a[2]) * t),
    ];
}

function rgbStr(c: RGB): string {
    return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/**
 * Rasterizes each letter of "PAWSE" in the resolved Pixelify Sans font so
 * per-glyph integer sampling can keep consistent proportions and exact symmetry.
 */
function measureGlyphs(fontFamily: string): { glyphs: RawGlyph[]; minTop: number; totalH: number } | null {
    const glyphs: RawGlyph[] = [];

    for (const ch of LETTERS) {
        const g = document.createElement("canvas");
        g.width = 400;
        g.height = 420;
        const gctx = g.getContext("2d", { willReadFrequently: true });
        if (!gctx) return null;

        gctx.fillStyle = "#000000";
        gctx.font = `700 260px ${fontFamily}`;
        gctx.textBaseline = "top";
        gctx.fillText(ch, 20, 40);

        const d = gctx.getImageData(0, 0, g.width, g.height).data;
        let minX = g.width;
        let minY = g.height;
        let maxX = 0;
        let maxY = 0;

        for (let y = 0; y < g.height; y++) {
            for (let x = 0; x < g.width; x++) {
                if (d[(y * g.width + x) * 4 + 3] > 20) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        if (maxX <= minX || maxY <= minY) return null;
        glyphs.push({ ch, canvas: g, minX, minY, w: maxX - minX + 1, h: maxY - minY + 1 });
    }

    const minTop = Math.min(...glyphs.map((item) => item.minY));
    const maxBot = Math.max(...glyphs.map((item) => item.minY + item.h));
    return { glyphs, minTop, totalH: maxBot - minTop };
}

export default function PixelWordmark() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const finePointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");

        let disposed = false;
        let glyphData: ReturnType<typeof measureGlyphs> = null;
        let width = 0;
        let height = 0;
        let bleedY = 0;
        let step = 0;
        let box = 0;
        let cols = 82;
        let rows = 20;
        let cells: PixelCell[] = [];
        let haloRadius = 115;

        let entranceStart = -1;
        let pointerX = -1e4;
        let pointerY = -1e4;
        let hoverStrength = 0;
        const ripples: Ripple[] = [];

        let inView = false;
        let rafId: number | null = null;
        let lastFrameTime = 0;

        const buildGrid = () => {
            if (!glyphData) return;
            const rect = wrap.getBoundingClientRect();
            if (rect.width < 2 || rect.height < 2) return;

            width = rect.width;
            rows = width < 520 ? 14 : 20;
            const gapCols = width < 520 ? 2 : 3;

            const sampled: { gCols: number; grid: boolean[][] }[] = [];
            for (const rg of glyphData.glyphs) {
                let gCols = Math.max(6, Math.round((rg.w / glyphData.totalH) * rows));
                if ((rg.ch === "A" || rg.ch === "W") && gCols % 2 !== 0) gCols += 1;

                const samp = document.createElement("canvas");
                samp.width = gCols * 4;
                samp.height = rows * 4;
                const sctx = samp.getContext("2d", { willReadFrequently: true });
                if (!sctx) return;

                sctx.drawImage(
                    rg.canvas,
                    rg.minX,
                    glyphData.minTop,
                    rg.w,
                    glyphData.totalH,
                    0,
                    0,
                    samp.width,
                    samp.height
                );
                const sd = sctx.getImageData(0, 0, samp.width, samp.height).data;
                const grid: boolean[][] = Array.from({ length: rows }, () => Array(gCols).fill(false));

                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < gCols; c++) {
                        let sum = 0;
                        for (let sy = 0; sy < 4; sy++) {
                            for (let sx = 0; sx < 4; sx++) {
                                sum += sd[((r * 4 + sy) * samp.width + (c * 4 + sx)) * 4 + 3];
                            }
                        }
                        grid[r][c] = sum / 4080 >= 0.44;
                    }
                }

                // Mirror A and W after sampling so both sides are guaranteed 100% symmetrical
                if (rg.ch === "A" || rg.ch === "W") {
                    for (let r = 0; r < rows; r++) {
                        for (let c = 0; c < Math.floor(gCols / 2); c++) {
                            grid[r][gCols - 1 - c] = grid[r][c];
                        }
                    }
                }

                // Cap horizontal bars/caps on P and A to at most 4 pixels high without breaking strokes
                if (rows === 20 && rg.ch === "A") {
                    const mid = Math.floor(gCols / 2);
                    // 1. Top solid cap: keep at most 4 consecutive solid rows from row 0
                    let topSolid = 0;
                    for (let r = 0; r <= 6; r++) {
                        if (grid[r][mid - 1] && grid[r][mid]) {
                            topSolid++;
                            if (topSolid > 4) {
                                grid[r][mid - 1] = false;
                                grid[r][mid] = false;
                            }
                        } else {
                            break;
                        }
                    }
                    // 2. Horizontal crossbar (rows 9..17): keep at most 4 consecutive bridged rows
                    const barRows: number[] = [];
                    for (let r = 9; r <= 17; r++) {
                        if (grid[r][mid - 1] && grid[r][mid]) barRows.push(r);
                    }
                    while (barRows.length > 4) {
                        const dropRow = barRows.pop()!;
                        const archRow = Math.min(rows - 1, dropRow + 1);
                        for (let c = 4; c < gCols - 4; c++) {
                            if (!grid[archRow][c]) grid[dropRow][c] = false;
                        }
                        // Fallback if archRow was also solid
                        grid[dropRow][mid - 1] = false;
                        grid[dropRow][mid] = false;
                    }
                }
                if (rows === 20 && rg.ch === "P") {
                    const midCol = Math.floor(gCols / 2);
                    // 1. Top bar (rows 0..6): keep at most 4 bridged rows, preserving right bowl wall
                    let topBridged = 0;
                    for (let r = 0; r <= 6; r++) {
                        if (grid[r][4] && grid[r][midCol]) {
                            topBridged++;
                            if (topBridged > 4) {
                                for (let c = 4; c < gCols - 4; c++) grid[r][c] = false;
                            }
                        }
                    }
                    // 2. Middle bar (rows 8..15): trim from the bottom so the upper edge stays connected to the bowl
                    const midRows: number[] = [];
                    for (let r = 8; r <= 15; r++) {
                        if (grid[r][4] && grid[r][5] && grid[r][6]) midRows.push(r);
                    }
                    while (midRows.length > 4) {
                        const dropRow = midRows.pop()!;
                        for (let c = 4; c < gCols; c++) grid[dropRow][c] = false;
                    }
                }

                sampled.push({ gCols, grid });
            }

            cols = sampled.reduce((sum, item) => sum + item.gCols, 0) + gapCols * (sampled.length - 1);
            step = width / cols;
            box = step * 0.88;
            height = rect.height;
            const yOffset = Math.max(0, (height - rows * step) / 2);
            bleedY = Math.round(height * BLEED_RATIO);
            haloRadius = Math.max(76, Math.min(145, width * 0.11));

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const canvasHeight = height + bleedY * 2;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(canvasHeight * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const next: PixelCell[] = [];
            let colOffset = 0;
            for (const item of sampled) {
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < item.gCols; c++) {
                        if (!item.grid[r][c]) continue;
                        const col = colOffset + c;
                        next.push({
                            x: col * step + step / 2,
                            y: bleedY + yOffset + r * step + step / 2,
                            delay: (0.78 * (col / cols) + 0.22 * (r / rows)) * 620 + hash01(col, r) * 160,
                        });
                    }
                }
                colOffset += item.gCols + gapCols;
            }
            cells = next;
        };

        const drawFrame = (now: number, isReduced: boolean) => {
            if (!width || !height || cells.length === 0) return;

            const canvasHeight = height + bleedY * 2;
            ctx.clearRect(0, 0, width, canvasHeight);

            const elapsedSinceStart = isReduced
                ? 1e9
                : entranceStart < 0
                    ? -1
                    : now - entranceStart;

            const radius = box * 0.15;

            // 1. Faint background grid around pointer (uniform box size, faded by opacity)
            if (!isReduced && hoverStrength > 0.01 && pointerX > -1e3) {
                const cMin = Math.max(0, Math.floor((pointerX - haloRadius) / step));
                const cMax = Math.min(cols - 1, Math.ceil((pointerX + haloRadius) / step));
                const rMin = Math.max(0, Math.floor((pointerY - bleedY - haloRadius) / step));
                const rMax = Math.min(rows - 1, Math.ceil((pointerY - bleedY + haloRadius) / step));

                for (let r = rMin; r <= rMax; r++) {
                    for (let c = cMin; c <= cMax; c++) {
                        const gx = c * step + step / 2;
                        const gy = bleedY + r * step + step / 2;
                        const dist = Math.hypot(gx - pointerX, gy - pointerY);
                        if (dist > haloRadius) continue;
                        const alpha = 0.2 * (1 - dist / haloRadius) * hoverStrength;
                        ctx.fillStyle = `rgba(27,127,190,${alpha.toFixed(3)})`;
                        ctx.beginPath();
                        ctx.roundRect(gx - box / 2, gy - box / 2, box, box, radius);
                        ctx.fill();
                    }
                }
            }

            // 2. Lit pixels: uniform size across every cell; batch static cells into a single Path2D
            const batchPath = new Path2D();

            for (let i = 0; i < cells.length; i++) {
                const cell = cells[i];
                let cx = cell.x;
                let cy = cell.y;
                let alpha = 1;
                let color: RGB | null = null;

                if (!isReduced) {
                    if (elapsedSinceStart < 0) continue;
                    const fadeT = (elapsedSinceStart - cell.delay) / 420;
                    if (fadeT <= 0) continue;
                    if (fadeT < 1) {
                        const eased = easeOutCubic(fadeT);
                        alpha = eased;
                        cy += (1 - eased) * step * 0.75;
                    }

                    const colorT = (elapsedSinceStart - cell.delay) / 680;
                    if (colorT < 1) {
                        color = mixRgb(COLOR_ACCENT, COLOR_BASE, easeOutCubic(clamp01(colorT)));
                    }

                    if (hoverStrength > 0.01) {
                        const dx = cx - pointerX;
                        const dy = cy - pointerY;
                        const dist = Math.hypot(dx, dy);
                        if (dist < haloRadius) {
                            const raw = 1 - dist / haloRadius;
                            const smooth = raw * raw * (3 - 2 * raw) * hoverStrength;
                            if (dist > 0.01) {
                                const push = 8 * smooth;
                                cx += (dx / dist) * push;
                                cy += (dy / dist) * push;
                            }
                            color = mixRgb(color ?? COLOR_BASE, COLOR_HOVER, 0.92 * smooth);
                        }
                    }

                    for (let j = 0; j < ripples.length; j++) {
                        const rp = ripples[j];
                        const age = now - rp.at;
                        const waveR = age * 0.78;
                        const ringDist = Math.abs(Math.hypot(cell.x - rp.x, cell.y - rp.y) - waveR);
                        const band = Math.max(0, 1 - ringDist / 60) * (1 - age / RIPPLE_DURATION_MS);
                        if (band > 0) {
                            const dx = cell.x - rp.x;
                            const dy = cell.y - rp.y;
                            const dist = Math.hypot(dx, dy);
                            if (dist > 0.01) {
                                cx += (dx / dist) * 4 * band;
                                cy += (dy / dist) * 4 * band;
                            }
                            color = mixRgb(color ?? COLOR_BASE, COLOR_ACCENT, 0.85 * band);
                        }
                    }
                }

                if (!color && alpha === 1) {
                    batchPath.roundRect(cx - box / 2, cy - box / 2, box, box, radius);
                } else {
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = rgbStr(color ?? COLOR_BASE);
                    ctx.beginPath();
                    ctx.roundRect(cx - box / 2, cy - box / 2, box, box, radius);
                    ctx.fill();
                }
            }

            ctx.globalAlpha = 1;
            ctx.fillStyle = rgbStr(COLOR_BASE);
            ctx.fill(batchPath);
        };

        const tick = (now: number) => {
            rafId = null;
            const dt = lastFrameTime ? Math.min(64, now - lastFrameTime) : 16;
            lastFrameTime = now;

            const isReduced = reducedMq.matches;
            const targetHover = !isReduced && pointerX > -1e3 ? 1 : 0;
            hoverStrength += (targetHover - hoverStrength) * (1 - Math.exp(-dt / 120));

            for (let i = ripples.length - 1; i >= 0; i--) {
                if (now - ripples[i].at > RIPPLE_DURATION_MS) {
                    ripples.splice(i, 1);
                }
            }

            drawFrame(now, isReduced);

            const entranceBusy = entranceStart >= 0 && now - entranceStart < ENTRANCE_TOTAL_MS;
            const hoverBusy = Math.abs(targetHover - hoverStrength) > 0.004 || targetHover === 1;
            const ripplesBusy = ripples.length > 0;

            if (!isReduced && inView && !document.hidden && (entranceBusy || hoverBusy || ripplesBusy)) {
                rafId = window.requestAnimationFrame(tick);
            } else {
                lastFrameTime = 0;
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
            const ly = e.clientY - rect.top + bleedY;
            const inside =
                lx > -haloRadius &&
                lx < width + haloRadius &&
                e.clientY - rect.top > -haloRadius &&
                e.clientY - rect.top < height + haloRadius;

            if (inside) {
                pointerX = lx;
                pointerY = ly;
                wake();
            } else if (pointerX > -1e3) {
                pointerX = -1e4;
                pointerY = -1e4;
                wake();
            }
        };

        const onPointerDown = (e: PointerEvent) => {
            if (!glyphData || reducedMq.matches) return;
            const rect = wrap.getBoundingClientRect();
            ripples.push({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top + bleedY,
                at: performance.now(),
            });
            if (ripples.length > 4) ripples.shift();
            wake();
        };

        const syncVisibility = () => {
            if (!glyphData) return;
            if (reducedMq.matches) {
                if (rafId !== null) {
                    window.cancelAnimationFrame(rafId);
                    rafId = null;
                }
                drawFrame(0, true);
                return;
            }
            if (inView && !document.hidden) {
                if (entranceStart < 0) entranceStart = performance.now() + 80;
                wake();
            } else if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
                rafId = null;
                lastFrameTime = 0;
            }
        };

        const io = new IntersectionObserver(
            ([entry]) => {
                inView = entry.isIntersecting;
                syncVisibility();
            },
            { threshold: 0.1 }
        );
        io.observe(wrap);

        const ro = new ResizeObserver(() => {
            buildGrid();
            if (reducedMq.matches) drawFrame(0, true);
            else wake();
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

        return () => {
            disposed = true;
            if (rafId !== null) window.cancelAnimationFrame(rafId);
            io.disconnect();
            ro.disconnect();
            window.removeEventListener("pointermove", onPointerMove);
            wrap.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("visibilitychange", syncVisibility);
            reducedMq.removeEventListener("change", syncVisibility);
        };
    }, []);

    return (
        <div
            ref={wrapRef}
            aria-hidden="true"
            className="group/wm relative w-full font-pixel select-none cursor-pointer aspect-[82/20]"
        >
            {/* Typographic Pixelify Sans fallback for SSR / before canvas initialization */}
            <svg
                viewBox="0 0 702 172"
                className="absolute inset-0 h-full w-full text-[#1B7FBE] transition-opacity duration-300 group-data-ready/wm:opacity-0"
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
                className="pointer-events-none absolute left-0 w-full"
                style={{
                    top: `-${BLEED_RATIO * 100}%`,
                    height: `${(1 + BLEED_RATIO * 2) * 100}%`,
                }}
            />
        </div>
    );
}
