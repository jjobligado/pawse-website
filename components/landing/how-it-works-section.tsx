import Image from "next/image";
import FeatureCard from "./feature-card";
import { SectionSubtitle, SectionTitle } from "./section-heading";

const STEPS = [
    {
        number: "1",
        titleLines: ["Pick Your", "Companion"],
        stacked: ["Three cats, three paces.", "Pick who focuses with you."],
        desktop: ["Three cats, three paces.", "Pick who focuses", "with you."],
        connector: "/images/arrow-right-dark.svg",
        connectorAlt: "Next step",
    },
    {
        number: "2",
        titleLines: ["Focus with Your", "Companion"],
        stacked: ["Work alongside your cat's routine.", "Zero distractions."],
        desktop: ["Work alongside your", "cat's routine. Zero", "distractions."],
        connector: "/images/refresh-ccw.svg",
        connectorAlt: "Cycle between focus and break",
    },
    {
        number: "3",
        titleLines: ["Time to Play", "and Recharge"],
        stacked: ["Take a breather, play, and", "see what they have to say."],
        desktop: ["Take a breather, play,", "and see what they", "have to say."],
        connector: "/images/arrow-right-dark.svg",
        connectorAlt: "Next step",
    },
    {
        number: "4",
        titleLines: ["Watch Your", "Progress Build"],
        stacked: ["Every session gets logged.", "Small sessions, big streaks."],
        desktop: ["Every session gets", "logged. Small sessions,", "big streaks."],
    },
];

export default function HowItWorksSection() {
    return (
        <section
            id="how-it-works"
            className="scroll-mt-20 w-full max-w-[1280px] mx-auto py-24 md:py-32 px-6 md:px-12 lg:px-20 flex flex-col items-stretch gap-6 bg-white"
        >
            <SectionTitle>How it Works</SectionTitle>
            <SectionSubtitle>
                From choosing your companion to seeing your productivity grow.
            </SectionSubtitle>

            <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] auto-rows-auto items-stretch gap-4 mt-2">
                {STEPS.map((step) => (
                    <div key={step.number} className="contents">
                        <FeatureCard className="max-w-[420px] lg:max-w-none min-h-[230px] py-8 px-5">
                            <div className="relative z-10 w-full flex flex-col items-center gap-3">
                                <div className="w-full flex flex-col items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-accent-strong flex items-center justify-center shrink-0 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">
                                        <span className="text-sm font-semibold text-white">
                                            {step.number}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-ink-strong group-hover:text-black transition-colors duration-300 text-center tracking-[0.01em] leading-snug">
                                        <span className="block whitespace-nowrap">
                                            {step.titleLines[0]}
                                        </span>
                                        <span className="block whitespace-nowrap">
                                            {step.titleLines[1]}
                                        </span>
                                    </h3>
                                </div>
                                <p className="w-full text-sm sm:text-base lg:text-sm xl:text-base text-ink-soft group-hover:text-ink transition-colors duration-300 text-center leading-relaxed">
                                    {/* Stacked arrangement (<lg): 2 lines across all cards */}
                                    <span className="block lg:hidden">
                                        {step.stacked.map((line, idx) => (
                                            <span key={idx} className="block">
                                                {line}
                                            </span>
                                        ))}
                                    </span>

                                    {/* 4-column desktop layout (lg:): 3 lines across all cards */}
                                    <span className="hidden lg:block">
                                        {step.desktop.map((line, idx) => (
                                            <span key={idx} className="block">
                                                {line}
                                            </span>
                                        ))}
                                    </span>
                                </p>
                            </div>
                        </FeatureCard>
                        {step.connector && (
                            <div className="flex justify-center items-center shrink-0 py-0">
                                <Image
                                    src={step.connector}
                                    alt={step.connectorAlt || ""}
                                    width={20}
                                    height={20}
                                    className="rotate-90 lg:rotate-0"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
