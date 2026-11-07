import Image from "next/image";
import FeatureCard from "./feature-card";
import { SectionSubtitle, SectionTitle } from "./section-heading";

const ITEMS = [
    {
        icon: "/images/check-account.png",
        title: "Save Your Progress",
        lines2: ["Create a profile to safely back up", "your streaks and history to the cloud."],
        lines3: ["Create a profile to safely", "back up your streaks and", "history to the cloud."],
    },
    {
        icon: "/images/stopwatch.png",
        title: "Custom Sessions",
        lines2: ["Set your own focus and break durations", "to fit into your personal workflow."],
        lines3: ["Set your own focus and", "break durations to fit into", "your personal workflow."],
    },
    {
        icon: "/images/audio-icon.svg",
        title: "Expanded Audio",
        lines2: ["A richer library of ambient purrs, lo-fi", "tracks, and low-stimulation alarms."],
        lines3: ["A richer library of ambient", "purrs, lo-fi tracks, and", "low-stimulation alarms."],
    },
];

export default function ComingSoonSection() {
    return (
        <section
            id="coming-soon"
            className="scroll-mt-20 w-full max-w-[1280px] mx-auto py-24 md:py-32 px-6 md:px-12 lg:px-12 xl:px-16 2xl:px-20 flex flex-col items-stretch gap-6 bg-white"
        >
            <SectionTitle>Coming Soon...</SectionTitle>

            <div className="px-4 md:px-10 flex justify-center items-center">
                <SectionSubtitle>
                    We&apos;re just getting started! Here’s a sneak peek at what’s next for
                    PAWSE.
                </SectionSubtitle>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-6 mt-2">
                {ITEMS.map((item) => (
                    <FeatureCard
                        key={item.title}
                        className="max-w-[420px] md:max-w-none min-h-[220px] p-6 sm:p-6 lg:px-5 lg:py-6 xl:px-5 xl:py-7 gap-3"
                    >
                        <div className="relative z-10 w-full flex flex-col justify-center items-center gap-1.5">
                            <div className="w-10 h-10 relative flex items-center justify-center shrink-0 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">
                                <Image
                                    src={item.icon}
                                    alt=""
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold text-ink-strong group-hover:text-black transition-colors duration-300 text-center tracking-[0.01em]">
                                {item.title}
                            </h3>
                        </div>
                        <p className="relative z-10 w-full text-sm sm:text-base lg:text-sm xl:text-[15px] 2xl:text-base text-ink-soft group-hover:text-ink transition-colors duration-300 text-center leading-relaxed">
                            {/* 2-line layout: stacked (<md) and wide desktop (lg:) */}
                            <span className="block md:hidden lg:block">
                                {item.lines2.map((line, idx) => (
                                    <span key={idx} className="block">
                                        {line}
                                    </span>
                                ))}
                            </span>

                            {/* 3-line layout: compact 3-column tablet (md to lg) */}
                            <span className="hidden md:block lg:hidden">
                                {item.lines3.map((line, idx) => (
                                    <span key={idx} className="block">
                                        {line}
                                    </span>
                                ))}
                            </span>
                        </p>
                    </FeatureCard>
                ))}
            </div>
        </section>
    );
}
