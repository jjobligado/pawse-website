"use client";

import {
    type FormEvent,
    type ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import Image from "next/image";
import { usePlatform, type DetectedPlatform } from "@/hooks/use-platform";
import { isContactFormConfigured, sendContactMessage } from "@/lib/contact";
import { CONTACT_EMAIL } from "@/lib/site-config";
import { SectionTitle } from "./section-heading";
import { OsIcon } from "./download-options";
import SpriteCat from "./sprite-cat";
import { buttonClasses, buttonLabelClasses } from "@/components/ui/button";

type ContactTopic = "general" | "bug" | "feature";

const TOPICS: readonly {
    id: ContactTopic;
    label: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    cat: { name: string; id: "tux" | "void" | "ginger" };
}[] = [
    {
        id: "general",
        label: "General",
        subjectPlaceholder: "Question about PAWSE...",
        messagePlaceholder: "How can we help?",
        cat: { name: "Tux", id: "tux" },
    },
    {
        id: "bug",
        label: "Bug",
        subjectPlaceholder: "Timer froze when switching modes...",
        messagePlaceholder:
            "Tell us what happened, which companion you were using, and what you expected.",
        cat: { name: "Void", id: "void" },
    },
    {
        id: "feature",
        label: "Feature",
        subjectPlaceholder: "Idea: rain soundscape...",
        messagePlaceholder:
            "Describe your idea and how it would fit into your focus routine.",
        cat: { name: "Ginger", id: "ginger" },
    },
];

const OS_NAMES: Partial<Record<DetectedPlatform, string>> = {
    windows: "Windows",
    mac: "macOS",
    linux: "Linux",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;

type FieldErrors = Partial<Record<"email" | "subject" | "message", string>>;

function validate(email: string, subject: string, message: string): FieldErrors {
    const errors: FieldErrors = {};
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedEmail) errors.email = "Enter your email so we can reply.";
    else if (!EMAIL_PATTERN.test(trimmedEmail))
        errors.email = "Enter a valid email address, like name@example.com.";

    if (!subject.trim()) errors.subject = "Add a subject so we know what it's about.";

    if (!trimmedMessage) errors.message = "Write a message before sending.";
    else if (trimmedMessage.length < MIN_MESSAGE_LENGTH)
        errors.message = `Add a bit more detail (at least ${MIN_MESSAGE_LENGTH} characters).`;

    return errors;
}

const INPUT_CLASSES =
    "w-full rounded-control bg-white border border-stroke text-body-sm text-ink placeholder:text-faint transition-[border-color,box-shadow] duration-150 hover:border-stroke-strong focus:outline-none focus:border-focus-ring focus:ring-4 focus:ring-accent-highlight/40 aria-invalid:border-danger aria-invalid:focus:ring-danger/15 disabled:opacity-60 disabled:cursor-not-allowed";

type Status = { state: "idle" | "sending" | "sent" } | { state: "error"; reason: string };

function isTopic(value: unknown): value is ContactTopic {
    return value === "general" || value === "bug" || value === "feature";
}

export default function ContactSection() {
    const [topic, setTopic] = useState<ContactTopic>("general");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [botcheck, setBotcheck] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
    const [status, setStatus] = useState<Status>({ state: "idle" });

    const emailRef = useRef<HTMLInputElement>(null);
    const subjectRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const successHeadingRef = useRef<HTMLHeadingElement>(null);
    const topicRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const { platform } = usePlatform();

    const activeTopic = TOPICS.find((t) => t.id === topic) ?? TOPICS[0];
    const detectedOsName = OS_NAMES[platform];
    const isSending = status.state === "sending";

    // Receive topic jumps from FAQ ("Report a Bug", "Suggest a Feature", "Ask the team").
    useEffect(() => {
        const applyTopic = (next: unknown) => {
            if (!isTopic(next)) return;
            setTopic(next);
            setStatus((prev) => (prev.state === "sent" ? { state: "idle" } : prev));
        };

        try {
            const pending = window.sessionStorage.getItem("pawse-contact-topic");
            if (pending) {
                applyTopic(pending);
                window.sessionStorage.removeItem("pawse-contact-topic");
            }
        } catch {
            // Ignore storage errors in restricted browsing contexts.
        }

        const onTopicEvent = (e: Event) => {
            applyTopic((e as CustomEvent<unknown>).detail);
        };
        window.addEventListener("pawse:contact-topic", onTopicEvent);
        return () => window.removeEventListener("pawse:contact-topic", onTopicEvent);
    }, []);

    // Move focus to the confirmation so screen readers announce it and keyboard users aren't lost.
    useEffect(() => {
        if (status.state === "sent") successHeadingRef.current?.focus();
    }, [status.state]);

    // After the first submit attempt, errors update live as the visitor fixes each field.
    const updateEmail = (value: string) => {
        setEmail(value);
        if (hasTriedSubmit) setErrors((prev) => ({ ...prev, email: validate(value, subject, message).email }));
    };
    const updateSubject = (value: string) => {
        setSubject(value);
        if (hasTriedSubmit) setErrors((prev) => ({ ...prev, subject: validate(email, value, message).subject }));
    };
    const updateMessage = (value: string) => {
        setMessage(value);
        if (hasTriedSubmit) setErrors((prev) => ({ ...prev, message: validate(email, subject, value).message }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSending) return;

        setHasTriedSubmit(true);
        const nextErrors = validate(email, subject, message);
        setErrors(nextErrors);
        if (nextErrors.email) return emailRef.current?.focus();
        if (nextErrors.subject) return subjectRef.current?.focus();
        if (nextErrors.message) return messageRef.current?.focus();

        const prefixedSubject =
            topic === "bug"
                ? `[Bug] ${subject.trim()}`
                : topic === "feature"
                  ? `[Feature] ${subject.trim()}`
                  : subject.trim();

        setStatus({ state: "sending" });
        const result = await sendContactMessage({
            subject: prefixedSubject,
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            os: detectedOsName ?? "",
            botcheck,
        });
        setStatus(result.ok ? { state: "sent" } : { state: "error", reason: result.reason });
    };

    const handleReset = () => {
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setErrors({});
        setHasTriedSubmit(false);
        setStatus({ state: "idle" });
    };

    return (
        <section
            id="contact"
            className="scroll-mt-20 w-full max-w-content mx-auto py-12 md:py-24 px-6 md:px-12 lg:px-20 bg-white"
        >
            <div className="w-full max-w-[1040px] mx-auto flex flex-col lg:flex-row lg:items-start justify-between gap-10 lg:gap-14">
                {/* Left column: editorial intro, copyable direct-email card, helpful context */}
                <div className="w-full lg:w-[38%] lg:pt-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-5">
                    <div className="flex flex-col items-center lg:items-start gap-3">
                        <SectionTitle className="text-center lg:text-left">
                            Contact Us
                        </SectionTitle>
                        <p className="max-w-[440px] text-base md:text-lg text-muted leading-relaxed text-pretty">
                            Questions, ideas, or something not working? Send us a note
                            and our three-person team will get back to you.
                        </p>
                    </div>

                    <DirectEmailCard />

                    <div className="w-full max-w-[420px] lg:max-w-none flex flex-col items-center lg:items-start gap-2.5 text-body-sm text-muted">
                        <p className="flex items-center gap-2">
                            <span
                                aria-hidden="true"
                                className="inline-block w-1.5 h-1.5 rounded-full bg-accent shrink-0"
                            />
                            <span>Built by three devs — we read every note personally.</span>
                        </p>

                        {topic === "bug" && detectedOsName && (platform === "windows" || platform === "mac" || platform === "linux") ? (
                            <div
                                suppressHydrationWarning
                                className="inline-flex items-center gap-2 rounded-chip bg-[#EAF5FD] px-3 py-1.5 text-xs font-medium text-[#1A6CA3] ring-1 ring-inset ring-[#CFE6F8]"
                            >
                                <OsIcon os={platform} />
                                <span>
                                    Auto-attached to bug report: <strong>{detectedOsName}</strong>
                                </span>
                            </div>
                        ) : (
                            <p className="flex items-center gap-2">
                                <span
                                    aria-hidden="true"
                                    className="inline-block w-1.5 h-1.5 rounded-full bg-accent-highlight shrink-0"
                                />
                                <span>
                                    Quick answers might already be in the{" "}
                                    <a
                                        href="#faq"
                                        className="font-medium text-ink link-underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
                                    >
                                        FAQ above
                                    </a>
                                    .
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Right column: peeking companion + tactile PAWSE message card */}
                <div className="w-full lg:w-[58%] max-w-[640px] mx-auto lg:mx-0 pt-9 sm:pt-[76px] lg:pt-[72px]">
                    <div className="relative">
                        {/* Companion peeking over the card's top border; switches per topic */}
                        <div className="pointer-events-auto absolute bottom-full right-6 sm:right-9 z-10 translate-y-[2px]">
                            <SpriteCat
                                key={activeTopic.id}
                                idle={{
                                    src: `/sprites/${activeTopic.cat.id}-head-peek-sheet.png`,
                                    frames: 4,
                                }}
                                action={{
                                    src: `/sprites/${activeTopic.cat.id}-head-peek-sheet.png`,
                                    frames: 4,
                                }}
                                label={`Say hi to ${activeTopic.cat.name}`}
                                idleHoldMs={2800}
                                frameMs={160}
                                className="w-16 h-16 sm:w-32 sm:h-32"
                            />
                        </div>

                        <div className="relative w-full p-5 sm:p-8 rounded-card-lg border-2 border-stroke surface-wash shadow-raised">
                            {status.state === "sent" ? (
                                <div className="py-6 sm:py-10 flex flex-col items-center text-center gap-3.5">
                                    <div aria-hidden="true" className="flex items-center gap-2">
                                        {["orange", "tuxedo", "black"].map((fish, i) => (
                                            <Image
                                                key={fish}
                                                src={`/images/completed-${fish}-fish.png`}
                                                alt=""
                                                width={32}
                                                height={32}
                                                className={`w-8 h-8 [image-rendering:pixelated] drop-shadow-[0_2px_3px_rgba(0,0,0,0.12)] ${i === 1 ? "-scale-x-100" : ""}`}
                                            />
                                        ))}
                                    </div>
                                    <h3
                                        ref={successHeadingRef}
                                        tabIndex={-1}
                                        className="font-pixel text-2xl font-semibold text-ink focus:outline-none"
                                    >
                                        Message sent
                                    </h3>
                                    <p role="status" className="max-w-[420px] text-body-sm text-muted leading-relaxed">
                                        Thanks{name.trim() ? `, ${name.trim()}` : ""}.{" "}
                                        {activeTopic.cat.name} and the team received your{" "}
                                        {topic === "general" ? "note" : `${topic} note`} and will
                                        reply to{" "}
                                        <span className="font-medium text-ink break-all">
                                            {email.trim()}
                                        </span>
                                        .
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="mt-2 rounded-pill bg-[#EAF5FD] px-4 py-1.5 text-sm font-medium text-[#1A6CA3] ring-1 ring-inset ring-[#CFE6F8] transition-colors duration-150 hover:bg-[#DDEFFC] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form noValidate onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                                    {/* Topic segmented control */}
                                    <div className="flex flex-col gap-2">
                                        <span id="contact-topic-label" className="text-sm font-medium text-ink">
                                            Topic
                                        </span>
                                        <div
                                            role="radiogroup"
                                            aria-labelledby="contact-topic-label"
                                            className="grid grid-cols-3 gap-1 rounded-pill border border-stroke/80 bg-control-track p-1"
                                        >
                                            {TOPICS.map((item, index) => {
                                                const active = topic === item.id;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        ref={(el) => {
                                                            topicRefs.current[index] = el;
                                                        }}
                                                        type="button"
                                                        role="radio"
                                                        aria-checked={active}
                                                        tabIndex={active ? 0 : -1}
                                                        disabled={isSending}
                                                        onClick={() => setTopic(item.id)}
                                                        onKeyDown={(e) => {
                                                            const last = TOPICS.length - 1;
                                                            let next: number | null = null;
                                                            if (e.key === "ArrowRight" || e.key === "ArrowDown")
                                                                next = index === last ? 0 : index + 1;
                                                            else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
                                                                next = index === 0 ? last : index - 1;
                                                            if (next === null) return;
                                                            e.preventDefault();
                                                            setTopic(TOPICS[next].id);
                                                            topicRefs.current[next]?.focus();
                                                        }}
                                                        className={`rounded-pill py-1.5 px-3 text-caption sm:text-body-sm transition-[background-color,color,box-shadow] duration-(--duration-micro) ease-standard cursor-pointer select-none disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 ${
                                                            active
                                                                ? "bg-white font-semibold text-ink-strong shadow-control"
                                                                : "font-medium text-muted hover:text-ink"
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Name and email side by side from sm up; stacked on phones */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

                                    <Field id="contact-subject" label="Subject" error={errors.subject}>
                                        <input
                                            ref={subjectRef}
                                            id="contact-subject"
                                            type="text"
                                            name="subject"
                                            value={subject}
                                            onChange={(e) => updateSubject(e.target.value)}
                                            placeholder={activeTopic.subjectPlaceholder}
                                            maxLength={150}
                                            disabled={isSending}
                                            aria-required="true"
                                            aria-invalid={errors.subject ? true : undefined}
                                            aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                                            className={`h-11 px-3.5 ${INPUT_CLASSES}`}
                                        />
                                    </Field>

                                    <Field id="contact-message" label="Message" error={errors.message}>
                                        <textarea
                                            ref={messageRef}
                                            id="contact-message"
                                            name="message"
                                            rows={5}
                                            value={message}
                                            onChange={(e) => updateMessage(e.target.value)}
                                            placeholder={activeTopic.messagePlaceholder}
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
                                            className="flex items-start gap-2.5 rounded-control border border-danger-border bg-danger-soft px-4 py-3 text-sm text-danger leading-relaxed"
                                        >
                                            <AlertIcon className="mt-0.5" />
                                            <p>
                                                {status.state === "error"
                                                    ? status.reason
                                                    : "The contact form is unavailable right now."}{" "}
                                                Please email us at{" "}
                                                <a
                                                    href={`mailto:${CONTACT_EMAIL}`}
                                                    className="font-medium link-underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                                                >
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
                                        className={buttonClasses({ className: `w-full h-12 ${buttonLabelClasses("md")}` })}
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
                    </div>
                </div>
            </div>
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
                <p id={`${id}-error`} className="flex items-start gap-1.5 text-caption text-danger">
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

/** Tactile direct-email card with mailto link and one-click clipboard copy. */
function DirectEmailCard() {
    const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");
    const addressRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (copyState === "idle") return;
        const timer = window.setTimeout(() => setCopyState("idle"), 2500);
        return () => window.clearTimeout(timer);
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
        <div className="w-full max-w-[420px] lg:max-w-none rounded-card border-2 border-stroke bg-white p-4 sm:p-5 flex items-center justify-between gap-3 text-left transition-colors duration-(--duration-short) hover:border-stroke-strong">
            <div className="flex items-center gap-3.5 min-w-0">
                <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-chip bg-[#EAF5FD] text-[#1A6CA3]"
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                </span>
                <div className="min-w-0">
                    <span className="block text-xs font-medium text-subtle">
                        Prefer email?
                    </span>
                    <a
                        ref={addressRef}
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="inline-block pb-0.5 text-body-sm font-medium text-ink break-all link-underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
                    >
                        {CONTACT_EMAIL}
                    </a>
                </div>
            </div>

            <button
                type="button"
                onClick={handleCopy}
                aria-label={`Copy ${CONTACT_EMAIL}`}
                className={`shrink-0 rounded-pill px-3 py-1.5 text-xs font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 ${
                    copyState === "copied"
                        ? "bg-success-soft text-success"
                        : "bg-control-track text-ink hover:bg-[#EAF5FD] hover:text-[#1A6CA3]"
                }`}
            >
                <span aria-live="polite">
                    {copyState === "copied"
                        ? "Copied"
                        : copyState === "manual"
                          ? "Press Ctrl+C"
                          : "Copy"}
                </span>
            </button>
        </div>
    );
}
