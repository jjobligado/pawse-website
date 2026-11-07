import type { ComponentProps, ReactNode } from "react";
import Section from "./section";
import { SectionTitle } from "./section-heading";

interface SplitFeatureProps {
    id?: string;
    /** Heading lines, each starting on its own line (they may still wrap on narrow screens). */
    titleLines: [string, string];
    /** Body copy shown under the heading. */
    children: ReactNode;
    /** Visual shown beside the copy (mockup today, looping video later). */
    media: ReactNode;
    /** Put the media on the left on desktop (it always stacks below the copy on mobile). */
    mediaFirst?: boolean;
    spacing?: ComponentProps<typeof Section>["spacing"];
}

/** Two-column copy + media row used by the Focus and Break sections. */
export default function SplitFeature({
    id,
    titleLines,
    children,
    media,
    mediaFirst = false,
    spacing,
}: SplitFeatureProps) {
    const copy = (
        <div className="w-full lg:w-[40%] flex flex-col justify-center items-stretch gap-4">
            <SectionTitle className="text-left">
                <span className="block">{titleLines[0]}</span>
                <span className="block">{titleLines[1]}</span>
            </SectionTitle>
            <p className="text-base md:text-lg text-muted text-left leading-relaxed">
                {children}
            </p>
        </div>
    );

    return (
        <Section id={id} spacing={spacing} className="flex flex-col items-stretch">
            <div
                className={`w-full flex ${
                    mediaFirst ? "flex-col-reverse" : "flex-col"
                } lg:flex-row items-center justify-between gap-10 lg:gap-14`}
            >
                {mediaFirst ? (
                    <>
                        {media}
                        {copy}
                    </>
                ) : (
                    <>
                        {copy}
                        {media}
                    </>
                )}
            </div>
        </Section>
    );
}
