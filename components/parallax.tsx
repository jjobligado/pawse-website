"use client";

import { useEffect, useRef, type ReactNode } from "react";

const MAX_DRIFT = 40; // px

interface ParallaxProps {
    children: ReactNode;
    /**
     * How far the content drifts per pixel it sits from the middle of the
     * screen. Positive moves it slower than the page (it trails behind),
     * negative moves it faster. Keep it small: 0.04–0.1.
     */
    depth?: number;
    className?: string;
}

/**
 * Gives a visual a little depth while scrolling: it sits exactly in place when
 * centred on screen and drifts a few pixels as it enters and leaves. Writes the
 * `translate` property straight to the DOM, so scrolling never re-renders.
 */
export default function Parallax({ children, depth = 0.06, className = "" }: ParallaxProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let frame = 0;
        let visible = false;

        const apply = () => {
            frame = 0;
            const rect = el.getBoundingClientRect();
            // Offset from the viewport centre; the layout box is used, so the drift itself doesn't feed back in
            const fromCentre = rect.top - (parseFloat(el.style.translate.split(" ")[1]) || 0) + rect.height / 2 - window.innerHeight / 2;
            // Capped so a tall visual never slides into the copy or the next section
            const drift = Math.max(-MAX_DRIFT, Math.min(MAX_DRIFT, fromCentre * depth));
            el.style.translate = `0 ${drift.toFixed(1)}px`;
        };
        const schedule = () => {
            if (visible && !frame) frame = requestAnimationFrame(apply);
        };

        // Only track while near the screen
        const observer = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting;
                schedule();
            },
            { rootMargin: "200px 0px" }
        );
        observer.observe(el);
        apply();

        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [depth]);

    return (
        <div ref={ref} className={`will-change-[translate] ${className}`}>
            {children}
        </div>
    );
}
