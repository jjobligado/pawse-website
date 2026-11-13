import type { ReactNode } from "react";
import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";

/*
 * Answers use only product facts confirmed by the team (Nov 2026). Update this
 * list when anything changes (pricing, code signing, accounts, platforms).
 * "plain" is the text-only answer for search engines; keep it in sync with "answer".
 */
/** Exported for the FAQPage structured data (components/landing/structured-data.tsx). */
export const FAQS: { question: string; plain: string; answer: ReactNode }[] = [
    {
        question: "What is the Pomodoro Technique?",
        plain: "It's a simple way to work: focus for a set amount of time, then take a short break, and repeat. PAWSE times each round for you and gives you a companion to focus with.",
        answer: (
            <>
                It&apos;s a simple way to work: focus for a set amount of time, then take
                a short break, and repeat. PAWSE times each round for you and gives you a
                companion to focus with.
            </>
        ),
    },
    {
        question: "Is PAWSE free?",
        plain: "Yes. PAWSE is free to download.",
        answer: <>Yes. PAWSE is free to download.</>,
    },
    {
        question: "Which platforms does PAWSE support?",
        plain: "PAWSE is available for Windows, macOS, and Linux.",
        answer: <>PAWSE is available for Windows, macOS, and Linux.</>,
    },
    {
        question: "Do I need an account?",
        plain: "No. Download it, open it, and start a session. Optional profiles for backing up your progress are coming soon.",
        answer: (
            <>
                No. Download it, open it, and start a session. Optional profiles for
                backing up your progress are coming soon.
            </>
        ),
    },
    {
        question: "Does PAWSE work offline? Where is my data stored?",
        plain: "Yes, PAWSE works offline. Your sessions and stats are stored locally on your device.",
        answer: (
            <>
                Yes, PAWSE works offline. Your sessions and stats are stored locally on
                your device.
            </>
        ),
    },
    {
        question: "Why does my computer show a warning when I install PAWSE?",
        plain: "PAWSE isn't code-signed yet, so your system may show a security warning the first time you open it. Only download PAWSE from the official website. On Windows, select More info, then Run anyway. On macOS, go to System Settings, Privacy & Security, and select Open Anyway. On Linux, make the AppImage executable, then open it.",
        answer: (
            <>
                <p>
                    PAWSE isn&apos;t code-signed yet, so your system may show a security
                    warning the first time you open it. Only download PAWSE from this
                    website.
                </p>
                <ul className="mt-3 flex flex-col gap-2 list-disc pl-5 marker:text-accent">
                    <li>
                        <strong className="font-semibold text-ink">Windows:</strong> if you
                        see &ldquo;Windows protected your PC,&rdquo; select{" "}
                        <em>More info</em>, then <em>Run anyway</em>.
                    </li>
                    <li>
                        <strong className="font-semibold text-ink">macOS:</strong> if PAWSE
                        won&apos;t open, go to <em>System Settings → Privacy &amp; Security</em>{" "}
                        and select <em>Open Anyway</em>.
                    </li>
                    <li>
                        <strong className="font-semibold text-ink">Linux:</strong> make the
                        AppImage executable (right-click → <em>Properties</em> → allow
                        executing), then open it.
                    </li>
                </ul>
            </>
        ),
    },
    {
        question: "Can I change the session length?",
        plain: "Each companion has its own pace: Ginger runs 15-minute sessions, Tux 25, and Void 50. Custom focus and break durations are coming soon.",
        answer: (
            <>
                Each companion has its own pace: Ginger runs 15-minute sessions, Tux 25,
                and Void 50. Custom focus and break durations are coming soon.
            </>
        ),
    },
    {
        question: "Will PAWSE let me know when a session ends?",
        plain: "Yes. PAWSE plays a sound and shows a notification when a session ends.",
        answer: <>Yes. PAWSE plays a sound and shows a notification when a session ends.</>,
    },
    {
        question: "How do I report a bug or suggest a feature?",
        plain: "Send us a message through the contact form on the PAWSE website and choose Bug or Feature.",
        answer: (
            <>
                Send us a message through the{" "}
                <a
                    href="#contact"
                    className="font-medium text-ink link-underline"
                >
                    contact form
                </a>{" "}
                and choose <em>Bug</em> or <em>Feature</em>.
            </>
        ),
    },
];

export default function FaqSection() {
    return (
        <Section id="faq" className="flex flex-col items-center gap-6">
            <SectionTitle>Frequently Asked Questions</SectionTitle>
            <SectionSubtitle className="text-center text-balance">
                Everything you need to know before you download.
            </SectionSubtitle>

            <div className="w-full max-w-[760px] mt-2 rounded-card-lg border-2 border-stroke bg-white px-5 sm:px-8 divide-y divide-stroke">
                {FAQS.map((faq) => (
                    <details key={faq.question} className="group py-1">
                        <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden rounded-chip focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
                            <span className="text-base md:text-label font-medium text-ink-strong leading-snug">
                                {faq.question}
                            </span>
                            {/* Plus that turns into a minus when open */}
                            <span
                                aria-hidden="true"
                                className="relative w-7 h-7 shrink-0 rounded-full bg-control-track group-hover:bg-accent-highlight/60 transition-colors duration-150"
                            >
                                <span className="absolute left-1/2 top-1/2 w-3 h-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
                                <span className="absolute left-1/2 top-1/2 w-0.5 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink transition-transform duration-200 group-open:scale-y-0" />
                            </span>
                        </summary>
                        <div className="pb-5 pr-11 text-body-sm md:text-base text-muted leading-relaxed">
                            {faq.answer}
                        </div>
                    </details>
                ))}
            </div>
        </Section>
    );
}
