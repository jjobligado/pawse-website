"use client";

import {
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from "react";

interface PixelDividerProps {
    direction: "down" | "up";
    /**
     * Optional callback so a parent section (like DashboardSpreadSection)
     * can drive the pixel progress (0 -> 1) from a shared inertia loop.
     */
    onRegisterUpdater?: (updater: (progress: number) => void) => void;
    className?: string;
}

const TOTAL_COLS = 76;
const CENTER_COL = (TOTAL_COLS - 1) / 2;

// Exact integer column indices (0..75) from the 76x2 Figma grid for the dense base row
const BASE_ROW_COLS = [
    0, 1, 2, 3, 5, 6, 8, 9, 11, 12, 14, 16, 19, 20, 22, 23, 24, 26, 29, 30, 31,
    35, 36, 38, 41, 42, 43, 45, 47, 48, 49, 50, 52, 55, 56, 57, 58, 60, 62, 63,
    66, 67, 69, 70, 71, 73, 74, 75,
];

// Exact integer column indices (0..75) from the 76x2 Figma grid for the outer scattered row
const OUTER_ROW_COLS = [
    0, 1, 5, 9, 10, 13, 15, 18, 20, 21, 23, 26, 27, 30, 32, 33, 35, 37, 40, 42,
    46, 48, 53, 54, 58, 59, 62, 65, 66, 68, 74, 75,
];

const BASE_ROW_SET = new Set(BASE_ROW_COLS);
const OUTER_ROW_SET = new Set(OUTER_ROW_COLS);

interface PixelWindow {
    col: number;
    isOuterRow: boolean;
    x: number;
    width: number;
    startP: number;
    endP: number;
}

function buildPixelWindows(): PixelWindow[] {
    const windows: PixelWindow[] = [];

    const addRow = (cols: number[], rowSet: Set<number>, isOuterRow: boolean) => {
        for (const col of cols) {
            const distFromCenter = Math.abs(col - CENTER_COL) / CENTER_COL;
            const hash = (col * 41 + (isOuterRow ? 19 : 7)) % 11;

            // Curved center-out arc (matching the circular gradient wave front) + organic per-pixel digital jitter
            const arcDistance = Math.pow(distFromCenter, 1.25);
            const waveOffset = arcDistance * 0.36 + (hash / 10) * 0.16;
            // Outer row blinks in right after the base row in that column
            const rowOffset = isOuterRow ? 0.22 : 0;
            const duration = 0.24;

            const startP = waveOffset + rowOffset;
            const endP = Math.min(startP + duration, 1);

            const hasLeftNeighbor = rowSet.has(col - 1);
            const hasRightNeighbor = rowSet.has(col + 1);
            const x = hasLeftNeighbor ? col - 0.03 : col;
            const width =
                1 +
                (hasLeftNeighbor ? 0.03 : 0) +
                (hasRightNeighbor ? 0.05 : 0);

            windows.push({
                col,
                isOuterRow,
                x,
                width,
                startP,
                endP,
            });
        }
    };

    addRow(BASE_ROW_COLS, BASE_ROW_SET, false);
    addRow(OUTER_ROW_COLS, OUTER_ROW_SET, true);
    return windows;
}

export default function PixelDivider({
    direction,
    onRegisterUpdater,
    className = "",
}: PixelDividerProps) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const rectRefs = useRef<(SVGRectElement | null)[]>([]);
    const pixelWindows = useMemo(() => buildPixelWindows(), []);

    const applyPixelProgress = useCallback(
        (progress: number) => {
            for (let i = 0; i < pixelWindows.length; i++) {
                const el = rectRefs.current[i];
                if (!el) continue;

                const { startP, endP } = pixelWindows[i];

                // Pixelated 2-beat digital blink-in (full 1:1 square blocks, no stretching)
                if (progress <= startP) {
                    el.style.opacity = "0";
                } else if (progress >= endP) {
                    el.style.opacity = "1";
                } else {
                    const localT = (progress - startP) / (endP - startP);
                    if (localT < 0.32) {
                        el.style.opacity = "0.6";
                    } else if (localT < 0.56) {
                        el.style.opacity = "0.08";
                    } else {
                        el.style.opacity = "1";
                    }
                }
            }
        },
        [pixelWindows]
    );

    useEffect(() => {
        if (onRegisterUpdater) {
            onRegisterUpdater(applyPixelProgress);
            return;
        }

        // Standalone scroll-linked inertia mode (used by Footer direction="up")
        if (typeof window === "undefined") return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            applyPixelProgress(1);
            return;
        }

        let targetP = 0;
        let currentP = 0;
        let rafId: number | null = null;
        let isFinished = false;

        const tick = () => {
            // Velocity-capped inertia so the pixel ripple always plays at a clearly visible pace (~1.1s)
            const delta = (targetP - currentP) * 0.055;
            const step = Math.min(Math.max(delta, 0.002), 0.016);
            currentP = Math.min(currentP + step, targetP);

            if (targetP === 1 && 1 - currentP < 0.002) {
                currentP = 1;
                isFinished = true;
            }

            applyPixelProgress(currentP);

            if (!isFinished && Math.abs(targetP - currentP) > 0.001) {
                rafId = window.requestAnimationFrame(tick);
            } else {
                rafId = null;
            }
        };

        const onScroll = () => {
            if (isFinished) return;
            const el = svgRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;

            // Wait until the Footer divider is comfortably inside the viewport (82% vh -> 65% vh)
            // so the user is looking right at it when the pixels sprout upward.
            const startY = vh * 0.82;
            const endY = vh * 0.65;
            const rawP = (startY - rect.top) / Math.max(startY - endY, 1);
            const clamped = Math.min(Math.max(rawP, 0), 1);

            const atPageBottom =
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 20;

            const nextTarget = clamped >= 0.65 || atPageBottom ? 1 : clamped;

            if (nextTarget > targetP) {
                targetP = nextTarget;
                if (targetP === 1) {
                    window.removeEventListener("scroll", onScroll);
                    window.removeEventListener("resize", onScroll);
                }
                if (rafId === null) {
                    rafId = window.requestAnimationFrame(tick);
                }
            }
        };

        applyPixelProgress(0);
        onScroll();

        if (targetP < 1) {
            window.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", onScroll, { passive: true });
        }

        return () => {
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
            }
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [applyPixelProgress, onRegisterUpdater]);

    // Sub-pixel overlap bleed prevents hairline gaps between adjacent pixels
    // and between the divider and the adjacent #A8DCFF section at any screen size or zoom level.
    const baseRowY = direction === "down" ? -0.06 : 0.96;
    const baseRowHeight = 1.12;
    const outerRowY = direction === "down" ? 0.96 : 0;
    const outerRowHeight = 1.04;

    const seamOverlapClass = direction === "down" ? "-mt-px" : "-mb-px";

    return (
        <svg
            ref={svgRef}
            viewBox="0 0 76 2"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className={`w-full aspect-[76/2] block select-none ${seamOverlapClass} ${className}`}
        >
            {pixelWindows.map((pw, idx) => (
                <rect
                    key={`${pw.isOuterRow ? "outer" : "base"}-${pw.col}`}
                    ref={(el) => {
                        rectRefs.current[idx] = el;
                    }}
                    x={pw.x}
                    y={pw.isOuterRow ? outerRowY : baseRowY}
                    width={pw.width}
                    height={pw.isOuterRow ? outerRowHeight : baseRowHeight}
                    fill="#A8DCFF"
                    style={{
                        opacity: 0,
                    }}
                />
            ))}
        </svg>
    );
}

export function DashboardSpreadSection({ children }: { children: ReactNode }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const gradientRef = useRef<HTMLDivElement | null>(null);
    const pixelUpdaterRef = useRef<((progress: number) => void) | null>(null);

    const handleRegisterPixelUpdater = useCallback(
        (updater: (progress: number) => void) => {
            pixelUpdaterRef.current = updater;
        },
        []
    );

    useEffect(() => {
        if (typeof window === "undefined") return;

        const applyUnifiedProgress = (p: number) => {
            const gradEl = gradientRef.current;
            if (gradEl) {
                // Phase 1 (p: 0.00 -> 0.70): True circular radial spread from top-center (50% 0%)
                // with zero rectangular scaling, expanding as a pure circle across the section.
                const gradP = Math.min(Math.max(p / 0.70, 0), 1);
                const easedGrad = 1 - Math.pow(1 - gradP, 1.85);

                const opacity = Math.min(gradP * 3.5, 1);

                // Pure circular reveal mask (circle farthest-corner at 50% 0%):
                // - Expands from 0% radius at top-center out to 122% (covering the farthest bottom corners)
                // - Bottom of the circle touches bottom-center first, then sweeps outward to the left/right corners
                const outerR = easedGrad * 122;
                const midR = easedGrad * 108;
                const solidR = Math.max(0, easedGrad * 101 - (1 - easedGrad) * 16);

                const mask =
                    easedGrad >= 0.995
                        ? "none"
                        : `radial-gradient(circle farthest-corner at 50% 0%, #000 0%, #000 ${solidR.toFixed(1)}%, rgba(0,0,0,0.45) ${midR.toFixed(1)}%, transparent ${outerR.toFixed(1)}%)`;

                gradEl.style.opacity = opacity.toFixed(3);
                gradEl.style.webkitMaskImage = mask;
                gradEl.style.maskImage = mask;
            }

            // Phase 2 (p: 0.36 -> 1.00): Center pixels sprout right as the bottom of the circle
            // touches the bottom-center seam (p = 0.36), rippling outward along the circular arc!
            if (pixelUpdaterRef.current) {
                const pixelP = Math.min(Math.max((p - 0.36) / 0.64, 0), 1);
                pixelUpdaterRef.current(pixelP);
            }
        };

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            applyUnifiedProgress(1);
            return;
        }

        let targetP = 0;
        let currentP = 0;
        let rafId: number | null = null;
        let isFinished = false;

        const tick = () => {
            // Velocity-capped inertia (~1.4s full top-to-bottom travel) so even if the user
            // scrolls quickly, they clearly see the blue gradient wash down and burst into pixels.
            const delta = (targetP - currentP) * 0.048;
            const step = Math.min(Math.max(delta, 0.0018), 0.012);
            currentP = Math.min(currentP + step, targetP);

            if (targetP === 1 && 1 - currentP < 0.002) {
                currentP = 1;
                isFinished = true;
            }

            applyUnifiedProgress(currentP);

            if (!isFinished && Math.abs(targetP - currentP) > 0.001) {
                rafId = window.requestAnimationFrame(tick);
            } else {
                rafId = null;
            }
        };

        const onScroll = () => {
            if (isFinished) return;
            const el = containerRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;

            // Wait to start until the Dashboard is well inside the user's focal area (top at 45% vh),
            // and complete as the bottom pixel seam reaches 62% vh (right near the center of the screen!).
            const startTop = vh * 0.45;
            const endTop = vh * 0.62 - rect.height;
            const totalTravel = Math.max(startTop - endTop, 1);

            const rawP = (startTop - rect.top) / totalTravel;
            const clamped = Math.min(Math.max(rawP, 0), 1);

            // Once the user scrolls the pixel seam into the lower-middle of the screen (72%+),
            // latch targetP to 1.0 so the wave glides all the way through the pixels in plain sight.
            const nextTarget = clamped >= 0.72 ? 1 : clamped;

            if (nextTarget > targetP) {
                targetP = nextTarget;
                if (targetP === 1) {
                    window.removeEventListener("scroll", onScroll);
                    window.removeEventListener("resize", onScroll);
                }
                if (rafId === null) {
                    rafId = window.requestAnimationFrame(tick);
                }
            }
        };

        applyUnifiedProgress(0);
        onScroll();

        if (targetP < 1) {
            window.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", onScroll, { passive: true });
        }

        return () => {
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
            }
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return (
        <section className="w-full flex flex-col">
            <div
                ref={containerRef}
                className="relative w-full pt-12 pb-24 md:pt-16 md:pb-32 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-6 bg-white overflow-hidden"
            >
                {/* Unified Inertia Sky-Blue Gradient Layer (True Circular Radial Spread, Top-to-Bottom 0%->100% Color) */}
                <div
                    ref={gradientRef}
                    aria-hidden="true"
                    style={{
                        opacity: 0,
                    }}
                    className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,#FFFFFF_0%,#DCF1FF_80%,#A8DCFF_100%)] will-change-[opacity]"
                />

                {/* Dashboard Foreground Content */}
                <div className="relative z-10 w-full max-w-[1140px] flex flex-col items-stretch gap-6">
                    {children}
                </div>
            </div>

            {/* Seamlessly Connected Pixel Divider driven by the exact same inertia loop */}
            <PixelDivider
                direction="down"
                onRegisterUpdater={handleRegisterPixelUpdater}
            />

            {/* Extra Padding */}
            <div className="w-full h-16 md:h-24 bg-white" />
        </section>
    );
}
