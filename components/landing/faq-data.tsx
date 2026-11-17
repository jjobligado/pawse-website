import type { ReactNode } from "react";
import { OsIcon } from "./download-options";

export type FaqCategory = "basics" | "setup" | "sessions";
export type FaqFilter = FaqCategory | "all";
export type ContactTopic = "general" | "bug" | "feature";

export interface FaqAction {
    label: string;
    topic: ContactTopic;
}

export interface FaqItem {
    id: string;
    category: FaqCategory;
    question: string;
    /** Plain-text answer mirrored into FAQPage JSON-LD structured data. */
    plain: string;
    answer: ReactNode;
    actions?: readonly FaqAction[];
}

export const FAQ_CATEGORIES: readonly { id: FaqFilter; label: string }[] = [
    { id: "basics", label: "Basics" },
    { id: "setup", label: "Setup" },
    { id: "sessions", label: "Sessions" },
    { id: "all", label: "All" },
];

const PLATFORM_WARNINGS = [
    {
        os: "windows" as const,
        name: "Windows",
        steps: (
            <>
                If you see &ldquo;Windows protected your PC,&rdquo; select{" "}
                <em>More info</em>, then <em>Run anyway</em>.
            </>
        ),
    },
    {
        os: "mac" as const,
        name: "macOS",
        steps: (
            <>
                If PAWSE won&apos;t open, go to{" "}
                <em>System Settings → Privacy &amp; Security</em> and select{" "}
                <em>Open Anyway</em>.
            </>
        ),
    },
    {
        os: "linux" as const,
        name: "Linux",
        steps: (
            <>
                For the AppImage, allow executing in <em>Properties</em> (or{" "}
                <code className="rounded bg-control-track px-1.5 py-0.5 text-xs text-ink">
                    chmod +x
                </code>
                ). On Ubuntu or Debian, install the{" "}
                <code className="rounded bg-control-track px-1.5 py-0.5 text-xs text-ink">
                    .deb
                </code>{" "}
                package directly.
            </>
        ),
    },
] as const;

const PLATFORM_CHIPS = [
    { os: "windows" as const, label: "Windows 10 & 11" },
    { os: "mac" as const, label: "macOS (Apple Silicon & Intel)" },
    { os: "linux" as const, label: "Linux (.AppImage & .deb)" },
] as const;

/*
 * Answers use only product facts confirmed by the team (Nov 2026). Update this
 * list when anything changes (pricing, code signing, accounts, platforms).
 * Keep "plain" aligned with "answer" for search engines.
 */
export const FAQS: readonly FaqItem[] = [
    {
        id: "pomodoro",
        category: "basics",
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
        id: "free",
        category: "basics",
        question: "Is PAWSE free?",
        plain: "Yes. PAWSE is free to download.",
        answer: <>Yes. PAWSE is free to download.</>,
    },
    {
        id: "platforms",
        category: "basics",
        question: "Which platforms does PAWSE support?",
        plain: "PAWSE is available for Windows, macOS, and Linux (.AppImage and .deb).",
        answer: (
            <>
                <p>PAWSE runs natively on Windows, macOS, and Linux desktops.</p>
                <ul className="mt-3 flex flex-wrap gap-2" aria-label="Supported operating systems">
                    {PLATFORM_CHIPS.map((chip) => (
                        <li
                            key={chip.label}
                            className="inline-flex items-center gap-1.5 rounded-chip border border-stroke bg-white px-2.5 py-1 text-xs font-medium text-ink"
                        >
                            <span className="text-[#1A6CA3]">
                                <OsIcon os={chip.os} />
                            </span>
                            <span>{chip.label}</span>
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        id: "install-warning",
        category: "setup",
        question: "Why does my computer show a warning when I install PAWSE?",
        plain: "PAWSE isn't code-signed yet, so your system may show a security warning the first time you open it. Only download PAWSE from the official website. On Windows, select More info, then Run anyway. On macOS, go to System Settings, Privacy & Security, and select Open Anyway. On Linux, make the AppImage executable before opening it, or install the .deb package on Ubuntu or Debian.",
        answer: (
            <>
                <p>
                    PAWSE isn&apos;t code-signed yet, so your system may show a security
                    warning the first time you open it. Only download PAWSE from this
                    website.
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                    {PLATFORM_WARNINGS.map((item) => (
                        <li
                            key={item.os}
                            className="flex items-start gap-3 rounded-control border border-stroke bg-white px-3.5 py-2.5 text-body-sm"
                        >
                            <span
                                aria-hidden="true"
                                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-chip bg-[#EAF5FD] text-[#1A6CA3]"
                            >
                                <OsIcon os={item.os} />
                            </span>
                            <div>
                                <strong className="font-semibold text-ink">
                                    {item.name}:
                                </strong>{" "}
                                {item.steps}
                            </div>
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        id: "account",
        category: "setup",
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
        id: "offline",
        category: "setup",
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
        id: "session-length",
        category: "sessions",
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
        id: "notifications",
        category: "sessions",
        question: "Will PAWSE let me know when a session ends?",
        plain: "Yes. PAWSE plays a sound and shows a notification when a session ends.",
        answer: <>Yes. PAWSE plays a sound and shows a notification when a session ends.</>,
    },
    {
        id: "feedback",
        category: "sessions",
        question: "How do I report a bug or suggest a feature?",
        plain: "Send us a message through the contact form on the PAWSE website and choose Bug or Feature.",
        answer: (
            <>
                Send us a message through the contact form below and pick{" "}
                <em>Bug</em> or <em>Feature</em> so it lands with the right context.
            </>
        ),
        actions: [
            { label: "Report a Bug", topic: "bug" },
            { label: "Suggest a Feature", topic: "feature" },
        ],
    },
];
