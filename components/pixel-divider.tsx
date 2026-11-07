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
     * Optional callback so a parent section (like DashboardSpreadSection or FooterSpreadSection)
     * can drive the pixel progress (0 -> 1) from a shared inertia loop.
     */
    onRegisterUpdater?: (updater: (progress: number) => void) => void;
    className?: string;
}

const TOTAL_COLS = 76;

// Row 0: Full 76-column solid blue pixel row bridging the gradient/footer and the 2 scattered rows
const SOLID_ROW_COLS = Array.from({ length: TOTAL_COLS }, (_, i) => i);

// Row 1: Exact integer column indices (0..75) from the Figma grid for the dense middle row
const BASE_ROW_COLS = [
    0, 1, 2, 3, 5, 6, 8, 9, 11, 12, 14, 16, 19, 20, 22, 23, 24, 26, 29, 30, 31,
    35, 36, 38, 41, 42, 43, 45, 47, 48, 49, 50, 52, 55, 56, 57, 58, 60, 62, 63,
    66, 67, 69, 70, 71, 73, 74, 75,
];

// Row 2: Exact integer column indices (0..75) from the Figma grid for the outer scattered row
const OUTER_ROW_COLS = [
    0, 1, 5, 9, 10, 13, 15, 18, 20, 21, 23, 26, 27, 30, 32, 33, 35, 37, 40, 42,
    46, 48, 53, 54, 58, 59, 62, 65, 66, 68, 74, 75,
];

const SOLID_ROW_SET = new Set(SOLID_ROW_COLS);
const BASE_ROW_SET = new Set(BASE_ROW_COLS);
const OUTER_ROW_SET = new Set(OUTER_ROW_COLS);

interface PixelWindow {
    col: number;
    rowIndex: 0 | 1 | 2;
    blinkPattern: 0 | 1 | 2;
    x: number;
    width: number;
    startP: number;
    endP: number;
}

/**
 * Deterministic 32-bit avalanche hash so neighboring columns/rows get
 * genuinely messy, uncorrelated timings and blink patterns.
 */
function hashPixel(col: number, rowIndex: number, salt: number): number {
    let h =
        Math.imul(col + 1, 374761393) +
        Math.imul(rowIndex + 1, 668265263) +
        Math.imul(salt + 1, 2147483647);
    h = (h ^ (h >>> 13)) >>> 0;
    h = Math.imul(h, 1274126177) >>> 0;
    return (h ^ (h >>> 16)) >>> 0;
}

function buildPixelWindows(): PixelWindow[] {
    const windows: PixelWindow[] = [];

    const addRow = (
        cols: number[],
        rowSet: Set<number>,
        rowIndex: 0 | 1 | 2
    ) => {
        for (const col of cols) {
            const h1 = hashPixel(col, rowIndex, 1);
            const h2 = hashPixel(col, rowIndex, 2);
            const h3 = hashPixel(col, rowIndex, 3);

            // Uncorrelated pseudo-random values in [0, 1]
            const rStart = (h1 % 1000) / 1000;
            const rDur = (h2 % 1000) / 1000;
            const blinkPattern = (h3 % 3) as 0 | 1 | 2;

            // Overlapping, messy scatter windows across the 3 rows:
            // - Row 0 (solid bridge): starts in [0.00, 0.38]
            // - Row 1 (middle row):   starts in [0.08, 0.56] (overlaps heavily with Row 0 & Row 2)
            // - Row 2 (outer row):    starts in [0.18, 0.72]
            const rowBase =
                rowIndex === 0 ? 0.0 : rowIndex === 1 ? 0.08 : 0.18;
            const rowSpread =
                rowIndex === 0 ? 0.38 : rowIndex === 1 ? 0.48 : 0.54;

            const startP = rowBase + rStart * rowSpread;
            const duration = 0.2 + rDur * 0.14;
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
                rowIndex,
                blinkPattern,
                x,
                width,
                startP,
                endP,
            });
        }
    };

    addRow(SOLID_ROW_COLS, SOLID_ROW_SET, 0);
    addRow(BASE_ROW_COLS, BASE_ROW_SET, 1);
    addRow(OUTER_ROW_COLS, OUTER_ROW_SET, 2);
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

                const { startP, endP, blinkPattern } = pixelWindows[i];

                if (progress <= startP) {
                    el.style.opacity = "0";
                } else if (progress >= endP) {
                    el.style.opacity = "1";
                } else {
                    const localT = (progress - startP) / (endP - startP);

                    // 3 distinct digital blink-in patterns for a messy, organic pixel-art fizz
                    if (blinkPattern === 0) {
                        // Fast 3-beat digital stutter-blink
                        if (localT < 0.22) {
                            el.style.opacity = "0.75";
                        } else if (localT < 0.42) {
                            el.style.opacity = "0.05";
                        } else if (localT < 0.64) {
                            el.style.opacity = "0.9";
                        } else if (localT < 0.8) {
                            el.style.opacity = "0.12";
                        } else {
                            el.style.opacity = "1";
                        }
                    } else if (blinkPattern === 1) {
                        // Crisp 2-beat pixel blink
                        if (localT < 0.34) {
                            el.style.opacity = "0.65";
                        } else if (localT < 0.6) {
                            el.style.opacity = "0.06";
                        } else {
                            el.style.opacity = "1";
                        }
                    } else {
                        // Quick spark -> off -> solid lock
                        if (localT < 0.25) {
                            el.style.opacity = "0.5";
                        } else if (localT < 0.52) {
                            el.style.opacity = "0";
                        } else if (localT < 0.76) {
                            el.style.opacity = "0.82";
                        } else {
                            el.style.opacity = "1";
                        }
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

    // Sub-pixel overlap bleed across all 3 rows prevents hairline gaps between adjacent pixels
    // and between Row 0 and the adjacent #A8DCFF section at any screen size or zoom level.
    const getRowY = (rowIndex: 0 | 1 | 2) => {
        if (direction === "down") {
            if (rowIndex === 0) return -0.06;
            if (rowIndex === 1) return 0.95;
            return 1.96;
        } else {
            if (rowIndex === 0) return 1.94;
            if (rowIndex === 1) return 0.95;
            return 0;
        }
    };

    const getRowHeight = (rowIndex: 0 | 1 | 2) => {
        if (rowIndex === 0) return 1.12;
        if (rowIndex === 1) return 1.1;
        return 1.04;
    };

    const seamOverlapClass = direction === "down" ? "-mt-px" : "-mb-px";

    return (
        <svg
            ref={svgRef}
            viewBox="0 0 76 3"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className={`relative z-10 w-full aspect-[76/3] block select-none ${seamOverlapClass} ${className}`}
        >
            {pixelWindows.map((pw, idx) => (
                <rect
                    key={`row-${pw.rowIndex}-col-${pw.col}`}
                    ref={(el) => {
                        rectRefs.current[idx] = el;
                    }}
                    x={pw.x}
                    y={getRowY(pw.rowIndex)}
                    width={pw.width}
                    height={getRowHeight(pw.rowIndex)}
                    fill="#A8DCFF"
                    style={{
                        opacity: 0,
                    }}
                />
            ))}
        </svg>
    );
}

export function DashboardSpreadSection({ id, children }: { id?: string; children: ReactNode }) {
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
                // Phase 1 (p: 0.00 -> 0.56): Top-to-bottom spread with zero scaleY compression
                // and a wide 65%-tall multi-stop sine-eased vertical blend so there is never a harsh horizontal line.
                const gradP = Math.min(Math.max(p / 0.56, 0), 1);
                const easedGrad = 1 - Math.pow(1 - gradP, 1.8);

                const opacity = Math.min(gradP * 3.5, 1);

                // The leading mist sweeps from 0% to 165%, with a 65%-tall feathered transition zone
                const front = easedGrad * 165;
                const s0 = Math.max(0, front - 65);
                const s1 = Math.max(0, front - 50);
                const s2 = Math.max(0, front - 35);
                const s3 = Math.max(0, front - 20);
                const s4 = Math.max(0, front - 8);

                const mask =
                    easedGrad >= 0.995
                        ? "none"
                        : `linear-gradient(180deg, #000 0%, #000 ${s0.toFixed(1)}%, rgba(0,0,0,0.82) ${s1.toFixed(1)}%, rgba(0,0,0,0.52) ${s2.toFixed(1)}%, rgba(0,0,0,0.22) ${s3.toFixed(1)}%, rgba(0,0,0,0.06) ${s4.toFixed(1)}%, transparent ${front.toFixed(1)}%)`;

                gradEl.style.opacity = opacity.toFixed(3);
                gradEl.style.webkitMaskImage = mask;
                gradEl.style.maskImage = mask;
            }

            // Phase 2 (p: 0.30 -> 1.00): Messy pixels blink in right as the soft vertical
            // gradient blend reaches and saturates the bottom border!
            if (pixelUpdaterRef.current) {
                const pixelP = Math.min(Math.max((p - 0.30) / 0.70, 0), 1);
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

            const startTop = vh * 0.45;
            const endTop = vh * 0.62 - rect.height;
            const totalTravel = Math.max(startTop - endTop, 1);

            const rawP = (startTop - rect.top) / totalTravel;
            const clamped = Math.min(Math.max(rawP, 0), 1);

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
        <section id={id} className="scroll-mt-20 w-full flex flex-col">
            <div
                ref={containerRef}
                className="relative w-full pt-16 pb-24 md:pt-24 md:pb-32 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-6 bg-white overflow-hidden"
            >
                {/* Unified Inertia Sky-Blue Gradient Layer */}
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

export function FooterSpreadSection({ children }: { children: ReactNode }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const maskedBgRef = useRef<HTMLDivElement | null>(null);
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
            const bgEl = maskedBgRef.current;
            if (bgEl) {
                // Single unified rising wave mask applied across BOTH the Footer background AND the PixelDivider
                // in one shared coordinate space so they blend together with zero seam!
                const tideP = Math.min(Math.max(p / 0.64, 0), 1);
                const easedTide = 1 - Math.pow(1 - tideP, 1.75);

                const opacity = Math.min(tideP * 3.5, 1);

                const front = easedTide * 165;
                const s0 = Math.max(0, front - 65);
                const s1 = Math.max(0, front - 50);
                const s2 = Math.max(0, front - 35);
                const s3 = Math.max(0, front - 20);
                const s4 = Math.max(0, front - 8);

                const mask =
                    easedTide >= 0.995
                        ? "none"
                        : `linear-gradient(0deg, #000 0%, #000 ${s0.toFixed(1)}%, rgba(0,0,0,0.85) ${s1.toFixed(1)}%, rgba(0,0,0,0.56) ${s2.toFixed(1)}%, rgba(0,0,0,0.26) ${s3.toFixed(1)}%, rgba(0,0,0,0.08) ${s4.toFixed(1)}%, transparent ${front.toFixed(1)}%)`;

                bgEl.style.opacity = opacity.toFixed(3);
                bgEl.style.webkitMaskImage = mask;
                bgEl.style.maskImage = mask;
            }

            // Right as the rising blue wave reaches the top of the Footer (p = 0.22),
            // its leading crest breaks into messy blinking pixels across all 3 rows!
            if (pixelUpdaterRef.current) {
                const pixelP = Math.min(Math.max((p - 0.22) / 0.78, 0), 1);
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
            const delta = (targetP - currentP) * 0.052;
            const step = Math.min(Math.max(delta, 0.002), 0.014);
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

            const startY = vh * 0.88;
            const endY = vh * 0.66;
            const rawP = (startY - rect.top) / Math.max(startY - endY, 1);
            const clamped = Math.min(Math.max(rawP, 0), 1);

            const atPageBottom =
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 24;

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
        <div className="w-full flex flex-col bg-white">
            {/* Extra Padding */}
            <div className="w-full h-16 bg-white" />

            <div
                ref={containerRef}
                className="relative w-full flex flex-col bg-white overflow-hidden"
            >
                {/*
                  Shared Masked Background Layer (z-0):
                  Wraps BOTH the PixelDivider and the #A8DCFF Footer fill inside the exact same
                  0deg bottom-to-top mask so they blend together as a single continuous wave!
                */}
                <div
                    ref={maskedBgRef}
                    aria-hidden="true"
                    style={{
                        opacity: 0,
                    }}
                    className="pointer-events-none absolute inset-0 z-0 flex flex-col will-change-[opacity]"
                >
                    <PixelDivider
                        direction="up"
                        onRegisterUpdater={handleRegisterPixelUpdater}
                    />
                    <div className="w-full flex-1 bg-accent-highlight" />
                </div>

                {/* Spacer matching the 3-row PixelDivider aspect ratio */}
                <div
                    aria-hidden="true"
                    className="w-full aspect-[76/3] shrink-0"
                />

                {/* Unmasked Foreground Footer Content (z-10) */}
                <footer className="relative z-10 w-full flex flex-col md:flex-row py-12 md:py-16 px-6 md:px-16 lg:px-[120px] justify-between items-start md:items-end gap-8">
                    {children}
                </footer>
            </div>
        </div>
    );
}
