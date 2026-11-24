"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * "Done" in the hero headline, with the completed-session fish from the app.
 *
 * The fish hop up onto the tops of the letters, each with its own tilt and
 * height, with an uneven stagger so they read as a little school rather than a
 * row. They stay in the gap between the two headline lines: resting right on
 * the cap tops, and moved sideways (or left out) wherever a descender from the
 * line above ("y" in "Way") reaches down. Sized in em (with a 12px floor), so
 * they scale with the headline at every screen width.
 *
 * Colour: the app's own pastel fish (cream, lime, lilac), nudged per time of
 * day like "Done" is (--fish-1/2/3, --fish-eye from lib/sky-phase.ts) so they
 * stay light without melting into the sky behind them.
 *
 * - Mouse: hover shows them (gated to `(hover: hover) and (pointer: fine)` so a
 *   tap never leaves a stuck hover). Moving away sinks them back, faster than
 *   they rose.
 * - Touch: there's no hover, so the leap plays once by itself after the
 *   headline has settled, and tapping "Done" plays it again.
 * - Reduced motion: no auto-play; hover/tap fades the fish in place.
 *
 * Motion lives in globals.css (.done-word / .done-fish): CSS transitions, so a
 * hover that ends mid-leap reverses smoothly from where the fish are.
 */

// x: preferred spot over the word (% of its width). lift: extra height above the
// cap tops (em). tone: which of the three time-of-day shades (ginger, tuxedo, void).
const FISH = [
    { x: 6, lift: 0.01, rot: -8, delay: 0, tone: 1, flip: false, swim: "animate-fish-swim-1" },
    { x: 27, lift: 0.03, rot: 6, delay: 70, tone: 2, flip: true, swim: "animate-fish-swim-2" },
    { x: 48, lift: 0.015, rot: 9, delay: 30, tone: 3, flip: false, swim: "animate-fish-swim-3" },
    { x: 70, lift: 0.035, rot: -6, delay: 110, tone: 1, flip: true, swim: "animate-fish-swim-4" },
    { x: 91, lift: 0.01, rot: 5, delay: 150, tone: 2, flip: false, swim: "animate-fish-swim-5" },
] as const;

/** Fish width (em of the headline; height is half), with a floor so phones still read them. */
const FISH_EM = 0.28;
const FISH_MIN_PX = 12;
/** Clearance (em) kept between a fish and a descender above it. */
const DESCENDER_PAD = 0.04;
/** Letters that reach below the baseline. */
const DESCENDERS = /[gjpqy]/i;

/** How long a tap / auto-play keeps the fish up before they sink back. */
const SHOW_MS = 1800;
/** Auto-play on touch: after the headline, colour and underline have landed. */
const AUTO_PLAY_DELAY_MS = 1600;

/** The app's completed-session fish, as 14×7 pixel art, facing right. */
function FishPixels({ flip }: { flip: boolean }) {
    return (
        <svg
            viewBox="1 5 14 7"
            shapeRendering="crispEdges"
            className={`block w-[max(12px,0.28em)] h-auto overflow-visible drop-shadow-[0_0.04em_0.05em_rgba(0,0,0,0.16)] ${flip ? "-scale-x-100" : ""}`}
        >
            <path
                fill="currentColor"
                d="M8 5h3v1H8zM3 6h1v1H3zM6 6h7v1H6zM2 7h9v1H2zM12 7h2v1h-2zM1 8h14v1H1zM2 9h12v1H2zM3 10h1v1H3zM6 10h7v1H6zM8 11h3v1H8z"
            />
            <path fill="var(--fish-eye, #232421)" d="M11 7h1v1h-1z" />
        </svg>
    );
}

/**
 * Where each fish goes (px from the word's left edge), or null to leave it out.
 * Descenders in the line above block columns of the gap; a fish that would sit
 * under one moves to the nearest clear side, and is dropped if that crowds
 * another fish or leaves the word.
 */
function placeFish(word: HTMLElement, root: HTMLElement): (number | null)[] | null {
    const h1 = root.closest("h1");
    if (!h1) return null;
    const box = word.getBoundingClientRect();
    if (box.width === 0) return null;
    const em = parseFloat(getComputedStyle(word).fontSize) || 16;
    const fishW = Math.max(FISH_MIN_PX, FISH_EM * em);
    const pad = DESCENDER_PAD * em;

    // Descender columns from the line above, relative to the word.
    const blocked: [number, number][] = [];
    const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (root.contains(node)) continue;
        const text = node.textContent ?? "";
        for (let i = 0; i < text.length; i++) {
            if (!DESCENDERS.test(text[i])) continue;
            range.setStart(node, i);
            range.setEnd(node, i + 1);
            const r = range.getBoundingClientRect();
            // Only the line directly above "Done", and only where it overlaps the word.
            if (r.bottom > box.top + em * 0.2 || r.bottom < box.top - em * 0.6) continue;
            if (r.right < box.left - fishW || r.left > box.right + fishW) continue;
            blocked.push([r.left - box.left - pad, r.right - box.left + pad]);
        }
    }

    const half = fishW / 2;
    const clear = (cx: number) => blocked.every(([a, b]) => cx + half <= a || cx - half >= b);
    const placed: number[] = [];
    return FISH.map((f) => {
        let cx = (f.x / 100) * box.width;
        if (!clear(cx)) {
            // Nearest clear spot just past either side of whatever blocks it.
            const options = blocked
                .flatMap(([a, b]) => [a - half, b + half])
                .filter((c) => clear(c))
                .sort((p, q) => Math.abs(p - cx) - Math.abs(q - cx));
            if (!options.length) return null;
            cx = options[0];
        }
        // Stay over the word, and don't pile onto a fish already placed.
        if (cx < 0 || cx > box.width) return null;
        if (placed.some((p) => Math.abs(p - cx) < fishW * 0.9)) return null;
        placed.push(cx);
        return cx;
    });
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function DoneWord() {
    const [leaping, setLeaping] = useState(false);
    const [spots, setSpots] = useState<(number | null)[] | null>(null);
    const rootRef = useRef<HTMLSpanElement>(null);
    const wordRef = useRef<HTMLSpanElement>(null);
    const hideTimer = useRef<number | undefined>(undefined);
    const frame = useRef<number | undefined>(undefined);

    const measure = useCallback(() => {
        if (!rootRef.current || !wordRef.current) return;
        const next = placeFish(wordRef.current, rootRef.current);
        setSpots((prev) =>
            next && prev && next.length === prev.length && next.every((v, i) => (v === null ? prev[i] === null : prev[i] !== null && Math.abs(v - (prev[i] as number)) < 0.5))
                ? prev
                : next,
        );
    }, []);

    const play = useCallback(() => {
        measure();
        window.clearTimeout(hideTimer.current);
        if (frame.current) window.cancelAnimationFrame(frame.current);
        // Drop back first so a replay mid-leap restarts from the water line.
        setLeaping(false);
        frame.current = window.requestAnimationFrame(() => {
            setLeaping(true);
            hideTimer.current = window.setTimeout(() => setLeaping(false), SHOW_MS);
        });
    }, [measure]);

    // Re-place the fish whenever the headline reflows (fonts loading, resizing).
    useIsoLayoutEffect(() => {
        measure();
        const h1 = rootRef.current?.closest("h1");
        const observer = new ResizeObserver(() => measure());
        if (h1) observer.observe(h1);
        void document.fonts?.ready.then(measure);
        return () => observer.disconnect();
    }, [measure]);

    useEffect(() => {
        const touch = window.matchMedia("(hover: none)").matches;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const auto = touch && !reduce ? window.setTimeout(play, AUTO_PLAY_DELAY_MS) : undefined;
        return () => {
            window.clearTimeout(auto);
            window.clearTimeout(hideTimer.current);
            if (frame.current) window.cancelAnimationFrame(frame.current);
        };
    }, [play]);

    return (
        <span
            ref={rootRef}
            data-leaping={leaping ? "true" : undefined}
            onClick={play}
            onPointerEnter={measure}
            className="done-word relative inline-block pr-[0.2em] animate-hero-done cursor-pointer select-none before:absolute before:-inset-y-[0.35em] before:-inset-x-[0.25em] before:content-['']"
        >
            <span ref={wordRef} className="done-lift relative inline-block">
                Done
                <span
                    aria-hidden="true"
                    className="absolute left-[0.06em] right-[0.06em] bottom-[calc(0.06em-5px)] h-[3px] md:h-[5px] bg-current animate-hero-done-line"
                />
            </span>

            {FISH.map((f, i) => {
                const spot = spots ? spots[i] : undefined;
                if (spot === null) return null;
                return (
                    <span
                        key={i}
                        aria-hidden="true"
                        className="done-fish"
                        style={
                            {
                                "--x": spot === undefined ? `${f.x}%` : `${spot.toFixed(1)}px`,
                                "--rise": `${f.lift}em`,
                                "--rot": `${f.rot}deg`,
                                "--d": `${f.delay}ms`,
                                color: `var(--fish-${f.tone})`,
                            } as React.CSSProperties
                        }
                    >
                        <span className={`block ${f.swim}`}>
                            <FishPixels flip={f.flip} />
                        </span>
                    </span>
                );
            })}
        </span>
    );
}
