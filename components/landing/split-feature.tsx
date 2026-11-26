import type { ReactNode } from "react";
import Section from "./section";
import Parallax from "@/components/parallax";
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
}

/** Two-column copy + media row used by the Focus and Break sections. */
export default function SplitFeature({
    id,
    titleLines,
    children,
    media,
    mediaFirst = false,
}: SplitFeatureProps) {
    const copy = (
        <div className="w-full lg:w-[40%] flex flex-col justify-center items-stretch gap-4 md:gap-5">
            <SectionTitle className="text-center lg:text-left">
                <span className="block">{titleLines[0]}</span>
                <span className="block">{titleLines[1]}</span>
            </SectionTitle>
            <p className="max-w-[560px] mx-auto lg:mx-0 text-base md:text-lg text-muted text-center lg:text-left leading-relaxed text-pretty">
                {children}
            </p>
        </div>
    );

    // The media trails the page a touch while scrolling, so the row reads as two layers
    const drifting = (
        <Parallax depth={0.05} className="w-full lg:w-[56%] shrink-0">
            {media}
        </Parallax>
    );

    return (
        <Section id={id} className="flex flex-col items-stretch">
            <div
                className={`w-full flex ${
                    mediaFirst ? "flex-col-reverse" : "flex-col"
                } lg:flex-row items-center justify-between gap-10 md:gap-12 lg:gap-16`}
            >
                {mediaFirst ? (
                    <>
                        {drifting}
                        {copy}
                    </>
                ) : (
                    <>
                        {copy}
                        {drifting}
                    </>
                )}
            </div>
        </Section>
    );
}
