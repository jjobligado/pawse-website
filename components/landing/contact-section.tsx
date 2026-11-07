"use client";

import { useEffect, useRef, useState } from "react";
import { usePlatform, type DetectedPlatform } from "@/hooks/use-platform";
import { buildMailto, CONTACT_EMAIL } from "@/lib/site-config";
import { SectionTitle } from "./section-heading";

type ContactTopicId = "general" | "feature" | "bug" | "feedback";

interface ContactTopic {
    id: ContactTopicId;
    label: string;
    /** Shown on the page so people know what makes a useful email. */
    hints: string[];
    /** Pre-filled email body (receives the visitor's detected desktop OS, if any). */
    body: (os: string) => string;
}

const CONTACT_TOPICS: ContactTopic[] = [
    {
        id: "general",
        label: "General Inquiry",
        hints: ["Your question or what's on your mind", "Any context that helps us answer"],
        body: () => "Hi PAWSE team,\n\n",
    },
    {
        id: "feature",
        label: "Feature Request",
        hints: [
            "The feature or companion idea",
            "How it would fit into your focus routine",
        ],
        body: () =>
            "Hi PAWSE team,\n\nI'd love to see:\n\n\nHow it would help my focus routine:\n\n",
    },
    {
        id: "bug",
        label: "Bug Report",
        hints: [
            "What happened, and what you expected",
            "Steps to reproduce it",
            "Your OS and PAWSE version",
        ],
        body: (os) =>
            `Hi PAWSE team,\n\nWhat happened:\n\n\nSteps to reproduce:\n1. \n2. \n3. \n\nWhat I expected:\n\n\nOS: ${os}\nPAWSE version: \n`,
    },
    {
        id: "feedback",
        label: "App Feedback",
        hints: ["What's working well for you", "What could be better"],
        body: () =>
            "Hi PAWSE team,\n\nWhat's working well:\n\n\nWhat could be better:\n\n",
    },
];

const OS_NAMES: Partial<Record<DetectedPlatform, string>> = {
    windows: "Windows",
    mac: "macOS",
    linux: "Linux",
};

export default function ContactSection() {
    const [selectedTopic, setSelectedTopic] = useState<ContactTopicId>("general");
    const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");
    const addressRef = useRef<HTMLSpanElement>(null);
    const { platform } = usePlatform();

    const activeTopic =
        CONTACT_TOPICS.find((t) => t.id === selectedTopic) ?? CONTACT_TOPICS[0];
    const mailtoHref = buildMailto(
        `[PAWSE] ${activeTopic.label}`,
        activeTopic.body(OS_NAMES[platform] ?? "")
    );

    useEffect(() => {
        if (copyState === "idle") return;
        const timer = setTimeout(() => setCopyState("idle"), 2500);
        return () => clearTimeout(timer);
    }, [copyState]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(CONTACT_EMAIL);
            setCopyState("copied");
        } catch {
            // Clipboard blocked: select the address so the visitor can copy it manually.
            const node = addressRef.current;
            const selection = window.getSelection();
            if (node && selection) {
                const range = document.createRange();
                range.selectNodeContents(node);
                selection.removeAllRanges();
                selection.addRange(range);
            }
            setCopyState("manual");
        }
    };

    return (
        <section
            id="contact"
            className="scroll-mt-20 w-full max-w-[1280px] mx-auto py-24 md:py-32 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-6 bg-white"
        >
            <SectionTitle>Contact Us</SectionTitle>

            <div className="px-4 md:px-10 flex justify-center items-center">
                <p className="max-w-[640px] text-base md:text-lg text-muted text-center leading-relaxed">
                    Have a question, spotted a bug, want to suggest a new feature, or
                    share feedback on your experience? Send us an email and we&apos;ll
                    get back to you.
                </p>
            </div>

            <div className="w-full max-w-[580px] mt-2 p-6 sm:p-8 md:p-10 rounded-3xl border-2 border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#F4FAFF_68%,#E3F4FF_100%)] shadow-[0px_12px_32px_-8px_rgba(20,20,20,0.06)] flex flex-col gap-6">
                {/* Topic picker: native radios styled as pills (arrow-key navigation for free) */}
                <fieldset className="flex flex-col items-start gap-2.5">
                    <legend className="mb-2.5 text-sm font-medium text-ink">
                        What can we help you with?
                    </legend>
                    <div className="w-full flex flex-wrap items-center gap-2">
                        {CONTACT_TOPICS.map((topic) => (
                            <label key={topic.id} className="cursor-pointer select-none">
                                <input
                                    type="radio"
                                    name="contact-topic"
                                    value={topic.id}
                                    checked={selectedTopic === topic.id}
                                    onChange={() => setSelectedTopic(topic.id)}
                                    className="peer sr-only"
                                />
                                <span className="inline-flex items-center min-h-9 px-3.5 rounded-full text-[13px] font-medium border whitespace-nowrap transition-colors duration-150 bg-white text-ink-soft border-stroke hover:border-accent hover:text-ink peer-checked:bg-accent peer-checked:text-white peer-checked:border-accent peer-checked:shadow-[0px_4px_12px_0px_rgba(53,166,241,0.28)] peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2">
                                    {topic.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                {/* What to include for the selected topic */}
                <div className="rounded-2xl bg-white/80 border border-stroke px-5 py-4">
                    <p className="text-sm font-medium text-ink">Helpful to include</p>
                    <ul className="mt-2 flex flex-col gap-1.5 text-sm text-ink-soft">
                        {activeTopic.hints.map((hint) => (
                            <li key={hint} className="flex items-start gap-2">
                                <span
                                    aria-hidden="true"
                                    className="mt-[7px] w-1.5 h-1.5 shrink-0 bg-accent"
                                />
                                {hint}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Primary action: opens the visitor's email app, pre-filled */}
                <div className="flex flex-col items-center gap-4">
                    <a
                        href={mailtoHref}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-10 rounded-full bg-accent hover:bg-accent-hover active:bg-accent-active text-white font-pixel text-lg shadow-[0px_4px_18px_0px_rgba(53,166,241,0.28)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <path d="m3 7 9 6 9-6" />
                        </svg>
                        Email us
                    </a>

                    {/* Fallback for webmail users: visible address + copy */}
                    <div className="flex flex-col items-center gap-1.5 text-sm text-muted text-center">
                        <span>Or write to us directly at</span>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <span ref={addressRef} className="font-medium text-ink select-all break-all">
                                {CONTACT_EMAIL}
                            </span>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="inline-flex items-center gap-1 min-h-8 px-3 rounded-full bg-white border border-stroke text-xs font-medium text-ink-soft hover:border-accent hover:text-ink transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                            >
                                {copyState === "copied" ? "Copied!" : "Copy"}
                            </button>
                        </div>
                        <span aria-live="polite" className="min-h-5 text-xs">
                            {copyState === "copied" && "Email address copied to clipboard."}
                            {copyState === "manual" && "Address selected. Press Ctrl+C (⌘C on Mac) to copy."}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
