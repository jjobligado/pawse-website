"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Fits the wall's fixed-size core (`width` px) to the section's content width,
 * scaling down as far as needed and up to `maxScale`. The wall itself can be wider than the section (CSS lets it
 * reach the header's edges), so the board is stretched to cover that extra room
 * at the same scale: --hiw-s is the scale, --hiw-bw the board's unscaled width.
 * The wall's height comes from CSS, so nothing shifts while this waits to run.
 */
export default function WallFit({
    width,
    maxScale = 1,
    className,
    style,
    children,
}: {
    width: number;
    maxScale?: number;
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        const content = el?.parentElement;
        if (!el || !content) return;
        const fit = () => {
            const s = Math.min(maxScale, content.clientWidth / width);
            // hidden at this screen size: nothing to fit
            if (!el.clientWidth) return;
            el.style.setProperty("--hiw-s", String(s));
            el.style.setProperty("--hiw-bw", `${el.clientWidth / s}px`);
        };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(el);
        ro.observe(content);
        return () => ro.disconnect();
    }, [width, maxScale]);

    return (
        <div ref={ref} className={className} style={style}>
            {children}
        </div>
    );
}
