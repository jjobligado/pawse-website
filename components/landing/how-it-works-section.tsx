import StickyNote, { type StickyNoteColor } from "./sticky-note";
import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";

/**
 * The PAWSE loop as four sticky notes on a top-down felt desk mat: the camera
 * tilts down from the hero's window to the desk. Around the notes sit a few
 * smooth-drawn props (mug, pencil, paperclip, the hero laptop's corner) and
 * handwritten notes, half of them crossed-out distractions. Everything except
 * the four step notes is decorative and hidden from assistive tech.
 */

type ConnectorKind = "arrow" | "cycle";

const STEPS: {
    step: string;
    title: string[];
    narrow: string[];
    href: string;
    link: string;
    color: StickyNoteColor;
    pose: string;
    connector?: ConnectorKind;
}[] = [
    {
        step: "01",
        title: ["Pick Your", "Companion"],
        narrow: ["Three cats, three paces.", "Pick who focuses", "with you."],
        href: "#companions",
        link: "Meet the cats",
        color: "yellow",
        pose: "md:-rotate-[1.5deg] xl:-translate-y-2 xl:-rotate-[2.2deg] md:motion-safe:hover:rotate-0 max-md:motion-safe:hover:-rotate-[1.5deg]",
        connector: "arrow",
    },
    {
        step: "02",
        title: ["Focus with Your", "Companion"],
        narrow: ["Work alongside your", "cat's routine. Zero", "distractions."],
        href: "#focus",
        link: "See Focus",
        color: "sky",
        pose: "md:rotate-[1.2deg] xl:translate-y-2.5 xl:rotate-[1.6deg] md:motion-safe:hover:rotate-0 max-md:motion-safe:hover:rotate-[1.5deg]",
        connector: "cycle",
    },
    {
        step: "03",
        title: ["Time to Play", "and Recharge"],
        narrow: ["Take a breather, play,", "and see what they", "have to say."],
        href: "#break",
        link: "See Break",
        color: "mint",
        pose: "md:-rotate-[1deg] xl:-translate-y-1.5 xl:-rotate-[1.5deg] md:motion-safe:hover:rotate-0 max-md:motion-safe:hover:-rotate-[1.5deg]",
        connector: "arrow",
    },
    {
        step: "04",
        title: ["Watch Your", "Progress Build"],
        narrow: ["Every session gets", "logged. Small sessions,", "big streaks."],
        href: "#progress",
        link: "See Progress",
        color: "lavender",
        pose: "md:rotate-[1.4deg] xl:translate-y-2 xl:rotate-[2deg] md:motion-safe:hover:rotate-0 max-md:motion-safe:hover:rotate-[1.5deg]",
    },
];

/**
 * Handwritten desk notes in the mat's top and bottom bands. Positions are per
 * breakpoint: 4 on phones (corners), 5 on tablets, 7 from xl.
 */
const DESK_NOTES: { content: React.ReactNode; color: string; className: string }[] = [
    {
        content: "drink water!",
        color: "bg-[#FFE3EC]",
        className: "top-4 left-3 -rotate-[7deg] md:top-6 md:left-[6%] xl:top-8 xl:left-[7%]",
    },
    {
        content: <s>37 open tabs</s>,
        color: "bg-[#FFF7CC]",
        className: "hidden xl:block xl:top-5 xl:left-[22%] rotate-[5deg]",
    },
    {
        content: <s>check email</s>,
        color: "bg-[#FFE7D1]",
        className: "top-5 right-4 rotate-[6deg] md:right-auto md:top-5 md:left-[40%] xl:top-9 xl:left-[38%] xl:-rotate-[4deg]",
    },
    {
        content: (
            <span className="flex h-full flex-col items-center justify-center font-pixel text-[22px] xl:text-[26px] font-medium text-ink/75">
                25:00
                <span className="text-[13px] xl:text-[15px] text-ink/55">then 5:00</span>
            </span>
        ),
        color: "bg-[#E3F3FF]",
        className: "hidden md:block md:top-7 md:right-[6%] -rotate-[4deg] xl:right-auto xl:top-6 xl:left-[54%] xl:rotate-[3deg]",
    },
    {
        content: "Tux needs a coffee refill",
        color: "bg-[#E5F9E2]",
        className: "bottom-5 left-4 rotate-[5deg] md:bottom-7 md:left-[6%] xl:bottom-10 xl:left-[17%]",
    },
    {
        content: (
            <>
                <s>doomscroll</s>
                <br />
                nope.
            </>
        ),
        color: "bg-[#FFE7D1]",
        className: "bottom-4 right-3 -rotate-[6deg] md:hidden xl:block xl:right-auto xl:bottom-8 xl:left-[42%] xl:-rotate-[5deg]",
    },
    {
        content: (
            <>
                streak:
                <br />
                <span className="text-[1.45em] font-bold">day 12</span>
            </>
        ),
        color: "bg-[#F2E7FF]",
        className: "hidden md:block md:bottom-6 md:right-[6%] rotate-[8deg] xl:bottom-12 xl:right-[4%]",
    },
];

/** Smooth-drawn desk props. Purely decorative; tablet and up only. */
function DeskProps() {
    return (
        <>
            {/* Corner of the hero's laptop, seen from above */}
            <div className="hidden md:block absolute -top-[90px] -right-[120px] w-[380px] h-[240px] rounded-[22px] bg-[#CDD3D9] -rotate-[14deg] shadow-[0_14px_30px_-12px_rgb(20_20_20/0.25)] md:scale-75 md:origin-top-right xl:scale-100">
                <div className="absolute left-[30px] right-[30px] bottom-6 h-[150px] rounded-[10px] bg-[#BFC6CD]" />
            </div>

            {/* Coffee ring and paperclip */}
            <div className="hidden xl:block absolute top-6 left-[69%] w-24 h-24 rounded-full border-[2.5px] border-[#8C6239]/[0.2]" />
            <svg className="hidden xl:block absolute top-14 left-[66%] rotate-[30deg]" width="22" height="60" viewBox="0 0 22 60" fill="none" stroke="#9AA3AD" strokeWidth="2.4" strokeLinecap="round">
                <path d="M16 18V46a7 7 0 0 1-14 0V10a5 5 0 0 1 10 0v34a2 2 0 0 1-4 0V18" />
            </svg>

            {/* Mug of coffee, top-down */}
            <div className="hidden md:flex absolute md:bottom-8 md:left-[30%] xl:bottom-11 xl:left-[3%] w-24 h-24 xl:w-[104px] xl:h-[104px] items-center justify-center rounded-full bg-white shadow-[0_10px_18px_-8px_rgb(20_20_20/0.25),0_0_0_1px_rgb(0_0_0/0.04)]">
                <div className="w-[72%] h-[72%] rounded-full bg-[#7A5338] shadow-[inset_0_3px_6px_rgb(0_0_0/0.25)]" />
                <div className="absolute -right-[24px] top-[36%] w-[30px] h-[26px] rounded-r-[14px] border-[7px] border-l-0 border-white" />
            </div>

            {/* Pencil */}
            <div className="hidden xl:flex absolute bottom-16 left-[59%] w-[240px] h-3.5 -rotate-[12deg] drop-shadow-[0_4px_4px_rgb(20_20_20/0.15)]">
                <div className="w-5 rounded-l-[3px] bg-[#F4A6B8]" />
                <div className="w-2.5 bg-[#C9CED3]" />
                <div className="flex-1 bg-[#FFCF4A] shadow-[inset_0_-4px_0_rgb(0_0_0/0.06)]" />
                <div className="w-0 h-0 border-y-[7px] border-y-transparent border-l-[24px] border-l-[#EBCB9E]" />
            </div>
        </>
    );
}

/** Hand-drawn connector between adjacent step notes (the cycle marks the focus ↔ break loop). */
function StepConnector({ kind }: { kind: ConnectorKind }) {
    return (
        <div aria-hidden="true" className="relative z-10 flex md:hidden xl:flex justify-center items-center shrink-0 py-0.5 xl:py-0 text-ink/40">
            {kind === "arrow" ? (
                <svg
                    width="22"
                    height="22"
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
                    width="22"
                    height="22"
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

/** Crisp translucent pill link anchored at the foot of each sticky note. */
function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            className="group/link mt-auto inline-flex w-fit items-center gap-2 rounded-full pl-3 pr-1 py-1 text-[13px] font-medium text-ink bg-white/80 ring-1 ring-black/[0.07] shadow-[0_1px_2px_rgb(20_20_20/0.06)] transition-[background-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white hover:ring-black/15 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
        >
            {children}
            <span
                aria-hidden="true"
                className="w-5 h-5 rounded-full bg-ink/[0.07] text-ink flex items-center justify-center transition-[background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/link:bg-ink/[0.12] group-active/link:bg-ink/[0.17]"
            >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

            {/* Top-down felt desk mat with a stitched edge */}
            <div className="relative w-full mt-4 overflow-hidden rounded-[28px] felt px-5 pt-28 pb-32 sm:px-8 md:pt-36 md:pb-40 xl:px-8 xl:pt-[160px] xl:pb-[190px] shadow-[inset_0_2px_0_rgb(255_255_255/0.7),inset_0_-1px_0_rgb(20_20_20/0.04),0_1px_3px_rgb(20_20_20/0.05)]">
                <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[20px] border-2 border-dashed border-[rgb(70_105_140/0.28)]" />

                {/* Props and handwritten desk notes, behind the step notes */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 select-none">
                    <DeskProps />
                    {DESK_NOTES.map((note, idx) => (
                        <div
                            key={idx}
                            className={`absolute w-24 h-24 md:w-28 md:h-28 xl:w-32 xl:h-32 p-3 xl:p-3.5 rounded-[2px] font-hand text-[19px] md:text-[21px] xl:text-[23px] font-medium leading-[1.05] text-ink/80 shadow-[0_1px_2px_rgb(20_20_20/0.05),0_6px_14px_-6px_rgb(20_20_20/0.12)] [&_s]:decoration-2 [&_s]:decoration-accent-strong/70 [&_s]:text-ink/55 ${note.color} ${note.className}`}
                        >
                            {note.content}
                        </div>
                    ))}
                </div>

                {/* Vertical flow on phones → 2×2 board on tablets → staggered 4-note row from xl */}
                <ol className="relative z-10 w-full flex flex-col items-center gap-4 md:grid md:grid-cols-2 md:gap-8 md:max-w-[560px] md:mx-auto xl:max-w-none xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] xl:items-center xl:gap-3">
                    {STEPS.map((step) => (
                        <li key={step.href} className="contents">
                            <StickyNote
                                step={step.step}
                                color={step.color}
                                className={`w-[244px] sm:w-[256px] md:w-full ${step.pose}`}
                            >
                                <div className="flex flex-1 flex-col gap-2">
                                    <h3 className="min-h-[2lh] text-[17px] font-semibold text-ink-strong leading-snug tracking-[-0.005em]">
                                        <Lines lines={step.title} className="block whitespace-nowrap" />
                                    </h3>
                                    <p className="w-full min-h-[3lh] text-[13.5px] sm:text-body-sm text-ink/85 leading-[1.48]">
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
