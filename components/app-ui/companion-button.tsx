"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The companion picker button from the PAWSE desktop app, rebuilt for the web.
 *
 * Source of truth: the app's `src/renderer/index.html` / `index.css` / `index.js`
 * (educ-jkescritor/Pawse, test-branch). Same structure (label pill, pixel name,
 * session line, a cat peeking up from the bottom edge), same colours (the app's
 * --theme-* values, in globals.css as --color-app-*), same states:
 * - hover: the white→theme gradient slides down over 2.5s, the card rises, the
 *   label pill inverts (light fill, theme border, dark theme text)
 * - pressed: drops back down
 * - selected: theme ring inside the edge, gradient settled, label inverted
 * Sized at 1.5x the app's window for the web (fonts, padding, radius, shadows).
 *
 * The peeking cat runs the app's idle routine: it holds a random pose (1 of 4)
 * for 2-4.2s, then sometimes plays the 4-frame look-around once or twice (1s
 * each), never choosing a pose another cat is already showing, and only one cat
 * animates at a time. The sprites are the app's own files (public/sprites/
 * *-head-peek-*). The loop pauses off screen and doesn't run with reduced
 * motion (the cat just holds its first pose).
 */

export type AppCompanion = {
    id: "tux" | "ginger" | "void";
    name: string;
    /** "Classic" | "Sprint" | "Focused" */
    mode: string;
    /** Matches the app's theme: classic (green), sprint (orange), focused (purple). */
    theme: "classic" | "sprint" | "focused";
    focusMin: number;
    breakMin: number;
};

const SPRITES = "/sprites";
const POSES = [1, 2, 3, 4] as const;

// Shared across the three buttons, like the app: which poses are showing and who's animating.
const currentPose: Partial<Record<AppCompanion["id"], number>> = {};
const animating = new Set<AppCompanion["id"]>();

function pickNextPose(id: AppCompanion["id"], previous: number) {
    const others = Object.entries(currentPose)
        .filter(([key]) => key !== id)
        .map(([, pose]) => pose);
    const available = POSES.filter((p) => p !== previous);
    const preferred = available.filter((p) => !others.includes(p));
    const pool = preferred.length > 0 ? preferred : available;
    return pool[Math.floor(Math.random() * pool.length)];
}

const between = (min: number, spread: number) => min + Math.floor(Math.random() * spread);

function usePeekRoutine(id: AppCompanion["id"], initialPose: number, rootRef: React.RefObject<HTMLElement | null>) {
    const [pose, setPose] = useState(initialPose);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        currentPose[id] = initialPose;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        // Warm the cache so the first pose change doesn't flash
        for (const p of POSES) new window.Image().src = `${SPRITES}/${id}-head-peek-${p}.png`;
        new window.Image().src = `${SPRITES}/${id}-head-peek-sheet.png`;

        let timer: number | undefined;
        let isStatic = true;
        let visible = false;
        let poseNow = initialPose;

        const step = () => {
            if (!visible) return;
            // About to animate while another cat is: hold this pose a bit longer
            if (isStatic && animating.size > 0) {
                timer = window.setTimeout(step, between(400, 500));
                return;
            }
            isStatic = !isStatic;
            if (isStatic) {
                animating.delete(id);
                poseNow = pickNextPose(id, poseNow);
                currentPose[id] = poseNow;
                setPose(poseNow);
                setPlaying(false);
                timer = window.setTimeout(step, between(2000, 2200));
            } else {
                animating.add(id);
                setPlaying(true);
                timer = window.setTimeout(step, (Math.random() < 0.5 ? 1 : 2) * 1000);
            }
        };

        const el = rootRef.current;
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            window.clearTimeout(timer);
            if (visible) {
                timer = window.setTimeout(step, between(1200, 1600));
            } else if (!isStatic) {
                // Leaving the screen mid-animation: settle on a pose
                isStatic = true;
                animating.delete(id);
                setPlaying(false);
            }
        });
        if (el) io.observe(el);

        return () => {
            io.disconnect();
            window.clearTimeout(timer);
            animating.delete(id);
        };
    }, [id, initialPose, rootRef]);

    return { pose, playing };
}

export default function CompanionButton({
    companion,
    initialPose,
    selected,
    onSelect,
    className = "",
}: {
    companion: AppCompanion;
    /** Distinct per cat, so server and client render the same first frame. */
    initialPose: number;
    selected: boolean;
    onSelect: () => void;
    className?: string;
}) {
    const ref = useRef<HTMLButtonElement>(null);
    const { pose, playing } = usePeekRoutine(companion.id, initialPose, ref);

    return (
        <button
            ref={ref}
            type="button"
            data-theme={companion.theme}
            aria-pressed={selected}
            onClick={onSelect}
            className={`app-cat-btn ${className}`}
        >
            <span className="app-cat-info">
                <span className="app-cat-label">{companion.mode}</span>
                <span className="app-cat-name">{companion.name}</span>
                <span className="app-cat-session">
                    {companion.focusMin}m Focus / {companion.breakMin}m Break
                </span>
            </span>
            <span className="app-cat-image" aria-hidden="true">
                <span
                    className={`app-cat-sprite ${playing ? "animate-app-peek" : ""}`}
                    style={{
                        backgroundImage: playing
                            ? `url(${SPRITES}/${companion.id}-head-peek-sheet.png)`
                            : `url(${SPRITES}/${companion.id}-head-peek-${pose}.png)`,
                        backgroundSize: playing ? "400% 100%" : "100% 100%",
                    }}
                />
            </span>
        </button>
    );
}
