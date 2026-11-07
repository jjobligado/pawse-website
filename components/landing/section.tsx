import type { ReactNode } from "react";

/**
 * Vertical rhythm for landing sections.
 * - default: standalone section
 * - pair-start / pair-end: two sections that read as one story (Focus → Break),
 *   so the gap between them is tighter than between unrelated sections
 */
const SPACING = {
    default: "py-16 md:py-24",
    "pair-start": "pt-16 md:pt-24 pb-6 md:pb-8",
    "pair-end": "pt-6 md:pt-8 pb-16 md:pb-24",
} as const;

interface SectionProps {
    id?: string;
    children: ReactNode;
    spacing?: keyof typeof SPACING;
    /** Layout utilities for the section's content (flex direction, gap, alignment). */
    className?: string;
}

/** Shared landing section: one max width, one side gutter, one vertical rhythm. */
export default function Section({
    id,
    children,
    spacing = "default",
    className = "flex flex-col items-stretch gap-6",
}: SectionProps) {
    return (
        <section
            id={id}
            className={`scroll-mt-20 w-full max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 bg-white ${SPACING[spacing]} ${className}`}
        >
            {children}
        </section>
    );
}
