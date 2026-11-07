import type { ReactNode } from "react";
import { SectionTitle } from "./section-heading";

interface SplitFeatureProps {
    /** Heading lines, each kept on its own line. */
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
    titleLines,
    children,
    media,
    mediaFirst = false,
}: SplitFeatureProps) {
    const copy = (
        <div className="w-full lg:w-[40%] flex flex-col justify-center items-stretch gap-4">
            <SectionTitle className="text-left">
                <span className="block whitespace-nowrap">{titleLines[0]}</span>
                <span className="block whitespace-nowrap">{titleLines[1]}</span>
            </SectionTitle>
            <p className="text-base md:text-lg text-muted text-left leading-relaxed">
                {children}
            </p>
        </div>
    );

    return (
        <section className="w-full max-w-[1280px] mx-auto py-12 md:py-16 px-6 md:px-12 lg:px-20 flex flex-col items-stretch gap-8 bg-white">
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
        </section>
    );
}
