"use client";

import { useEffect, useRef } from "react";
import type { SkyPhase } from "@/components/landing/hero-scene";

/**
 * Full-footer pixel paw-print cursor trail rendered across the sky backdrop
 * behind the text, links, and PAWSE wordmark.
 *
 * - Activates on fine pointers only (`hover: hover` and `pointer: fine`).
 * - Alternates left and right 6×6 pixel paw stamps as the cursor moves.
 * - Fades each print in 4 discrete steps over `STAMP_LIFE_MS`, then sleeps
 *   completely when idle, off-screen, hidden, or under reduced motion.
 */

const STAMP_LIFE_MS = 1500;
const PAW_PATTERN = [".X..X.", "X....X", "..XX..", ".XXXX.", ".XXXX.", "..XX.."] as const;

const PAW_STYLES: Record<SkyPhase, { rgb: string; alpha: number }> = {
    morning: { rgb: "35,35,35", alpha: 0.14 },
    day: { rgb: "26,116,174", alpha: 0.16 },
    dusk: { rgb: "35,35,35", alpha: 0.15 },
    night: { rgb: "18,22,46", alpha: 0.22 },
};

interface Stamp {
    x: number;
    y: number;
    at: number;
}

export default function FooterPawTrail({ phase = "day" }: { phase?: SkyPhase }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const styleRef = useRef(PAW_STYLES[phase]);

    useEffect(() => {
        styleRef.current = PAW_STYLES[phase];
    }, [phase]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const finePointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");

        let width = 0;
        let height = 0;
        let paw = 6;
        let inView = false;
        let rafId: number | null = null;
        let lastX = Number.NaN;
        let lastY = Number.NaN;
        let side = 1;
        const stamps: Stamp[] = [];

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            if (rect.width < 2 || rect.height < 2) return;
            width = rect.width;
            height = rect.height;
            paw = Math.max(3.5, Math.min(7.5, width * 0.005));

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const draw = (now: number) => {
            if (!width || !height) return;
            ctx.clearRect(0, 0, width, height);
            const { rgb, alpha } = styleRef.current;

            for (const s of stamps) {
                const age = now - s.at;
                if (age >= STAMP_LIFE_MS) continue;
                const level = Math.ceil((1 - age / STAMP_LIFE_MS) * 4) / 4;
                ctx.fillStyle = `rgba(${rgb},${(alpha * level).toFixed(3)})`;
                const ox = s.x - 3 * paw;
                const oy = s.y - 3 * paw;
                for (let r = 0; r < PAW_PATTERN.length; r++) {
                    for (let c = 0; c < PAW_PATTERN[r].length; c++) {
                        if (PAW_PATTERN[r][c] !== "X") continue;
                        const x0 = Math.round(ox + c * paw);
                        const y0 = Math.round(oy + r * paw);
                        ctx.fillRect(
                            x0,
                            y0,
                            Math.round(ox + (c + 1) * paw) - x0,
                            Math.round(oy + (r + 1) * paw) - y0
                        );
                    }
                }
            }
        };

        const tick = (now: number) => {
            rafId = null;
            for (let i = stamps.length - 1; i >= 0; i--) {
                if (now - stamps[i].at > STAMP_LIFE_MS) stamps.splice(i, 1);
            }
            draw(now);
            if (!reducedMq.matches && inView && !document.hidden && stamps.length > 0) {
                rafId = window.requestAnimationFrame(tick);
            }
        };

        const wake = () => {
            if (rafId !== null || !inView || document.hidden || reducedMq.matches) return;
            rafId = window.requestAnimationFrame(tick);
        };

        const onPointerMove = (e: PointerEvent) => {
            if (reducedMq.matches || !finePointerMq.matches) return;
            const rect = canvas.getBoundingClientRect();
            const lx = e.clientX - rect.left;
            const ly = e.clientY - rect.top;
            if (lx < 0 || lx > rect.width || ly < 0 || ly > rect.height) {
                lastX = Number.NaN;
                return;
            }
            if (Number.isNaN(lastX)) {
                lastX = lx;
                lastY = ly;
                return;
            }
            const dx = lx - lastX;
            const dy = ly - lastY;
            const dist = Math.hypot(dx, dy);
            if (dist < paw * 9) return;

            const offset = side * paw * 2.2;
            stamps.push({
                x: Math.round((lx + (-dy / dist) * offset) / paw) * paw,
                y: Math.round((ly + (dx / dist) * offset) / paw) * paw,
                at: performance.now(),
            });
            if (stamps.length > 36) stamps.shift();
            side *= -1;
            lastX = lx;
            lastY = ly;
            wake();
        };

        const syncVisibility = () => {
            if (reducedMq.matches || !inView || document.hidden) {
                if (rafId !== null) {
                    window.cancelAnimationFrame(rafId);
                    rafId = null;
                }
                if (reducedMq.matches) {
                    stamps.length = 0;
                    ctx.clearRect(0, 0, width, height);
                }
                return;
            }
            if (stamps.length > 0) wake();
        };

        const io = new IntersectionObserver(
            ([entry]) => {
                inView = entry.isIntersecting;
                syncVisibility();
            },
            { threshold: 0.05 }
        );
        io.observe(canvas);

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        document.addEventListener("visibilitychange", syncVisibility);
        reducedMq.addEventListener("change", syncVisibility);

        return () => {
            if (rafId !== null) window.cancelAnimationFrame(rafId);
            io.disconnect();
            ro.disconnect();
            window.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("visibilitychange", syncVisibility);
            reducedMq.removeEventListener("change", syncVisibility);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
        />
    );
}
