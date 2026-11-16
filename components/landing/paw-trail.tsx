"use client";

import { useEffect, useRef, useState } from "react";
import { PAW, PixelArt } from "./hero-scene";

/**
 * A cat's paw prints walking down both sides of the feature tour (Companions →
 * Focus → Break), ending as they step into the Progress section's blue.
 *
 * Tracks stay: each print appears once, the first time it comes into view (a
 * short fade with a small step in), and is never hidden again, so scrolling back
 * up shows the trail already walked. Prints that are already above the screen
 * when the page loads (a reload mid-page) appear at once, so the trail behind the
 * visitor is never half empty. With reduced motion the whole trail is simply there.
 *
 * Kept to the side margins (never over content), behind nothing interactive
 * (pointer-events: none), and hidden from assistive tech. The layer is absolutely
 * positioned over its parent; the parent decides the span (see app/page.tsx).
 */

/** Vertical distance between two prints on one side (px). */
const STRIDE = 92;
/** Where the first print sits, below the top of the tour (px). */
const START = 140;
/** Same art as the paw prints on the hero glass; warm and faint on the white wall. */
const PALETTE = { T: "rgb(150 120 96 / 0.34)", P: "rgb(150 120 96 / 0.3)" };

type Print = { side: "left" | "right"; top: number; lane: 0 | 1; tilt: number };

function layout(height: number): Print[] {
    const prints: Print[] = [];
    // The right side starts half a stride later, so the two trails don't mirror
    for (const side of ["left", "right"] as const) {
        let i = 0;
        for (let top = START + (side === "right" ? STRIDE / 2 : 0); top < height - 40; top += STRIDE, i++) {
            // Alternate paws: two lanes a few px apart, and a slight, varying turn
            const lane = (i % 2) as 0 | 1;
            const tilt = (lane ? 8 : -8) + ((i * 37) % 9) - 4;
            prints.push({ side, top, lane, tilt });
        }
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

    // Reveal each print once, the first time it's on screen; never hide it again
    useEffect(() => {
        const el = rootRef.current;
        if (!el || height === 0) return;
        const prints = Array.from(el.querySelectorAll<HTMLElement>("[data-paw]"));
        const show = (p: HTMLElement) => (p.dataset.shown = "true");

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            prints.forEach(show);
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        show(entry.target as HTMLElement);
                        io.unobserve(entry.target);
                    }
                }
            },
            // A print appears a little after it crosses the bottom edge, so you see it land
            { rootMargin: "0px 0px -12% 0px" }
        );
        for (const p of prints) {
            if (p.dataset.shown) continue;
            // Already above the screen (e.g. reloaded mid-page): it's part of the walked trail
            if (p.getBoundingClientRect().bottom < 0) show(p);
            else io.observe(p);
        }
        return () => io.disconnect();
    }, [height]);

    return (
        <div ref={rootRef} aria-hidden="true" className={`paw-trail pointer-events-none absolute inset-x-0 ${className}`}>
            {height > 0 &&
                layout(height).map((p, i) => (
                    <span
                        key={i}
                        data-paw=""
                        className="paw-print"
                        style={
                            {
                                [p.side]: `calc(var(--paw-edge) + ${p.lane ? "var(--paw-lane)" : "0px"})`,
                                top: `${p.top}px`,
                                "--paw-tilt": `${180 + p.tilt}deg`,
                            } as React.CSSProperties
                        }
                    >
                        <PixelArt rows={PAW} palette={PALETTE} className="w-full h-auto" />
                    </span>
                ))}
        </div>
    );
}
