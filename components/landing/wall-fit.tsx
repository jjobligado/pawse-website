"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fits the wall's fixed-size core (`width` px) to the section's content width,
 * scaling down only. The wall itself can be wider than the section (CSS lets it
 * reach the header's edges), so the board is stretched to cover that extra room
 * at the same scale: --hiw-s is the scale, --hiw-bw the board's unscaled width.
 * The wall's height comes from CSS, so nothing shifts while this waits to run.
 */
export default function WallFit({ width, className, children }: { width: number; className?: string; children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        const content = el?.parentElement;
        if (!el || !content) return;
        const fit = () => {
            const s = Math.min(1, content.clientWidth / width);
            el.style.setProperty("--hiw-s", String(s));
            el.style.setProperty("--hiw-bw", `${el.clientWidth / s}px`);
        };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(el);
        ro.observe(content);
        return () => ro.disconnect();
    }, [width]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
