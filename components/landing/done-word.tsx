"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * "Done" in the hero headline, with the completed-session fish from the app.
 *
 * The fish leap up out of the underline (like out of water), each in its own
 * arc and tilt, with an uneven stagger so they read as a little school rather
 * than a row. Everything is sized in em, so the fish scale with the headline at
 * every screen width.
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

const FISH = [
    { src: "/images/completed-orange-fish.png", x: 6, rise: -1.0, rot: -22, delay: 0, size: 0.5, flip: false, swim: "animate-fish-swim-1" },
    { src: "/images/completed-tuxedo-fish.png", x: 27, rise: -1.3, rot: 14, delay: 70, size: 0.56, flip: true, swim: "animate-fish-swim-2" },
    { src: "/images/completed-black-fish.png", x: 47, rise: -1.48, rot: -6, delay: 30, size: 0.5, flip: false, swim: "animate-fish-swim-3" },
    { src: "/images/completed-orange-fish.png", x: 68, rise: -1.22, rot: -14, delay: 110, size: 0.56, flip: true, swim: "animate-fish-swim-4" },
    { src: "/images/completed-tuxedo-fish.png", x: 88, rise: -0.96, rot: 10, delay: 150, size: 0.52, flip: false, swim: "animate-fish-swim-5" },
] as const;

/** How long a tap / auto-play keeps the fish up before they sink back. */
const SHOW_MS = 1800;
/** Auto-play on touch: after the headline, colour and underline have landed. */
const AUTO_PLAY_DELAY_MS = 1600;

export default function DoneWord() {
    const [leaping, setLeaping] = useState(false);
    const hideTimer = useRef<number | undefined>(undefined);
    const frame = useRef<number | undefined>(undefined);

    const play = useCallback(() => {
        window.clearTimeout(hideTimer.current);
        if (frame.current) window.cancelAnimationFrame(frame.current);
        // Drop back first so a replay mid-leap restarts from the water line.
        setLeaping(false);
        frame.current = window.requestAnimationFrame(() => {
            setLeaping(true);
            hideTimer.current = window.setTimeout(() => setLeaping(false), SHOW_MS);
        });
    }, []);

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
            data-leaping={leaping ? "true" : undefined}
            onClick={play}
            className="done-word relative inline-block pr-[0.2em] animate-hero-done cursor-pointer select-none before:absolute before:-inset-y-[0.35em] before:-inset-x-[0.25em] before:content-['']"
        >
            <span className="done-lift relative inline-block">
                Done
                <span
                    aria-hidden="true"
                    className="absolute left-[0.06em] right-[0.06em] bottom-[calc(0.06em-5px)] h-[3px] md:h-[5px] bg-accent animate-hero-done-line"
                />
            </span>

            {FISH.map((f, i) => (
                <span
                    key={i}
                    aria-hidden="true"
                    className="done-fish"
                    style={
                        {
                            "--x": `${f.x}%`,
                            "--rise": `${f.rise}em`,
                            "--rot": `${f.rot}deg`,
                            "--d": `${f.delay}ms`,
                            "--s": `${f.size}em`,
                        } as React.CSSProperties
                    }
                >
                    <span className={`block ${f.swim}`}>
                        <Image
                            src={f.src}
                            alt=""
                            width={36}
                            height={36}
                            className={`block w-[var(--s)] h-[var(--s)] [image-rendering:pixelated] drop-shadow-[0_0.06em_0.1em_rgba(0,0,0,0.18)] ${f.flip ? "-scale-x-100" : ""}`}
                        />
                    </span>
                </span>
            ))}
        </span>
    );
}
