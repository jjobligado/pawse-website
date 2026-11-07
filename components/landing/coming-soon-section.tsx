import Image from "next/image";
import FeatureCard from "./feature-card";
import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";

const ITEMS = [
    {
        icon: "/images/check-account.png",
        title: "Save Your Progress",
        body: "Create a profile to safely back up your streaks and history to the cloud.",
    },
    {
        icon: "/images/stopwatch.png",
        title: "Custom Sessions",
        body: "Set your own focus and break durations to fit your personal workflow.",
    },
    {
        icon: "/images/audio-icon.svg",
        title: "Expanded Audio",
        body: "A richer library of ambient purrs, lo-fi tracks, and low-stimulation alarms.",
    },
];

export default function ComingSoonSection() {
    return (
        <Section id="coming-soon">
            <SectionTitle>Coming Soon</SectionTitle>
            <SectionSubtitle className="text-center text-balance">
                We&apos;re just getting started. Here&apos;s a sneak peek at what&apos;s
                next for PAWSE.
            </SectionSubtitle>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-6 mt-2">
                {ITEMS.map((item) => (
                    <FeatureCard
                        key={item.title}
                        className="max-w-[420px] md:max-w-none min-h-[220px] px-6 py-7 gap-3"
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
                        <p className="relative z-10 w-full max-w-[34ch] text-sm sm:text-base lg:text-[15px] xl:text-base text-ink-soft group-hover:text-ink transition-colors duration-300 text-center leading-relaxed text-balance">
                            {item.body}
                        </p>
                    </FeatureCard>
                ))}
            </div>
        </Section>
    );
}
