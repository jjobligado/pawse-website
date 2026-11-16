"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * An instant photo pinned to the wall: a white print with a deep bottom border,
 * a small sky-tinted "photo" and a caption. Informational, never a control: no
 * pointer, no fill, no colour change. Anything clickable goes in the caption.
 * Hovering picks the photo up: it lifts a little toward you (translate + a 2%
 * scale, the shadow grows and softens) while its tilt changes (set by the
 * parent). Hover only on devices that can hover (Tailwind's hover variant) and
 * only without reduced motion; strong ease-out on exact properties.
 *
 * The photo develops once the first time it scrolls into view (a grey-blue
 * film fades off the picture), like a real instant photo. Only photos that are
 * still below the fold when the page loads develop; anything already on screen
 * is shown as-is, and so is everything when JS is off or motion is reduced.
 */

export type PolaroidTint = "morning" | "day" | "dusk" | "night";

const TINT: Record<PolaroidTint, string> = {
    morning: "bg-[linear-gradient(180deg,#FFE6D3_0%,#FFF6EE_100%)]",
    day: "bg-[linear-gradient(180deg,#CDE7FF_0%,#F2F9FF_100%)]",
    dusk: "bg-[linear-gradient(180deg,#FFD6C8_0%,#FFF0E9_100%)]",
    night: "bg-[linear-gradient(180deg,#D3DAF4_0%,#F0F2FB_100%)]",
};

type DevelopState = "idle" | "pending" | "developed";

/** A strip of washi tape holding the photo to the wall. */
export type WashiTape = {
    /** Strip length, e.g. "84px". */
    width: string;
    /** Tilt, e.g. "-4deg". */
    rotate: string;
    /** Horizontal nudge from centre, e.g. "-10px". */
    offset: string;
    /** CSS background: the tape's colour and pattern. */
    pattern: string;
};

// Torn ends: a small zigzag on both short edges.
const TORN =
    "polygon(0 0,100% 0,97% 20%,100% 40%,97% 60%,100% 80%,97% 100%,0 100%,3% 80%,0 60%,3% 40%,0 20%)";

export default function Polaroid({
    photo,
    tint,
    developDelayMs = 0,
    tape,
    className = "",
    children,
}: {
    /** Washi tape across the top edge (decorative). */
    tape?: WashiTape;
    /** What's in the picture (static sprites, never animated: it's a photo). */
    photo: ReactNode;
    tint: PolaroidTint;
    /** Stagger for the develop fade, so a row doesn't develop in lockstep. */
    developDelayMs?: number;
    className?: string;
    /** The caption under the photo. */
    children: ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [develop, setDevelop] = useState<DevelopState>("idle");

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        // Already on screen at load: show it as it is.
        if (el.getBoundingClientRect().top < window.innerHeight) return;

        setDevelop("pending");
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setDevelop("developed");
                    io.disconnect();
                }
            },
            { threshold: 0.45 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <figure
            className={`relative flex flex-col bg-white rounded-[4px] p-3 pb-4 shadow-[0_1px_2px_rgb(30_30_40/0.1),0_6px_12px_-6px_rgb(30_30_40/0.16),0_22px_36px_-22px_rgb(30_30_40/0.4)] transition-[translate,rotate,scale,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:z-10 motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-[1.02] hover:shadow-[0_2px_4px_rgb(30_30_40/0.08),0_14px_24px_-10px_rgb(30_30_40/0.2),0_36px_56px_-28px_rgb(30_30_40/0.42)] ${className}`}
        >
            {tape && (
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute z-10 -top-3.5 left-1/2 h-[28px] opacity-[0.88] shadow-[0_1px_1px_rgb(30_30_40/0.08)]"
                    style={{
                        width: tape.width,
                        background: tape.pattern,
                        clipPath: TORN,
                        transform: `translateX(calc(-50% + ${tape.offset})) rotate(${tape.rotate})`,
                    }}
                />
            )}
            <div ref={ref} className={`relative overflow-hidden rounded-[2px] ${TINT[tint]}`}>
                {photo}
                {/* A soft sheen on the print */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgb(255_255_255/0.35)_0%,transparent_42%)]" />
                {/* Undeveloped film: faded away once, on first view */}
                {develop !== "idle" && (
                    <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,#C7CDD6,#E2E6EB_60%,#D3D9E0)] transition-opacity duration-[1400ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                            develop === "developed" ? "opacity-0" : "opacity-100"
                        }`}
                        style={{ transitionDelay: develop === "developed" ? `${developDelayMs}ms` : "0ms" }}
                    />
                )}
            </div>
            <figcaption className="flex-1 pt-3.5 pb-1 flex flex-col">{children}</figcaption>
        </figure>
    );
}
