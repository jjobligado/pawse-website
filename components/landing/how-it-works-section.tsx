import Image from "next/image";
import Polaroid, { type PolaroidTint } from "./polaroid";
import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";

/**
 * The PAWSE loop as four instant photos pinned to the wall. The photos show
 * the cat's moment (what it feels like); the sections below show the app (how
 * it works), so nothing here spoils them. Photos are static: animation lives
 * in the detailed sections. Each caption ends with a small link to its section,
 * which keeps the in-page navigation (useful on mobile, where the header has no
 * nav links) without making the whole card look like a button. Connectors show
 * the flow: steps 2 ↔ 3 cycle.
 *
 * The tint runs morning → night across the four, one working day.
 *
 * Every caption shows the SAME number of lines at every screen size, so line
 * breaks are placed by hand per layout:
 * - title: always 2 lines
 * - wide:   description in 2 lines (1 column on phones, 2×2 grid on tablets/small laptops)
 * - narrow: description in 3 lines (4 in a row, xl and up)
 * When editing copy, keep each line short enough for the narrowest card
 * and keep the line counts.
 */

const SPRITES = "/sprites";

/** One frame of a 64px sprite sheet, at a whole-number scale so pixels stay crisp. Static. */
function Frame({ src, frames, frame, className }: { src: string; frames: number; frame: number; className: string }) {
    return (
        <span aria-hidden="true" className={`relative block overflow-hidden shrink-0 ${className}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- pixel strip, must not be resampled */}
            <img
                src={src}
                alt=""
                draggable={false}
                className="absolute top-0 left-0 h-full max-w-none [image-rendering:pixelated]"
                style={{ width: `${frames * 100}%`, transform: `translateX(-${(frame / frames) * 100}%)` }}
            />
        </span>
    );
}

// Phones show the photo small beside the caption (1x); from md the photo sits on top (1.5x / 2x).
const CAT = "w-16 h-16 md:w-24 md:h-24 xl:w-32 xl:h-32";
const GROUP_CAT = "w-16 h-16 md:w-[72px] md:h-[72px] xl:w-24 xl:h-24";
const PHOTO = "flex items-end justify-center aspect-[4/3] pt-2";

const STEPS: {
    title: string[];
    wide: string[];
    narrow: string[];
    href: string;
    link: string;
    tint: PolaroidTint;
    tilt: string;
    developDelayMs: number;
    photo: React.ReactNode;
    connector?: string;
}[] = [
    {
        title: ["Pick Your", "Companion"],
        wide: ["Three cats, three paces.", "Pick who focuses with you."],
        narrow: ["Three cats, three paces.", "Pick who focuses", "with you."],
        href: "#companions",
        link: "Meet the cats",
        tint: "morning",
        tilt: "md:-rotate-[1.5deg]",
        developDelayMs: 0,
        photo: (
            // A group photo: Ginger, Tux and Void sitting together
            <div className={PHOTO}>
                <div className="flex items-end -space-x-3 md:-space-x-4">
                    <Frame src={`${SPRITES}/ginger-body-idle-sheet.png`} frames={5} frame={0} className={GROUP_CAT} />
                    <Frame src={`${SPRITES}/tux-body-idle-sheet.png`} frames={4} frame={0} className={GROUP_CAT} />
                    <Frame src={`${SPRITES}/void-body-idle-sheet.png`} frames={5} frame={0} className={GROUP_CAT} />
                </div>
            </div>
        ),
        connector: "/images/arrow-right-dark.svg",
    },
    {
        title: ["Focus with Your", "Companion"],
        wide: ["Work alongside your cat's routine.", "Zero distractions."],
        narrow: ["Work alongside your", "cat's routine. Zero", "distractions."],
        href: "#focus",
        link: "See Focus",
        tint: "day",
        tilt: "md:rotate-[1deg]",
        developDelayMs: 180,
        // Tux mid-sip, steam rising from the mug
        photo: (
            <div className={PHOTO}>
                <Frame src={`${SPRITES}/tux-body-focus-sheet.png`} frames={5} frame={3} className={CAT} />
            </div>
        ),
        connector: "/images/refresh-ccw.svg",
    },
    {
        title: ["Time to Play", "and Recharge"],
        wide: ["Take a breather, play, and", "see what they have to say."],
        narrow: ["Take a breather, play,", "and see what they", "have to say."],
        href: "#break",
        link: "See Break",
        tint: "dusk",
        tilt: "md:-rotate-[0.8deg]",
        developDelayMs: 90,
        // Ginger, tail up, mid-play
        photo: (
            <div className={PHOTO}>
                <Frame src={`${SPRITES}/ginger-body-break-sheet.png`} frames={9} frame={8} className={CAT} />
            </div>
        ),
        connector: "/images/arrow-right-dark.svg",
    },
    {
        title: ["Watch Your", "Progress Build"],
        wide: ["Every session gets logged.", "Small sessions, big streaks."],
        narrow: ["Every session gets", "logged. Small sessions,", "big streaks."],
        href: "#progress",
        link: "See Progress",
        tint: "night",
        tilt: "md:rotate-[1.4deg]",
        developDelayMs: 260,
        // A souvenir snapshot: the day's completed sessions, as fish
        photo: (
            <div className="flex items-center justify-center aspect-[4/3]">
                <div className="flex items-center gap-1 md:gap-1.5">
                    {["orange", "tuxedo", "black", "orange"].map((fish, i) => (
                        <Image
                            key={i}
                            src={`/images/completed-${fish}-fish.png`}
                            alt=""
                            width={32}
                            height={32}
                            className={`w-6 h-6 md:w-8 md:h-8 [image-rendering:pixelated] drop-shadow-[0_2px_3px_rgba(0,0,0,0.12)] ${i % 2 ? "-scale-x-100" : ""}`}
                        />
                    ))}
                </div>
            </div>
        ),
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
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] auto-rows-auto items-stretch gap-4 md:gap-x-8 md:gap-y-10 xl:gap-x-4 mt-4">
                {STEPS.map((step) => (
                    <div key={step.href} className="contents">
                        <Polaroid
                            tint={step.tint}
                            developDelayMs={step.developDelayMs}
                            photo={step.photo}
                            className={`w-full max-w-[420px] md:max-w-none mx-auto h-full ${step.tilt}`}
                        >
                            <div className="flex flex-col items-center gap-2 text-center">
                                {/* Always 2 lines; min-height keeps captions aligned even if a font renders wider */}
                                <h3 className="min-h-[2lh] font-pixel text-lg md:text-xl font-semibold text-ink-strong leading-snug">
                                    <Lines lines={step.title} className="block whitespace-nowrap" />
                                </h3>
                                <p className="w-full min-h-[2lh] xl:min-h-[3lh] text-sm sm:text-base md:text-body-sm text-ink-soft leading-relaxed">
                                    <Lines lines={step.wide} className="block xl:hidden" />
                                    <Lines lines={step.narrow} className="hidden xl:block" />
                                </p>
                                <a
                                    href={step.href}
                                    className="mt-1 text-sm font-medium text-accent-strong underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-2 rounded-chip"
                                >
                                    {step.link}
                                    <span aria-hidden="true"> ↓</span>
                                </a>
                            </div>
                        </Polaroid>
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
