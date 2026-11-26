import type { ReactNode } from "react";

/** Vertical rhythm for landing sections: the same on every section, so each gap reads the same. */
export const SECTION_SPACING = "py-16 md:py-24 lg:py-28";

/** Gap between a section's header (title + subtitle) and its main content. */
export const SECTION_GAP = "gap-10 md:gap-12";

interface SectionProps {
    id?: string;
    children: ReactNode;
    /** Layout utilities for the section's content (flex direction, gap, alignment). */
    className?: string;
}

/** Shared landing section: one max width, one side gutter, one vertical rhythm. */
export default function Section({
    id,
    children,
    className = `flex flex-col items-stretch ${SECTION_GAP}`,
}: SectionProps) {
    return (
        <section
            id={id}
            className={`scroll-mt-20 w-full max-w-content mx-auto px-6 md:px-12 lg:px-20 bg-white ${SECTION_SPACING} ${className}`}
        >
            {children}
        </section>
    );
}
