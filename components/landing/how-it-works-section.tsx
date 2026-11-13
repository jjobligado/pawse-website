import Image from "next/image";
import FeatureCard from "./feature-card";
import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";

/**
 * The PAWSE loop in four cards. Each card links to the section that explains
 * it, so the row doubles as in-page navigation (useful on mobile, where the
 * header has no nav links). Connectors show the flow: steps 2 ↔ 3 cycle.
 *
 * Every card shows the SAME number of lines at every screen size, so line
 * breaks are placed by hand per layout:
 * - title: always 2 lines
 * - wide:   description in 2 lines (1 column on phones, 2×2 grid on tablets/small laptops)
 * - narrow: description in 3 lines (4 in a row, xl and up)
 * When editing copy, keep each line short enough for the narrowest card
 * (≈200px of text at 15px in the 4-column layout) and keep the line counts.
 */
const STEPS = [
    {
        title: ["Pick Your", "Companion"],
        wide: ["Three cats, three paces.", "Pick who focuses with you."],
        narrow: ["Three cats, three paces.", "Pick who focuses", "with you."],
        href: "#companions",
        connector: "/images/arrow-right-dark.svg",
    },
    {
        title: ["Focus with Your", "Companion"],
        wide: ["Work alongside your cat's routine.", "Zero distractions."],
        narrow: ["Work alongside your", "cat's routine. Zero", "distractions."],
        href: "#focus",
        connector: "/images/refresh-ccw.svg",
    },
    {
        title: ["Time to Play", "and Recharge"],
        wide: ["Take a breather, play, and", "see what they have to say."],
        narrow: ["Take a breather, play,", "and see what they", "have to say."],
        href: "#break",
        connector: "/images/arrow-right-dark.svg",
    },
    {
        title: ["Watch Your", "Progress Build"],
        wide: ["Every session gets logged.", "Small sessions, big streaks."],
        narrow: ["Every session gets", "logged. Small sessions,", "big streaks."],
        href: "#progress",
    },
];

function Lines({ lines, className }: { lines: string[]; className: string }) {
    return (
        <span className={className}>
            {lines.map((line) => (
                <span key={line} className="block">
                    {line}
                </span>
            ))}
        </span>
    );
}

export default function HowItWorksSection() {
    return (
        <Section id="how-it-works">
            <SectionTitle>How It Works</SectionTitle>
            <SectionSubtitle className="text-center text-balance">
                From choosing your companion to seeing your progress grow.
            </SectionSubtitle>

            {/* 1 column → 2×2 grid (md) → 4 in a row with connectors (xl) */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] auto-rows-auto items-stretch gap-4 mt-2">
                {STEPS.map((step, index) => (
                    <div key={step.href} className="contents">
                        <FeatureCard
                            href={step.href}
                            className="max-w-[420px] md:max-w-none min-h-[230px] py-8 px-5"
                        >
                            <div className="relative z-10 w-full flex flex-col items-center gap-3">
                                <div className="w-full flex flex-col items-center gap-2">
                                    <span
                                        aria-hidden="true"
                                        className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0 text-sm font-semibold text-white transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-0.5"
                                    >
                                        {index + 1}
                                    </span>
                                    {/* Always 2 lines; min-height keeps cards aligned even if a font renders wider */}
                                    <h3 className="min-h-[2lh] text-lg font-semibold text-ink-strong group-hover:text-black transition-colors duration-300 text-center tracking-[0.01em] leading-snug">
                                        <Lines lines={step.title} className="block whitespace-nowrap" />
                                    </h3>
                                </div>
                                <p className="w-full min-h-[2lh] xl:min-h-[3lh] text-sm sm:text-base md:text-body-sm text-ink-soft group-hover:text-ink transition-colors duration-300 text-center leading-relaxed">
                                    <Lines lines={step.wide} className="block xl:hidden" />
                                    <Lines lines={step.narrow} className="hidden xl:block" />
                                </p>
                            </div>
                        </FeatureCard>
                        {step.connector && (
                            // Shown when stacked (pointing down) and in the 4-across row; hidden in the 2×2 grid
                            <div
                                aria-hidden="true"
                                className="flex md:hidden xl:flex justify-center items-center shrink-0"
                            >
                                <Image
                                    src={step.connector}
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="rotate-90 xl:rotate-0"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Section>
    );
}
