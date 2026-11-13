"use client";

import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";

/**
 * A pixel-art companion drawn from horizontal sprite sheets (see docs/SPRITES.md).
 *
 * - Idle: loops on its own as soon as the cat appears. It holds the first frame,
 *   then plays the rest (a blink / glance), so it reads as calm, not twitchy.
 * - Action: hover with a mouse, or click / tap / Enter, plays the action sheet
 *   once from the start, then returns to idle. It always finishes, even if the
 *   pointer leaves mid-way, and a new hover is needed to play it again.
 * - Reduced motion: shows the first idle frame and never animates.
 *
 * Frames are stepped with a CSS transform on an <img> strip inside a clipping
 * box: compositor-only, and crisp at any size thanks to `pixelated`. Keep the
 * box at whole multiples of the frame size (64 → 64 / 128 / 192px).
 */

export interface SpriteSheet {
    src: string;
    frames: number;
}

/** One step of a custom frame sequence: which frame, and for how long. */
export interface FrameStep {
    frame: number;
    ms: number;
}

interface SpriteCatProps {
    idle: SpriteSheet;
    action: SpriteSheet;
    /** Accessible name of the button, e.g. "Play with Ginger". */
    label: string;
    /** How long the idle sheet rests on its first frame before each blink. */
    idleHoldMs?: number;
    /** Duration of each non-held frame. */
    frameMs?: number;
    /** Overrides the default idle (hold frame 0, then play the rest). */
    idleSequence?: readonly FrameStep[];
    /** Overrides the default action (every frame once, `frameMs` each). */
    actionSequence?: readonly FrameStep[];
    /** Size (and any positioning) utilities for the square box. */
    className?: string;
}

/**
 * Builds discrete keyframes for a frame sequence. `step-end` holds each
 * keyframe's frame until the next keyframe, so durations can differ per frame.
 */
function sequenceKeyframes(name: string, frames: number, steps: readonly FrameStep[]) {
    const total = steps.reduce((sum, s) => sum + s.ms, 0);
    let elapsed = 0;
    const rules = steps.map(({ frame, ms }) => {
        const at = (elapsed / total) * 100;
        elapsed += ms;
        return `${at.toFixed(3)}% { transform: translateX(${(-(frame * 100) / frames).toFixed(4)}%); }`;
    });
    // End on the last frame so a one-shot animation (fill: forwards) holds it until React swaps back to idle.
    const last = steps[steps.length - 1].frame;
    rules.push(`100% { transform: translateX(${(-(last * 100) / frames).toFixed(4)}%); }`);
    return { css: `@keyframes ${name} { ${rules.join(" ")} }`, durationMs: total };
}

function useReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduced(query.matches);
        update();
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);
    return reduced;
}

export default function SpriteCat({
    idle,
    action,
    label,
    idleHoldMs = 2600,
    frameMs = 130,
    idleSequence,
    actionSequence,
    className = "",
}: SpriteCatProps) {
    const [playing, setPlaying] = useState(false);
    const reducedMotion = useReducedMotion();
    // Unique, stable animation names per sheet and role
    // (Void uses one sheet for both, hence the -idle / -action suffix.)
    const idleName = `sprite${idle.src.replace(/\W+/g, "-")}-idle`;
    const actionName = `sprite${action.src.replace(/\W+/g, "-")}-action`;

    const idleAnim = sequenceKeyframes(
        idleName,
        idle.frames,
        idleSequence ?? [
            { frame: 0, ms: idleHoldMs },
            ...Array.from({ length: idle.frames - 1 }, (_, i) => ({ frame: i + 1, ms: frameMs })),
        ],
    );
    // The action holds its last frame for one beat, then the idle loop takes over.
    const actionAnim = sequenceKeyframes(
        actionName,
        action.frames,
        actionSequence ?? Array.from({ length: action.frames }, (_, i) => ({ frame: i, ms: frameMs })),
    );

    const playingRef = useRef(false);
    const play = useCallback(() => {
        if (reducedMotion || playingRef.current) return;
        playingRef.current = true;
        setPlaying(true);
    }, [reducedMotion]);

    const handleActionEnd = () => {
        playingRef.current = false;
        setPlaying(false);
    };

    const stripStyle = (frames: number): CSSProperties => ({
        width: `${frames * 100}%`,
        height: "100%",
        maxWidth: "none",
    });

    return (
        <button
            type="button"
            aria-label={label}
            // Mouse hover only: touch browsers fire a fake pointerenter on tap, and the click below already covers that.
            onPointerEnter={(e) => {
                if (e.pointerType === "mouse") play();
            }}
            onClick={play}
            className={`relative block overflow-hidden cursor-pointer select-none rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
        >
            <style>{idleAnim.css + actionAnim.css}</style>
            {/* Idle strip: always rendered; hidden while the action plays */}
            {/* eslint-disable-next-line @next/next/no-img-element -- sprite strips are tiny, pixel-exact and must not be resampled */}
            <img
                src={idle.src}
                alt=""
                aria-hidden="true"
                draggable={false}
                width={idle.frames * 64}
                height={64}
                className={`absolute left-0 top-0 [image-rendering:pixelated] ${playing ? "invisible" : ""}`}
                style={{
                    ...stripStyle(idle.frames),
                    animation: reducedMotion
                        ? "none"
                        : `${idleName} ${idleAnim.durationMs}ms step-end infinite`,
                }}
            />
            {/* Action strip: preloaded with the page so the first hover never flickers */}
            {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
            <img
                src={action.src}
                alt=""
                aria-hidden="true"
                draggable={false}
                width={action.frames * 64}
                height={64}
                onAnimationEnd={handleActionEnd}
                className={`absolute left-0 top-0 [image-rendering:pixelated] ${playing ? "" : "invisible"}`}
                style={{
                    ...stripStyle(action.frames),
                    animation: playing ? `${actionName} ${actionAnim.durationMs}ms step-end 1 forwards` : "none",
                }}
            />
        </button>
    );
}
