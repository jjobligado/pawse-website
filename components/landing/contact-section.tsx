"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { usePlatform, type DetectedPlatform } from "@/hooks/use-platform";
import { isContactFormConfigured, sendContactMessage } from "@/lib/contact";
import { CONTACT_EMAIL } from "@/lib/site-config";
import { SectionTitle } from "./section-heading";

type ContactTopicId = "general" | "feature" | "bug" | "feedback";

interface ContactTopic {
    id: ContactTopicId;
    /** Short pill label (keeps all four pills on one line at every width). */
    pill: string;
    /** Full name used in the email subject and confirmation. */
    label: string;
    placeholder: string;
}

const CONTACT_TOPICS: ContactTopic[] = [
    {
        id: "general",
        pill: "General",
        label: "General Inquiry",
        placeholder: "Tell us what's on your mind...",
    },
    {
        id: "feature",
        pill: "Feature",
        label: "Feature Request",
        placeholder: "What cozy feature or companion idea would you love to see next?",
    },
    {
        id: "bug",
        pill: "Bug",
        label: "Bug Report",
        placeholder:
            "What happened, the steps to reproduce it, and your PAWSE version...",
    },
    {
        id: "feedback",
        pill: "Feedback",
        label: "App Feedback",
        placeholder:
            "Tell us what's working well for your focus routine (and what could be better)...",
    },
];

const OS_NAMES: Partial<Record<DetectedPlatform, string>> = {
    windows: "Windows",
    mac: "macOS",
    linux: "Linux",
};

const INPUT_CLASSES =
    "rounded-xl bg-white border-2 border-stroke text-sm md:text-base text-ink placeholder:text-faint transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[0_0_0_4px_rgba(168,220,255,0.4)] disabled:opacity-60";

type Status = { state: "idle" | "sending" | "sent" } | { state: "error"; reason: string };

export default function ContactSection() {
    const [selectedTopic, setSelectedTopic] = useState<ContactTopicId>("general");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [botcheck, setBotcheck] = useState(false);
    const [status, setStatus] = useState<Status>({ state: "idle" });
    const { platform } = usePlatform();

    const activeTopic =
        CONTACT_TOPICS.find((t) => t.id === selectedTopic) ?? CONTACT_TOPICS[0];
    const isSending = status.state === "sending";

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSending) return;

        setStatus({ state: "sending" });
        const result = await sendContactMessage({
            topic: activeTopic.label,
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            os: OS_NAMES[platform] ?? "",
            botcheck,
        });
        setStatus(result.ok ? { state: "sent" } : { state: "error", reason: result.reason });
    };

    const handleReset = () => {
        setName("");
        setEmail("");
        setMessage("");
        setStatus({ state: "idle" });
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
                    share feedback on your experience? Drop us a message below and
                    we&apos;ll get back to you.
                </p>
            </div>

            <div className="w-full max-w-[580px] mt-2 p-5 sm:p-8 md:p-10 rounded-3xl border-2 border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#F4FAFF_68%,#E3F4FF_100%)] shadow-[0px_12px_32px_-8px_rgba(20,20,20,0.06)]">
                {status.state === "sent" ? (
                    <div className="py-8 px-4 flex flex-col items-center text-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-[0px_6px_18px_0px_rgba(53,166,241,0.35)]">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>

                        <h3 className="font-pixel text-2xl md:text-3xl font-semibold text-ink">
                            Message Sent!
                        </h3>

                        <p
                            role="status"
                            className="max-w-[440px] text-sm sm:text-base text-muted leading-relaxed"
                        >
                            Thanks for reaching out{name ? `, ${name}` : ""}! We&apos;ve
                            received your{" "}
                            <span className="font-medium text-ink">
                                {activeTopic.label.toLowerCase()}
                            </span>{" "}
                            and will reply to{" "}
                            <span className="font-medium text-ink break-all">{email}</span>.
                        </p>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="mt-2 py-2.5 px-6 rounded-full bg-white border-2 border-stroke hover:border-accent text-sm font-medium text-ink transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                        {/* Topic pills: native radios (arrow-key navigation), one line at every width */}
                        <fieldset disabled={isSending} className="min-w-0">
                            <legend className="mb-2.5 text-sm font-medium text-ink">
                                What can we help you with?
                            </legend>
                            <div className="w-full grid grid-cols-4 gap-1 sm:gap-2">
                                {CONTACT_TOPICS.map((topic) => (
                                    <label key={topic.id} className="min-w-0 cursor-pointer select-none">
                                        <input
                                            type="radio"
                                            name="contact-topic"
                                            value={topic.id}
                                            checked={selectedTopic === topic.id}
                                            onChange={() => setSelectedTopic(topic.id)}
                                            className="peer sr-only"
                                        />
                                        <span className="flex w-full items-center justify-center min-h-9 px-1 sm:px-3 rounded-full text-xs sm:text-[13px] font-medium border whitespace-nowrap transition-colors duration-150 bg-white text-ink-soft border-stroke hover:border-accent hover:text-ink peer-checked:bg-accent peer-checked:text-white peer-checked:border-accent peer-checked:shadow-[0px_4px_12px_0px_rgba(53,166,241,0.28)] peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2">
                                            {topic.pill}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        {/* Name (optional) */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="contact-name" className="text-sm font-medium text-ink">
                                    Name
                                </label>
                                <span className="text-xs text-subtle">Optional</span>
                            </div>
                            <input
                                id="contact-name"
                                type="text"
                                name="name"
                                autoComplete="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                maxLength={100}
                                disabled={isSending}
                                className={`h-[46px] px-4 ${INPUT_CLASSES}`}
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="contact-email" className="text-sm font-medium text-ink">
                                Email
                            </label>
                            <input
                                id="contact-email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                maxLength={254}
                                disabled={isSending}
                                className={`h-[46px] px-4 ${INPUT_CLASSES}`}
                            />
                        </div>

                        {/* Message */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="contact-message" className="text-sm font-medium text-ink">
                                Message
                            </label>
                            <textarea
                                id="contact-message"
                                name="message"
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={activeTopic.placeholder}
                                required
                                maxLength={5000}
                                disabled={isSending}
                                className={`p-4 resize-y ${INPUT_CLASSES}`}
                            />
                        </div>

                        {/* Honeypot: hidden from people and assistive tech; bots tend to tick it */}
                        <input
                            type="checkbox"
                            name="botcheck"
                            checked={botcheck}
                            onChange={(e) => setBotcheck(e.target.checked)}
                            tabIndex={-1}
                            aria-hidden="true"
                            className="hidden"
                        />

                        {/* Errors and unconfigured state, always with the email fallback */}
                        {(status.state === "error" || !isContactFormConfigured) && (
                            <p
                                role="alert"
                                className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B] leading-relaxed"
                            >
                                {status.state === "error"
                                    ? status.reason
                                    : "The contact form is offline right now."}{" "}
                                Please email us at{" "}
                                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium underline">
                                    {CONTACT_EMAIL}
                                </a>{" "}
                                instead.
                            </p>
                        )}

                        <div className="pt-2 flex justify-center">
                            <button
                                type="submit"
                                disabled={isSending || !isContactFormConfigured}
                                aria-busy={isSending}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-10 rounded-full bg-accent hover:bg-accent-hover active:bg-accent-active text-white font-pixel text-lg shadow-[0px_4px_18px_0px_rgba(53,166,241,0.28)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-accent"
                            >
                                {isSending && (
                                    <span
                                        aria-hidden="true"
                                        className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"
                                    />
                                )}
                                {isSending ? "Sending..." : "Send Message"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <EmailFallback />
        </section>
    );
}

/** "Prefer email?" row: the address as text, plus a copy button for webmail users. */
function EmailFallback() {
    const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");
    const addressRef = useRef<HTMLSpanElement>(null);

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
        <div className="flex flex-col items-center gap-1.5 text-sm text-muted text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5">
                <span>Prefer email?</span>
                <span ref={addressRef} className="font-medium text-ink select-all break-all">
                    {CONTACT_EMAIL}
                </span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center min-h-8 px-3 rounded-full bg-white border border-stroke text-xs font-medium text-ink-soft hover:border-accent hover:text-ink transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                    {copyState === "copied" ? "Copied!" : "Copy"}
                </button>
            </div>
            <span aria-live="polite" className="min-h-5 text-xs">
                {copyState === "copied" && "Email address copied to clipboard."}
                {copyState === "manual" && "Address selected. Press Ctrl+C (⌘C on Mac) to copy."}
            </span>
        </div>
    );
}
