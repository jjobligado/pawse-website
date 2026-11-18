import Image from "next/image";
import Polaroid, { type PolaroidTint, type WashiTape } from "./polaroid";
import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";

/**
 * What's next, as three more instant photos on the same wall as How It Works,
 * except these are still developing: like a fresh instant print, the picture is
 * a soft blur under a milky haze. It stays that way (no hover reveal); the
 * Polaroid's usual pick-up is the only motion. Informational only: no links.
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

/** The still-developing picture: the feature's icon, blurred under a milky haze. */
function DevelopingPhoto({ icon }: { icon: string }) {
    return (
        <div className="relative flex items-center justify-center aspect-[4/3]">
            <Image src={icon} alt="" width={96} height={96} className="w-24 h-24 object-contain blur-[6px] opacity-50" />
            {/* The milky film of a print that hasn't come through yet */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(255_255_255/0.15)_0%,rgb(255_255_255/0.5)_100%)] backdrop-blur-[2px]"
            />
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
                            photo={<DevelopingPhoto icon={item.icon} />}
                            className={`w-[280px] md:w-full md:max-w-[320px] md:mx-auto h-full ${item.tilt}`}
                        >
                            <div className="flex flex-1 flex-col items-center gap-2 text-center">
                                <h3 className="text-lg font-semibold text-ink-strong leading-snug tracking-[0.005em]">
                                    {item.title}
                                </h3>
                                <p className="w-full text-body-sm text-ink-soft leading-relaxed text-balance">
                                    {item.body}
                                </p>
                            </div>
                        </Polaroid>
                    </li>
                ))}
            </ul>
        </Section>
    );
}
