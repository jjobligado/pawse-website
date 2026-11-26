import type { ReactNode } from "react";

/**
 * Vertical rhythm for landing sections.
 * - default: standalone section
 * - pair-start / pair-end: two sections that read as one story (Focus → Break),
 *   so the gap between them is tighter than between unrelated sections
 */
export const SECTION_SPACING = {
    default: "py-16 md:py-24 lg:py-28",
    "pair-start": "pt-16 md:pt-24 lg:pt-28 pb-8 md:pb-12",
    "pair-end": "pt-8 md:pt-12 pb-16 md:pb-24 lg:pb-28",
} as const;

/** Gap between a section's header (title + subtitle) and its main content. */
export const SECTION_GAP = "gap-10 md:gap-12";

interface SectionProps {
    id?: string;
    children: ReactNode;
    spacing?: keyof typeof SECTION_SPACING;
    /** Layout utilities for the section's content (flex direction, gap, alignment). */
    className?: string;
}

/** Shared landing section: one max width, one side gutter, one vertical rhythm. */
export default function Section({
    id,
    children,
    spacing = "default",
    className = `flex flex-col items-stretch ${SECTION_GAP}`,
}: SectionProps) {
    return (
        <section
            id={id}
            className={`scroll-mt-20 w-full max-w-content mx-auto px-6 md:px-12 lg:px-20 bg-white ${SECTION_SPACING[spacing]} ${className}`}
        >
            {children}
        </section>
    );
}
