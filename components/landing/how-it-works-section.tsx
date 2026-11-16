import Image from "next/image";
import Polaroid, { type PolaroidTint, type WashiTape } from "./polaroid";
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
 * Layout is only ever a straight line, so the flow reads at a glance: one row
 * of four from xl, one column below it (arrows point down). All four polaroids
 * are the same size in both: the column uses a fixed card width, the row equal
 * columns, and every caption has the same line counts (title 2 lines,
 * description 3 lines, broken by hand). When editing copy, keep each line short
 * enough for ~200px of text at 15px and keep the line counts.
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

// Moderate, crisp sizes in every layout: single cats at 1.5x, the group at 1x.
const CAT = "w-24 h-24";
const GROUP_CAT = "w-16 h-16";
const PHOTO = "flex items-end justify-center aspect-[4/3] pt-2";

const STEPS: {
    title: string[];
    narrow: string[];
    href: string;
    link: string;
    tint: PolaroidTint;
    tape: WashiTape;
    tilt: string;
    developDelayMs: number;
    photo: React.ReactNode;
    connector?: string;
}[] = [
    {
        title: ["Pick Your", "Companion"],
        narrow: ["Three cats, three paces.", "Pick who focuses", "with you."],
        href: "#companions",
        link: "Meet the cats",
        tint: "morning",
        // Sage green diagonal stripes (on a peach photo)
        tape: { width: "112px", rotate: "-4deg", offset: "-14px", pattern: "repeating-linear-gradient(45deg,#A9D3A0 0 7px,#CDE8C5 7px 14px)" },
        tilt: "xl:-rotate-[1.2deg] xl:motion-safe:hover:rotate-0 max-xl:motion-safe:hover:-rotate-[1.4deg]",
        developDelayMs: 0,
        photo: (
            // A group photo: Ginger, Tux and Void sitting together
            <div className={PHOTO}>
                <div className="flex items-end -space-x-3">
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
        narrow: ["Work alongside your", "cat's routine. Zero", "distractions."],
        href: "#focus",
        link: "See Focus",
        tint: "day",
        // Coral with white polka dots (on a blue photo)
        tape: { width: "84px", rotate: "3deg", offset: "18px", pattern: "radial-gradient(circle,#FFFFFF 1.8px,transparent 2.3px) 0 0/10px 10px,#F4AD96" },
        tilt: "xl:rotate-[0.8deg] xl:motion-safe:hover:rotate-0 max-xl:motion-safe:hover:rotate-[1.4deg]",
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
        narrow: ["Take a breather, play,", "and see what they", "have to say."],
        href: "#break",
        link: "See Break",
        tint: "dusk",
        // Sky blue gingham (on a rose photo)
        tape: { width: "122px", rotate: "-2deg", offset: "4px", pattern: "linear-gradient(90deg,rgb(255 255 255/0.45) 50%,transparent 50%) 0 0/12px 12px,linear-gradient(rgb(255 255 255/0.45) 50%,transparent 50%) 0 0/12px 12px,#A7D2F1" },
        tilt: "xl:-rotate-[0.6deg] xl:motion-safe:hover:rotate-0 max-xl:motion-safe:hover:-rotate-[1.4deg]",
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
        narrow: ["Every session gets", "logged. Small sessions,", "big streaks."],
        href: "#progress",
        link: "See Progress",
        tint: "night",
        // Butter yellow pinstripes (on a lavender photo)
        tape: { width: "74px", rotate: "5deg", offset: "-20px", pattern: "repeating-linear-gradient(90deg,#F2D27A 0 4px,#FAE7B4 4px 9px)" },
        tilt: "xl:rotate-[1deg] xl:motion-safe:hover:rotate-0 max-xl:motion-safe:hover:rotate-[1.4deg]",
        developDelayMs: 260,
        // A souvenir snapshot: the day's completed sessions, as fish
        photo: (
            <div className="flex items-center justify-center aspect-[4/3]">
                <div className="flex items-center gap-1.5">
                    {["orange", "tuxedo", "black", "orange"].map((fish, i) => (
                        <Image
                            key={i}
                            src={`/images/completed-${fish}-fish.png`}
                            alt=""
                            width={32}
                            height={32}
                            className={`w-8 h-8 [image-rendering:pixelated] drop-shadow-[0_2px_3px_rgba(0,0,0,0.12)] ${i % 2 ? "-scale-x-100" : ""}`}
                        />
                    ))}
                </div>
            </div>
        ),
    },
];

/**
 * "See Focus ↓": a small, clearly-a-link pill at the foot of the caption.
 * Darker blue text for AA contrast; on hover (Tailwind's hover variant only
 * applies on devices that can hover) the wash deepens and the arrow chip nudges
 * down toward the section it jumps to; pressing scales it to 0.97. Strong
 * ease-out, exact properties only.
 */
function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            className="group/link mt-auto inline-flex items-center gap-2 rounded-full pl-3.5 pr-1 py-1 text-sm font-medium text-[#1A6CA3] bg-[#EAF5FD] ring-1 ring-inset ring-[#CFE6F8] transition-[background-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#DDEFFC] hover:ring-[#B9DCF6] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-2"
        >
            {children}
            <span
                aria-hidden="true"
                className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0_1px_2px_rgb(26_108_163/0.18)] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/link:translate-y-0.5"
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14" />
                    <path d="m19 12-7 7-7-7" />
                </svg>
            </span>
        </a>
    );
}

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

            {/* A straight column (arrows down) → a straight row of four from xl */}
            <ol className="w-full flex flex-col items-center gap-3 xl:grid xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] xl:items-stretch xl:gap-4 mt-4">
                {STEPS.map((step) => (
                    <li key={step.href} className="contents">
                        <Polaroid
                            tint={step.tint}
                            developDelayMs={step.developDelayMs}
                            photo={step.photo}
                            tape={step.tape}
                            className={`w-[264px] xl:w-full h-full ${step.tilt}`}
                        >
                            <div className="flex flex-1 flex-col items-center gap-2 text-center">
                                {/* Always 2 / 3 lines; min-heights keep all four the same size even if a font renders wider */}
                                <h3 className="min-h-[2lh] text-lg font-semibold text-ink-strong leading-snug tracking-[0.005em]">
                                    <Lines lines={step.title} className="block whitespace-nowrap" />
                                </h3>
                                <p className="w-full min-h-[3lh] text-body-sm text-ink-soft leading-relaxed">
                                    <Lines lines={step.narrow} className="block" />
                                </p>
                                <SectionLink href={step.href}>{step.link}</SectionLink>
                            </div>
                        </Polaroid>
                        {step.connector && (
                            <div aria-hidden="true" className="flex justify-center items-center shrink-0 py-1 xl:py-0">
                                <Image
                                    src={step.connector}
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="rotate-90 xl:rotate-0"
                                />
                            </div>
                        )}
                    </li>
                ))}
            </ol>
        </Section>
    );
}
