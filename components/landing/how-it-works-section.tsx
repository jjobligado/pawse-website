import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";

/**
 * Compact overview of the PAWSE loop. Each step links to the section that
 * explains it, so the strip doubles as in-page navigation (useful on mobile,
 * where the header has no nav links).
 */
const STEPS = [
    { title: "Pick Your Companion", body: "Three cats, three paces.", href: "#companions" },
    { title: "Focus Together", body: "Quiet, distraction-free sessions.", href: "#focus" },
    { title: "Take a Playful Break", body: "Recharge, then go again.", href: "#break" },
    { title: "Watch Progress Build", body: "Every session gets logged.", href: "#progress" },
];

export default function HowItWorksSection() {
    return (
        <Section id="how-it-works">
            <SectionTitle>How It Works</SectionTitle>
            <SectionSubtitle className="text-center text-balance">
                From choosing your companion to seeing your progress grow.
            </SectionSubtitle>

            <ol className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                {STEPS.map((step, index) => (
                    <li key={step.href}>
                        <a
                            href={step.href}
                            className="group h-full flex items-center gap-3.5 rounded-2xl border-2 border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF8FF_100%)] px-4 py-4 transition-[border-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_10px_24px_-8px_rgba(20,20,20,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                        >
                            <span
                                aria-hidden="true"
                                className="w-8 h-8 shrink-0 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-ink"
                            >
                                {index + 1}
                            </span>
                            <span className="flex-1 min-w-0 flex flex-col">
                                <span className="text-[15px] font-semibold text-ink-strong leading-snug">
                                    {step.title}
                                </span>
                                <span className="text-sm text-ink-soft leading-snug">
                                    {step.body}
                                </span>
                            </span>
                            {/* Down arrow: signals "jumps to a section below" */}
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                                className="shrink-0 text-muted transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-ink"
                            >
                                <path d="M12 5v14M19 12l-7 7-7-7" />
                            </svg>
                        </a>
                    </li>
                ))}
            </ol>
        </Section>
    );
}
