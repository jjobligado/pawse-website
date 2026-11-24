"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scales a fixed-size board down to fit its container's width (never up).
 * The container keeps the board's aspect ratio in CSS, so its height is right
 * before this runs; only the board's scale waits for the first measurement.
 */
export default function WallFit({ width, className, children }: { width: number; className?: string; children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const fit = () => el.style.setProperty("--hiw-s", String(Math.min(1, el.clientWidth / width)));
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(el);
        return () => ro.disconnect();
    }, [width]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
