"use client";

import { useEffect, useRef, useState } from "react";
import { PAW, PixelArt } from "./hero-scene";

/**
 * A cat's paw prints walking down both sides of the feature tour (Companions →
 * Focus → Break), ending as they step into the Progress section's blue.
 *
 * The walk is messy on purpose. Each side is its own seeded walk that switches
 * between moods: a stroll (uneven steps, a path that drifts), a zigzag (cutting
 * back and forth, paws turned into each cut), and a pause (a long gap) followed
 * by a hurry (short quick steps, catching up). The two sides have different
 * seeds, rhythms and habits, so they never mirror. Seeded, so the trail is the
 * same on every visit. It walks in the real side margin: its distance from the
 * edge and how far it wanders scale with the margin (see .paw-trail in globals.css).
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

type Mood = "stroll" | "zigzag" | "pause" | "hurry";

// Each side walks differently: its own seed, start, step length and habits.
// The left cat zigzags more; the right one dawdles, then hurries to catch up.
const WALKS: Record<Side, { seed: number; start: number; stride: number; moods: [Mood, number][] }> = {
    left: { seed: 7, start: 120, stride: 96, moods: [["stroll", 0.5], ["zigzag", 0.36], ["pause", 0.14]] },
    right: { seed: 23, start: 210, stride: 88, moods: [["stroll", 0.46], ["zigzag", 0.16], ["pause", 0.38]] },
};

function walk(side: Side, height: number): Print[] {
    const w = WALKS[side];
    const r = rng(w.seed);
    const between = (min: number, max: number) => min + r() * (max - min);
    const pickMood = (): Mood => {
        let x = r();
        for (const [mood, p] of w.moods) if ((x -= p) <= 0) return mood;
        return "stroll";
    };

    const prints: Print[] = [];
    let top = w.start;
    let drift = r(); // 0..1 across the side margin's wander range
    let mood: Mood = "stroll";
    let left = 3; // steps left in the current mood
    let i = 0;

    while (top < height - 40) {
        if (left <= 0) {
            // After a pause, the cat hurries to catch up
            mood = mood === "pause" ? "hurry" : pickMood();
            left = mood === "pause" ? 1 : mood === "hurry" ? Math.round(between(3, 5)) : Math.round(between(3, 6));
        }
        const lane = (i % 2) as 0 | 1;
        const prev = drift;

        if (mood === "zigzag") {
            // Cuts back and forth across the margin
            drift = (i % 2 ? 0.82 : 0.18) + (r() - 0.5) * 0.12;
        } else {
            // Wanders a little, pulled back in at the edges
            drift = Math.min(1, Math.max(0, drift + (r() - 0.5) * (mood === "hurry" ? 0.2 : 0.4)));
        }

        // Paws turn into the direction of travel (strongly in a zigzag), plus their own wobble
        const turn = (drift - prev) * (mood === "zigzag" ? 70 : 40) * (side === "left" ? -1 : 1);
        const tilt = (lane ? 9 : -9) + turn + (r() - 0.5) * 10;
        prints.push({ side, top: Math.round(top), lane, drift, tilt });

        // Step length by mood; a pause leaves a long gap before the next print
        top +=
            mood === "hurry"
                ? w.stride * 0.55 + (r() - 0.5) * 14
                : mood === "zigzag"
                  ? w.stride * 0.85 + (r() - 0.5) * 24
                  : w.stride + (r() - 0.5) * 50;
        if (mood === "pause") top += between(110, 190);
        left--;
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
