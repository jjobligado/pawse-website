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
            className={`font-pixel text-display-lg font-semibold text-ink ${className}`}
        >
            {children}
        </h2>
    );
}

/** Title + subtitle kept close together, so they read as one header above the content. */
export function SectionHeader({ children, className = "items-center text-center" }: TextProps) {
    return <div className={`flex flex-col gap-3 md:gap-4 ${className}`}>{children}</div>;
}

/** Muted lead paragraph that sits under a SectionTitle. */
export function SectionSubtitle({ children, className = "text-center" }: TextProps) {
    return <p className={`text-base md:text-lg text-muted ${className}`}>{children}</p>;
}
