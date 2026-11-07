import type { ReactNode } from "react";

interface TextProps {
    children: ReactNode;
    /** Alignment / extra utilities. Defaults to centered. */
    className?: string;
}

/** Pixel-font section heading (h2) shared by every landing section. */
export function SectionTitle({ children, className = "text-center" }: TextProps) {
    return (
        <h2
            className={`font-pixel text-[clamp(2rem,1.6rem+1.5vw,3rem)] font-semibold text-ink leading-[1.1] ${className}`}
        >
            {children}
        </h2>
    );
}

/** Muted lead paragraph that sits under a SectionTitle. */
export function SectionSubtitle({ children, className = "text-center" }: TextProps) {
    return <p className={`text-base md:text-lg text-muted ${className}`}>{children}</p>;
}
