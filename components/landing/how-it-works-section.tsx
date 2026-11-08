import Image from "next/image";
import FeatureCard from "./feature-card";
import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";

/**
 * The PAWSE loop in four cards. Each card links to the section that explains
 * it, so the row doubles as in-page navigation (useful on mobile, where the
 * header has no nav links). Connectors show the flow: steps 2 ↔ 3 cycle.
 */
const STEPS = [
    {
        title: "Pick Your Companion",
        body: "Three cats, three paces. Pick who focuses with you.",
        href: "#companions",
        connector: "/images/arrow-right-dark.svg",
    },
    {
        title: "Focus with Your Companion",
        body: "Work alongside your cat's routine. Zero distractions.",
        href: "#focus",
        connector: "/images/refresh-ccw.svg",
    },
    {
        title: "Time to Play and Recharge",
        body: "Take a breather, play, and see what they have to say.",
        href: "#break",
        connector: "/images/arrow-right-dark.svg",
    },
    {
        title: "Watch Your Progress Build",
        body: "Every session gets logged. Small sessions, big streaks.",
        href: "#progress",
    },
];

export default function HowItWorksSection() {
    return (
        <Section id="how-it-works">
            <SectionTitle>How It Works</SectionTitle>
            <SectionSubtitle className="text-center text-balance">
                From choosing your companion to seeing your progress grow.
            </SectionSubtitle>

            <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] auto-rows-auto items-stretch gap-4 mt-2">
                {STEPS.map((step, index) => (
                    <div key={step.href} className="contents">
                        <FeatureCard
                            href={step.href}
                            className="max-w-[420px] lg:max-w-none min-h-[230px] py-8 px-5"
                        >
                            <div className="relative z-10 w-full flex flex-col items-center gap-3">
                                <div className="w-full flex flex-col items-center gap-2">
                                    <span
                                        aria-hidden="true"
                                        className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0 text-sm font-semibold text-white transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-0.5"
                                    >
                                        {index + 1}
                                    </span>
                                    <h3 className="max-w-[16ch] text-lg font-semibold text-ink-strong group-hover:text-black transition-colors duration-300 text-center tracking-[0.01em] leading-snug text-balance">
                                        {step.title}
                                    </h3>
                                </div>
                                <p className="w-full max-w-[26ch] text-sm sm:text-base lg:text-sm xl:text-base text-ink-soft group-hover:text-ink transition-colors duration-300 text-center leading-relaxed text-balance">
                                    {step.body}
                                </p>
                            </div>
                        </FeatureCard>
                        {step.connector && (
                            <div aria-hidden="true" className="flex justify-center items-center shrink-0">
                                <Image
                                    src={step.connector}
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="rotate-90 lg:rotate-0"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Section>
    );
}
