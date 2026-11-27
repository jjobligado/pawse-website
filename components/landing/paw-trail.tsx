"use client";

import { useEffect, useRef, useState } from "react";
import { PAW, PixelArt } from "./hero-scene";

/**
 * A cat's paw prints walking down both sides of the feature tour (Companions →
 * Focus → Break), ending as they walk off partway into Progress.
 *
 * The walk is messy on purpose. Each side is its own seeded walk that switches
 * between moods: a stroll (uneven steps, a path that drifts), a zigzag (cutting
 * back and forth, paws turned into each cut), and a pause (a long gap) followed
 * by a hurry (short quick steps, catching up). The two sides have different
 * seeds, rhythms and habits, so they never mirror. Seeded, so the trail is the
 * same on every visit. It walks in the real side margin: its distance from the
 * edge and how far it wanders scale with the margin (see .paw-trail in globals.css).
 *
 * Each cat walks in and walks off: its first few prints come in from the
 * screen's edge and curve into the lane, and its last few curve back out past
 * the edge (RAMP). The two sides start and leave at different heights. Ramp
 * prints point along the path they really take on screen (measured after
 * layout), so they turn into the curve at every width.
 *
 * Tracks stay: each print appears once, the first time it comes into view, and
 * is never hidden again. The newest print on each side is blue (where the cat
 * is now); when the next one lands, it cools to grey. If several come into view
 * at once (fast scrolling) they land one after another, ~70ms apart, so it
 * still reads as walking. Prints already above the screen on load appear at
 * once (grey); with reduced motion the whole trail is simply there.
 *
 * Margins only, pointer-events none, aria-hidden. The layer is absolutely
 * positioned at the top of its parent; the cats walk off `endFraction` of the way into
 * the `endSelector` element (see app/page.tsx). Prints land as they reach the
 * middle of the screen, so the newest one is always around the centre. Prints
 * inside the end element (Progress) take a light blue tint.
 * Shown from lg only: below that the side margins are too narrow.
 */

type Side = "left" | "right";
/** `off`: how far a print has moved from its lane to just past the screen's edge (0 = in the lane). */
type Print = { side: Side; top: number; lane: 0 | 1; drift: number; tilt: number; off: number };

/** The walk-in, from the edge to the lane; reversed, it's the walk-off. */
const RAMP = [0.9, 0.64, 0.38, 0.16];

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
// `exitShift`: where this side's last print lands, from the exit point (px,
// + below), so the two cats leave a little apart, around the exit point.
const WALKS: Record<Side, { seed: number; start: number; stride: number; exitShift: number; moods: [Mood, number][] }> = {
    left: { seed: 7, start: 120, stride: 96, exitShift: 60, moods: [["stroll", 0.5], ["zigzag", 0.36], ["pause", 0.14]] },
    right: { seed: 23, start: 210, stride: 88, exitShift: -60, moods: [["stroll", 0.46], ["zigzag", 0.16], ["pause", 0.38]] },
};

/** Room below the exit point for the last prints (the trail layer runs this far past it). */
const EXIT_ROOM = 120;

function walk(side: Side, exit: number): Print[] {
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
    let left = RAMP.length + 1; // steps left in the current mood (a calm stroll while walking in)
    let i = 0;

    // The walk-off lands at fixed places: its last print exactly at this
    // side's exit, the ones before it a steady step apart
    const k = RAMP.length;
    const outStep = w.stride * 0.9;
    const last = exit + w.exitShift;
    const outFrom = last - (k - 1) * outStep;

    while (top < outFrom - w.stride * 0.6) {
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
        prints.push({ side, top: Math.round(top), lane, drift, tilt, off: 0 });

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

    // Walk in from the edge, walk off past it: a smooth curve between the edge
    // and the lane the cat walks in on (or leaves from), with no wander of its own
    if (prints.length < k + 1) return prints;
    const inLane = prints[k].drift;
    const outLane = prints[prints.length - 1].drift;
    RAMP.forEach((off, j) => Object.assign(prints[j], { off, drift: inLane }));
    [...RAMP].reverse().forEach((off, j) => {
        const lane = (i % 2) as 0 | 1;
        prints.push({ side, top: Math.round(outFrom + j * outStep), lane, drift: outLane, tilt: 0, off });
        i++;
    });
    return prints;
}

export default function PawTrail({
    endSelector,
    endFraction = 0.5,
    className = "",
}: {
    /** The cats walk off partway into this element (e.g. "#progress")... */
    endSelector: string;
    /** ...at this fraction of its height (0.5 = its middle). */
    endFraction?: number;
    className?: string;
}) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);
    // Where the end element starts (the blue): prints from here on take the blue tint
    const [blueFrom, setBlueFrom] = useState(Infinity);

    // The trail runs from the top of its parent to partway into the end element;
    // re-measured whenever either changes size.
    useEffect(() => {
        const el = rootRef.current;
        const parent = el?.parentElement;
        const end = document.querySelector<HTMLElement>(endSelector);
        if (!el || !parent || !end) return;
        const measure = () => {
            const p = parent.getBoundingClientRect();
            const e = end.getBoundingClientRect();
            setHeight(Math.max(0, Math.round(e.top - p.top + e.height * endFraction + EXIT_ROOM)));
            setBlueFrom(Math.round(e.top - p.top + e.height * 0.12));
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(parent);
        ro.observe(end);
        return () => ro.disconnect();
    }, [endSelector, endFraction]);

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
            // A print lands as it reaches the middle of the screen, so the newest
            // (blue) print is always around the centre of the view. Widened
            // sideways so ramp prints past the screen's edge still land.
            { rootMargin: "0px 120px -50% 120px" }
        );
        for (const p of prints) {
            if (p.dataset.shown !== undefined) continue;
            // Already above the screen (e.g. reloaded mid-page): it's part of the walked trail
            if (p.getBoundingClientRect().bottom < 0) show(p);
            else io.observe(p);
        }
        return () => io.disconnect();
    }, [height]);

    // Ramp prints point along their path on screen: from the print before to
    // the one after on the same side (both on the same lane, so the step
    // between paws cancels out). Re-aimed on resize, as the margins change.
    useEffect(() => {
        const el = rootRef.current;
        if (!el || height === 0) return;
        const aim = () => {
            for (const side of ["left", "right"] as const) {
                const list = Array.from(el.querySelectorAll<HTMLElement>(`[data-paw][data-side="${side}"]`));
                list.forEach((p, i) => {
                    if (p.dataset.ramp === undefined) return;
                    const a = list[Math.max(0, i - 1)];
                    const b = list[Math.min(list.length - 1, i + 1)];
                    const dx = b.offsetLeft - a.offsetLeft;
                    const dy = b.offsetTop - a.offsetTop;
                    const wobble = p.dataset.lane === "1" ? 6 : -6;
                    const tilt = 180 - (Math.atan2(dx, dy) * 180) / Math.PI + wobble;
                    p.style.setProperty("--paw-tilt", `${tilt.toFixed(1)}deg`);
                });
            }
        };
        aim();
        window.addEventListener("resize", aim);
        return () => window.removeEventListener("resize", aim);
    }, [height]);

    const prints = height > 0 ? [...walk("left", height - EXIT_ROOM), ...walk("right", height - EXIT_ROOM)] : [];

    return (
        <div
            ref={rootRef}
            aria-hidden="true"
            className={`paw-trail pointer-events-none absolute inset-x-0 top-0 ${className}`}
            style={{ height: height || undefined }}
        >
            {prints.map((p, i) => (
                <span
                    key={i}
                    data-paw=""
                    data-side={p.side}
                    data-top={p.top}
                    data-lane={p.lane}
                    data-ramp={p.off ? "" : undefined}
                    data-blue={p.top >= blueFrom ? "" : undefined}
                    className="paw-print"
                    style={
                        {
                            // In the lane, or `off` of the way from it to just past the screen's edge
                            [p.side]: `calc(${(1 - p.off).toFixed(2)} * (var(--paw-edge) + ${p.drift.toFixed(3)} * var(--paw-wander) + ${p.lane ? "var(--paw-lane)" : "0px"}) - ${p.off.toFixed(2)} * 1.3 * var(--paw-size))`,
                            top: `${p.top}px`,
                            // Ramp prints are aimed after layout (see above), so React leaves their tilt alone
                            ...(p.off ? {} : { "--paw-tilt": `${(180 + p.tilt).toFixed(1)}deg` }),
                        } as React.CSSProperties
                    }
                >
                    <PixelArt rows={PAW} palette={{ T: "currentColor", P: "currentColor" }} className="w-full h-auto" />
                </span>
            ))}
        </div>
    );
}
