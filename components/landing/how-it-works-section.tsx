import Image from "next/image";
import StickyNote, { type PushPinColor, type StickyNoteColor } from "./sticky-note";
import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";

/**
 * The PAWSE loop as four sticky notes pinned to a desk workspace mat.
 * The notes capture the moment at a glance without spoiling the full app
 * previews below, and each note ends with a quiet pill link to its section.
 *
 * Layout stays clear at every width: a single vertical flow on phones
 * (connectors point down), a balanced 2×2 desk board on tablets (read by
 * step stamp 01–04), and a four-note horizontal flow from xl (connectors
 * point across). Fixed line counts keep all four notes equal in height.
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
const STICKER_STAGE = "flex items-end justify-center w-full h-24";

type ConnectorKind = "arrow" | "cycle";

const STEPS: {
    step: string;
    title: string[];
    narrow: string[];
    href: string;
    link: string;
    color: StickyNoteColor;
    pin: PushPinColor;
    tilt: string;
    sticker: React.ReactNode;
    connector?: ConnectorKind;
}[] = [
    {
        step: "01",
        title: ["Pick Your", "Companion"],
        narrow: ["Three cats, three paces.", "Pick who focuses", "with you."],
        href: "#companions",
        link: "Meet the cats",
        color: "yellow",
        pin: "coral",
        tilt: "xl:-rotate-[1.4deg] xl:motion-safe:hover:rotate-0 max-xl:motion-safe:hover:-rotate-[1.4deg]",
        sticker: (
            <div className={STICKER_STAGE}>
                <div className="flex items-end -space-x-3">
                    <Frame src={`${SPRITES}/ginger-body-idle-sheet.png`} frames={5} frame={0} className={GROUP_CAT} />
                    <Frame src={`${SPRITES}/tux-body-idle-sheet.png`} frames={4} frame={0} className={GROUP_CAT} />
                    <Frame src={`${SPRITES}/void-body-idle-sheet.png`} frames={5} frame={0} className={GROUP_CAT} />
                </div>
            </div>
        ),
        connector: "arrow",
    },
    {
        step: "02",
        title: ["Focus with Your", "Companion"],
        narrow: ["Work alongside your", "cat's routine. Zero", "distractions."],
        href: "#focus",
        link: "See Focus",
        color: "sky",
        pin: "blue",
        tilt: "xl:rotate-[0.9deg] xl:motion-safe:hover:rotate-0 max-xl:motion-safe:hover:rotate-[1.4deg]",
        sticker: (
            <div className={STICKER_STAGE}>
                <Frame src={`${SPRITES}/tux-body-focus-sheet.png`} frames={5} frame={3} className={CAT} />
            </div>
        ),
        connector: "cycle",
    },
    {
        step: "03",
        title: ["Time to Play", "and Recharge"],
        narrow: ["Take a breather, play,", "and see what they", "have to say."],
        href: "#break",
        link: "See Break",
        color: "mint",
        pin: "sage",
        tilt: "xl:-rotate-[0.8deg] xl:motion-safe:hover:rotate-0 max-xl:motion-safe:hover:-rotate-[1.4deg]",
        sticker: (
            <div className={STICKER_STAGE}>
                <Frame src={`${SPRITES}/ginger-body-break-sheet.png`} frames={9} frame={8} className={CAT} />
            </div>
        ),
        connector: "arrow",
    },
    {
        step: "04",
        title: ["Watch Your", "Progress Build"],
        narrow: ["Every session gets", "logged. Small sessions,", "big streaks."],
        href: "#progress",
        link: "See Progress",
        color: "lavender",
        pin: "amber",
        tilt: "xl:rotate-[1.2deg] xl:motion-safe:hover:rotate-0 max-xl:motion-safe:hover:rotate-[1.4deg]",
        sticker: (
            <div className="flex items-center justify-center w-full h-24">
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

/** Hand-sketched desk-mat arrow connecting adjacent sticky notes on linear layouts (phones and xl+). */
function StepConnector({ kind }: { kind: ConnectorKind }) {
    return (
        <div aria-hidden="true" className="flex md:hidden xl:flex justify-center items-center shrink-0 py-1 xl:py-0 text-ink/55">
            {kind === "arrow" ? (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="rotate-90 xl:rotate-0"
                >
                    <path d="M4 13c4.5-1.6 10-1.6 15.5-.2" />
                    <path d="M14.5 8.5 20 12.8l-5 4.2" />
                </svg>
            ) : (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="rotate-90 xl:rotate-0"
                >
                    <path d="M20 11a8 8 0 0 0-14.5-4.4L3 9" />
                    <path d="M3 4v5h5" />
                    <path d="M4 13a8 8 0 0 0 14.5 4.4L21 15" />
                    <path d="M21 20v-5h-5" />
                </svg>
            )}
        </div>
    );
}

/**
 * Crisp white pill link anchored at the foot of each sticky note so it reads
 * cleanly across all four paper colors.
 */
function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            className="group/link mt-auto inline-flex items-center gap-2 rounded-full pl-3.5 pr-1 py-1 text-sm font-medium text-ink bg-white/95 ring-1 ring-ink/12 shadow-[0_1px_2px_rgb(20_20_20/0.07)] transition-[background-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white hover:ring-ink/25 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
        >
            {children}
            <span
                aria-hidden="true"
                className="w-6 h-6 rounded-full bg-ink/[0.06] text-ink flex items-center justify-center transition-[background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/link:bg-ink/[0.11] group-active/link:bg-ink/[0.16]"
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

            {/* Desk workspace dot-grid mat holding the pinned sticky-note flow */}
            <div
                className="relative w-full mt-4 rounded-card-lg border border-[#EAE4D8] bg-[#FAF8F4] px-5 py-9 sm:px-8 sm:py-11 xl:px-7 xl:py-12 shadow-[inset_0_1px_0_rgb(255_255_255/0.85),0_1px_3px_rgb(20_20_20/0.04)]"
                style={{
                    backgroundImage: "radial-gradient(circle, rgb(35 35 35 / 0.085) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                }}
            >
                {/* Vertical flow on phones → 2×2 board on tablets → four-note row from xl */}
                <ol className="w-full flex flex-col items-center gap-4 md:grid md:grid-cols-2 md:gap-8 md:max-w-[620px] md:mx-auto xl:max-w-none xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] xl:items-stretch xl:gap-3">
                    {STEPS.map((step) => (
                        <li key={step.href} className="contents">
                            <StickyNote
                                step={step.step}
                                color={step.color}
                                pinColor={step.pin}
                                sticker={step.sticker}
                                className={`w-[272px] sm:w-[292px] md:w-full h-full ${step.tilt}`}
                            >
                                <div className="flex flex-1 flex-col items-center gap-2 text-center">
                                    {/* Always 2 / 3 lines; min-heights keep all four the same size even if a font renders wider */}
                                    <h3 className="min-h-[2lh] text-lg font-semibold text-ink-strong leading-snug tracking-[0.005em]">
                                        <Lines lines={step.title} className="block whitespace-nowrap" />
                                    </h3>
                                    <p className="w-full min-h-[3lh] text-body-sm text-ink/80 leading-relaxed">
                                        <Lines lines={step.narrow} className="block" />
                                    </p>
                                    <SectionLink href={step.href}>{step.link}</SectionLink>
                                </div>
                            </StickyNote>
                            {step.connector && <StepConnector kind={step.connector} />}
                        </li>
                    ))}
                </ol>
            </div>
        </Section>
    );
}
