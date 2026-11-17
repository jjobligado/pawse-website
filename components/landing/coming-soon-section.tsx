import Image from "next/image";
import Polaroid, { type PolaroidTint, type WashiTape } from "./polaroid";
import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";

/**
 * What's next, as three more instant photos on the same wall as How It Works,
 * except these haven't developed yet: the picture is blurred behind frosted
 * glass with a lock on it. Hovering the print (Polaroid's pick-up) lets the
 * blur ease off a touch, a peek, but never enough to reveal it.
 *
 * Informational only: no links. Each caption ends with a small "In the works"
 * tag where How It Works has its section link, so the two rows feel related.
 */

const ITEMS: {
    icon: string;
    title: string;
    body: string;
    tint: PolaroidTint;
    tape: WashiTape;
    tilt: string;
}[] = [
    {
        icon: "/images/check-account.png",
        title: "Save Your Progress",
        body: "Create a profile to safely back up your streaks and history to the cloud.",
        tint: "day",
        // Butter yellow pinstripes
        tape: { width: "96px", rotate: "-3deg", offset: "-12px", pattern: "repeating-linear-gradient(90deg,#F2D27A 0 4px,#FAE7B4 4px 9px)" },
        tilt: "md:-rotate-[1deg] md:motion-safe:hover:rotate-0 max-md:motion-safe:hover:-rotate-[1.4deg]",
    },
    {
        icon: "/images/stopwatch.png",
        title: "Custom Sessions",
        body: "Set your own focus and break durations to fit your personal workflow.",
        tint: "morning",
        // Sage green diagonal stripes
        tape: { width: "80px", rotate: "4deg", offset: "14px", pattern: "repeating-linear-gradient(45deg,#A9D3A0 0 7px,#CDE8C5 7px 14px)" },
        tilt: "md:rotate-[0.8deg] md:motion-safe:hover:rotate-0 max-md:motion-safe:hover:rotate-[1.4deg]",
    },
    {
        icon: "/images/audio-icon.svg",
        title: "Expanded Audio",
        body: "A richer library of ambient purrs, lo‑fi tracks, and low-stimulation alarms.",
        tint: "night",
        // Coral with white polka dots
        tape: { width: "110px", rotate: "-2deg", offset: "6px", pattern: "radial-gradient(circle,#FFFFFF 1.8px,transparent 2.3px) 0 0/10px 10px,#F4AD96" },
        tilt: "md:-rotate-[0.6deg] md:motion-safe:hover:rotate-0 max-md:motion-safe:hover:-rotate-[1.4deg]",
    },
];

/** The undeveloped picture: the feature's icon, blurred under frosted glass, with a lock. */
function LockedPhoto({ icon }: { icon: string }) {
    return (
        <div className="relative flex items-center justify-center aspect-[4/3]">
            <Image
                src={icon}
                alt=""
                width={96}
                height={96}
                className="w-24 h-24 object-contain blur-[5px] opacity-35 transition-[filter] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:blur-[3px]"
            />
            {/* Frosted glass over the print */}
            <div aria-hidden="true" className="absolute inset-0 bg-white/25 backdrop-blur-[2px]" />
            <span
                aria-hidden="true"
                className="absolute w-11 h-11 rounded-full bg-white/90 text-ink-strong flex items-center justify-center shadow-[0_1px_2px_rgb(30_30_40/0.12),0_6px_14px_-6px_rgb(30_30_40/0.3)]"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
            </span>
        </div>
    );
}

export default function ComingSoonSection() {
    return (
        <Section id="coming-soon">
            <SectionTitle>Coming Soon</SectionTitle>
            <SectionSubtitle className="text-center text-balance">
                We&apos;re just getting started. Here&apos;s a sneak peek at what&apos;s
                next for PAWSE.
            </SectionSubtitle>

            <ul className="w-full flex flex-col items-center gap-8 md:grid md:grid-cols-3 md:items-stretch md:gap-6 lg:gap-10 mt-4">
                {ITEMS.map((item) => (
                    <li key={item.title} className="contents">
                        <Polaroid
                            tint={item.tint}
                            tape={item.tape}
                            photo={<LockedPhoto icon={item.icon} />}
                            className={`group w-[280px] md:w-full md:max-w-[320px] md:mx-auto h-full ${item.tilt}`}
                        >
                            <div className="flex flex-1 flex-col items-center gap-2 text-center">
                                <h3 className="text-lg font-semibold text-ink-strong leading-snug tracking-[0.005em]">
                                    {item.title}
                                </h3>
                                <p className="w-full text-body-sm text-ink-soft leading-relaxed text-balance">
                                    {item.body}
                                </p>
                                <span className="mt-auto inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-ink-soft bg-[#F2F4F7] ring-1 ring-inset ring-[#E3E7EC]">
                                    In the works
                                </span>
                            </div>
                        </Polaroid>
                    </li>
                ))}
            </ul>
        </Section>
    );
}
