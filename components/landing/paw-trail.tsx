"use client";

import { useEffect, useRef, useState } from "react";
import { PAW, PixelArt } from "./hero-scene";

/**
 * A cat's paw prints walking down both sides of the feature tour (Companions →
 * Focus → Break), ending as they step into the Progress section's blue.
 *
 * The walk is messy on purpose: each side is its own seeded random walk (steps
 * of different lengths, a path that drifts in and out, paws that turn with it,
 * the odd longer gap where the cat paused), and the two sides use different
 * seeds and rhythms, so they never mirror. Seeded, so the trail is the same on
 * every visit and on server and client.
 *
 * Tracks stay: each print appears once, the first time it comes into view, and
 * is never hidden again. The newest print on each side is blue (where the cat
 * is now); when the next one lands, it cools to grey. If several come into view
 * at once (fast scrolling) they land one after another, ~70ms apart, so it
 * still reads as walking. Prints already above the screen on load appear at
 * once (grey); with reduced motion the whole trail is simply there.
 *
 * Margins only, pointer-events none, aria-hidden. The layer is absolutely
 * positioned over its parent; the parent decides the span (see app/page.tsx).
 */

type Side = "left" | "right";
type Print = { side: Side; top: number; lane: 0 | 1; drift: number; tilt: number };

/** Small, fast, seeded PRNG (mulberry32): same trail every time. */
function rng(seed: number) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Each side walks differently: its own seed, start, step length, wobble and pauses.
const WALKS: Record<Side, { seed: number; start: number; stride: number; jitter: number; pause: number }> = {
    left: { seed: 7, start: 120, stride: 94, jitter: 30, pause: 0.12 },
    right: { seed: 23, start: 205, stride: 82, jitter: 38, pause: 0.18 },
};

function walk(side: Side, height: number): Print[] {
    const w = WALKS[side];
    const r = rng(w.seed);
    const prints: Print[] = [];
    let top = w.start;
    let drift = r(); // 0..1 across the side margin's wander range
    let i = 0;
    while (top < height - 40) {
        const lane = (i % 2) as 0 | 1;
        const prev = drift;
        // The path wanders: a small random step, pulled back in at the edges
        drift = Math.min(1, Math.max(0, drift + (r() - 0.5) * 0.45));
        // Paws turn a little with the direction of travel, plus their own wobble
        const tilt = (lane ? 9 : -9) + (drift - prev) * (side === "left" ? -40 : 40) + (r() - 0.5) * 10;
        prints.push({ side, top: Math.round(top), lane, drift, tilt });
        // Uneven steps; now and then a longer gap where the cat paused or hopped
        top += w.stride + (r() - 0.5) * 2 * w.jitter + (r() < w.pause ? 40 + r() * 50 : 0);
        i++;
    }
    return prints;
}

export default function PawTrail({ className = "" }: { className?: string }) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    // Lay the trail out for the tour's real height (and again if it changes)
    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setHeight(Math.round(entry.contentRect.height)));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        const el = rootRef.current;
        if (!el || height === 0) return;
        const prints = Array.from(el.querySelectorAll<HTMLElement>("[data-paw]"));
        const fresh: Record<Side, HTMLElement | null> = { left: null, right: null };
        const topOf = (p: HTMLElement) => Number(p.dataset.top);

        // The lowest print shown on a side is the "active" one (blue); the one before cools to grey
        const markFresh = (p: HTMLElement) => {
            const side = p.dataset.side as Side;
            const current = fresh[side];
            if (current && topOf(current) > topOf(p)) return;
            if (current) delete current.dataset.fresh;
            p.dataset.fresh = "";
            fresh[side] = p;
        };
        const show = (p: HTMLElement, delayMs = 0) => {
            p.style.setProperty("--paw-delay", `${delayMs}ms`);
            p.dataset.shown = "";
        };

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            prints.forEach((p) => show(p));
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                // Land in walking order (top to bottom), one after another
                const landing = entries
                    .filter((e) => e.isIntersecting)
                    .map((e) => e.target as HTMLElement)
                    .sort((a, b) => topOf(a) - topOf(b));
                landing.forEach((p, k) => {
                    io.unobserve(p);
                    show(p, Math.min(k, 8) * 70);
                    markFresh(p);
                });
            },
            // A print appears a little after it crosses the bottom edge, so you see it land
            { rootMargin: "0px 0px -12% 0px" }
        );
        for (const p of prints) {
            if (p.dataset.shown !== undefined) continue;
            // Already above the screen (e.g. reloaded mid-page): it's part of the walked trail
            if (p.getBoundingClientRect().bottom < 0) show(p);
            else io.observe(p);
        }
        return () => io.disconnect();
    }, [height]);

    const prints = height > 0 ? [...walk("left", height), ...walk("right", height)] : [];

    return (
        <div ref={rootRef} aria-hidden="true" className={`paw-trail pointer-events-none absolute inset-x-0 ${className}`}>
            {prints.map((p, i) => (
                <span
                    key={i}
                    data-paw=""
                    data-side={p.side}
                    data-top={p.top}
                    className="paw-print"
                    style={
                        {
                            [p.side]: `calc(var(--paw-edge) + ${p.drift.toFixed(3)} * var(--paw-wander) + ${p.lane ? "var(--paw-lane)" : "0px"})`,
                            top: `${p.top}px`,
                            "--paw-tilt": `${(180 + p.tilt).toFixed(1)}deg`,
                        } as React.CSSProperties
                    }
                >
                    <PixelArt rows={PAW} palette={{ T: "currentColor", P: "currentColor" }} className="w-full h-auto" />
                </span>
            ))}
        </div>
    );
}
