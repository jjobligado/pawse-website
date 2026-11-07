"use client";

import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { usePlatform, type DetectedPlatform } from "@/hooks/use-platform";
import { isContactFormConfigured, sendContactMessage } from "@/lib/contact";
import { CONTACT_EMAIL } from "@/lib/site-config";
import { SectionTitle } from "./section-heading";

type ContactTopicId = "general" | "feature" | "bug" | "feedback";

interface ContactTopic {
    id: ContactTopicId;
    /** Short segment label (keeps all four on one line at every width). */
    short: string;
    /** Full name used in the email subject and confirmation. */
    label: string;
    placeholder: string;
}

const CONTACT_TOPICS: ContactTopic[] = [
    {
        id: "general",
        short: "General",
        label: "General Inquiry",
        placeholder: "How can we help?",
    },
    {
        id: "feature",
        short: "Feature",
        label: "Feature Request",
        placeholder: "What would you like to see, and how would it help your focus routine?",
    },
    {
        id: "bug",
        short: "Bug",
        label: "Bug Report",
        placeholder: "What happened, how to reproduce it, and your PAWSE version.",
    },
    {
        id: "feedback",
        short: "Feedback",
        label: "App Feedback",
        placeholder: "What's working well, and what could be better?",
    },
];

const OS_NAMES: Partial<Record<DetectedPlatform, string>> = {
    windows: "Windows",
    mac: "macOS",
    linux: "Linux",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;

type FieldErrors = Partial<Record<"email" | "message", string>>;

function validate(email: string, message: string): FieldErrors {
    const errors: FieldErrors = {};
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedEmail) errors.email = "Enter your email so we can reply.";
    else if (!EMAIL_PATTERN.test(trimmedEmail))
        errors.email = "Enter a valid email address, like name@example.com.";

    if (!trimmedMessage) errors.message = "Write a message before sending.";
    else if (trimmedMessage.length < MIN_MESSAGE_LENGTH)
        errors.message = `Add a bit more detail (at least ${MIN_MESSAGE_LENGTH} characters).`;

    return errors;
}

const INPUT_CLASSES =
    "w-full rounded-xl bg-white border border-stroke text-[15px] text-ink placeholder:text-faint transition-[border-color,box-shadow] duration-150 hover:border-stroke-strong focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent-highlight/40 aria-invalid:border-danger aria-invalid:focus:ring-danger/15 disabled:opacity-60 disabled:cursor-not-allowed";

type Status = { state: "idle" | "sending" | "sent" } | { state: "error"; reason: string };

export default function ContactSection() {
    const [selectedTopic, setSelectedTopic] = useState<ContactTopicId>("general");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [botcheck, setBotcheck] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
    const [status, setStatus] = useState<Status>({ state: "idle" });

    const emailRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const successHeadingRef = useRef<HTMLHeadingElement>(null);
    const { platform } = usePlatform();

    const activeTopic =
        CONTACT_TOPICS.find((t) => t.id === selectedTopic) ?? CONTACT_TOPICS[0];
    const isSending = status.state === "sending";

    // Move focus to the confirmation so screen readers announce it and keyboard users aren't lost.
    useEffect(() => {
        if (status.state === "sent") successHeadingRef.current?.focus();
    }, [status.state]);

    // After the first submit attempt, errors update live as the visitor fixes each field.
    const updateEmail = (value: string) => {
        setEmail(value);
        if (hasTriedSubmit) setErrors((prev) => ({ ...prev, email: validate(value, message).email }));
    };
    const updateMessage = (value: string) => {
        setMessage(value);
        if (hasTriedSubmit) setErrors((prev) => ({ ...prev, message: validate(email, value).message }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSending) return;

        setHasTriedSubmit(true);
        const nextErrors = validate(email, message);
        setErrors(nextErrors);
        if (nextErrors.email) return emailRef.current?.focus();
        if (nextErrors.message) return messageRef.current?.focus();

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
        setErrors({});
        setHasTriedSubmit(false);
        setStatus({ state: "idle" });
    };

    return (
        <section
            id="contact"
            className="scroll-mt-20 w-full max-w-[1280px] mx-auto py-24 md:py-32 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-6 bg-white"
        >
            <SectionTitle>Contact Us</SectionTitle>

            <p className="max-w-[560px] px-4 text-base md:text-lg text-muted text-center leading-relaxed">
                Questions, ideas, or something not working? Send us a message and
                we&apos;ll get back to you.
            </p>

            <div className="w-full max-w-[600px] mt-2 p-5 sm:p-8 rounded-3xl border-2 border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_55%,#F2F9FF_100%)] shadow-[0px_12px_32px_-12px_rgba(20,20,20,0.08)]">
                {status.state === "sent" ? (
                    <div className="py-6 sm:py-10 flex flex-col items-center text-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-success-soft text-success flex items-center justify-center">
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.25"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h3
                            ref={successHeadingRef}
                            tabIndex={-1}
                            className="text-xl font-semibold text-ink focus:outline-none"
                        >
                            Message sent
                        </h3>
                        <p role="status" className="max-w-[420px] text-[15px] text-muted leading-relaxed">
                            Thanks{name.trim() ? `, ${name.trim()}` : ""}. We&apos;ve
                            received your {activeTopic.label.toLowerCase()} and will reply
                            to <span className="font-medium text-ink break-all">{email.trim()}</span>.
                        </p>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="mt-2 text-sm font-medium text-accent-active hover:text-ink underline-offset-4 hover:underline transition-colors duration-150 cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form noValidate onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                        {/* Topic: segmented control built on native radios (arrow-key navigation) */}
                        <fieldset disabled={isSending} className="min-w-0">
                            <legend className="mb-2 text-sm font-medium text-ink">Topic</legend>
                            <div className="grid grid-cols-4 gap-1 p-1 rounded-full bg-control-track">
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
                                        <span className="flex w-full items-center justify-center min-h-9 px-1 rounded-full text-[13px] font-medium whitespace-nowrap text-muted transition-[color,background-color,box-shadow] duration-150 hover:text-ink peer-checked:bg-white peer-checked:text-ink peer-checked:shadow-[0_1px_3px_rgba(20,20,20,0.12),0_1px_2px_rgba(20,20,20,0.06)] peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                                            {topic.short}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
                            <Field id="contact-name" label="Name" optional>
                                <input
                                    id="contact-name"
                                    type="text"
                                    name="name"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    maxLength={100}
                                    disabled={isSending}
                                    className={`h-11 px-3.5 ${INPUT_CLASSES}`}
                                />
                            </Field>

                            <Field id="contact-email" label="Email" error={errors.email}>
                                <input
                                    ref={emailRef}
                                    id="contact-email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    inputMode="email"
                                    value={email}
                                    onChange={(e) => updateEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    maxLength={254}
                                    disabled={isSending}
                                    aria-required="true"
                                    aria-invalid={errors.email ? true : undefined}
                                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                                    className={`h-11 px-3.5 ${INPUT_CLASSES}`}
                                />
                            </Field>
                        </div>

                        <Field id="contact-message" label="Message" error={errors.message}>
                            <textarea
                                ref={messageRef}
                                id="contact-message"
                                name="message"
                                rows={5}
                                value={message}
                                onChange={(e) => updateMessage(e.target.value)}
                                placeholder={activeTopic.placeholder}
                                maxLength={5000}
                                disabled={isSending}
                                aria-required="true"
                                aria-invalid={errors.message ? true : undefined}
                                aria-describedby={errors.message ? "contact-message-error" : undefined}
                                className={`px-3.5 py-3 resize-y min-h-[132px] leading-relaxed ${INPUT_CLASSES}`}
                            />
                        </Field>

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

                        {/* Delivery problems (not field errors), always with the email fallback */}
                        {(status.state === "error" || !isContactFormConfigured) && (
                            <div
                                role="alert"
                                className="flex items-start gap-2.5 rounded-xl border border-danger-border bg-danger-soft px-4 py-3 text-sm text-danger leading-relaxed"
                            >
                                <AlertIcon className="mt-0.5" />
                                <p>
                                    {status.state === "error"
                                        ? status.reason
                                        : "The contact form is unavailable right now."}{" "}
                                    Please email us at{" "}
                                    <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium underline underline-offset-2">
                                        {CONTACT_EMAIL}
                                    </a>
                                    .
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSending || !isContactFormConfigured}
                            aria-busy={isSending}
                            className="w-full flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-accent hover:bg-accent-hover active:bg-accent-active text-white font-pixel text-lg shadow-[0px_4px_18px_0px_rgba(53,166,241,0.28)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-accent"
                        >
                            {isSending && (
                                <span
                                    aria-hidden="true"
                                    className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"
                                />
                            )}
                            {isSending ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                )}
            </div>

            <EmailFallback />
        </section>
    );
}

/** Label + control + inline error, wired together for assistive tech. */
function Field({
    id,
    label,
    optional = false,
    error,
    children,
}: {
    id: string;
    label: string;
    optional?: boolean;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5 min-w-0">
            <label htmlFor={id} className="text-sm font-medium text-ink">
                {label}
                {optional && <span className="font-normal text-subtle"> (optional)</span>}
            </label>
            {children}
            {error && (
                <p id={`${id}-error`} className="flex items-start gap-1.5 text-[13px] text-danger">
                    <AlertIcon className="mt-px" />
                    {error}
                </p>
            )}
        </div>
    );
}

function AlertIcon({ className = "" }: { className?: string }) {
    return (
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
            className={`shrink-0 ${className}`}
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
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
        <div className="flex flex-col items-center gap-1 text-sm text-muted text-center">
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
                    {copyState === "copied" ? "Copied" : "Copy"}
                </button>
            </div>
            <span aria-live="polite" className="min-h-5 text-xs">
                {copyState === "copied" && "Email address copied to clipboard."}
                {copyState === "manual" && "Address selected. Press Ctrl+C (⌘C on Mac) to copy."}
            </span>
        </div>
    );
}
