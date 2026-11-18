"use client";

import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePlatform, type DetectedPlatform } from "@/hooks/use-platform";
import { isContactFormConfigured, sendContactMessage } from "@/lib/contact";
import { CONTACT_EMAIL } from "@/lib/site-config";
import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";
import { buttonClasses, buttonLabelClasses } from "@/components/ui/button";

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
    "w-full rounded-card bg-white border-2 border-stroke text-body-sm text-ink placeholder:text-faint transition-[background-color,border-color,box-shadow] duration-(--duration-short) ease-standard hover:border-stroke-strong hover:bg-sky-50/45 focus:outline-none focus:border-focus-ring focus:bg-white focus:ring-4 focus:ring-accent-highlight/40 aria-invalid:border-danger aria-invalid:focus:ring-danger/15 disabled:opacity-60 disabled:cursor-not-allowed";

type Status = { state: "idle" | "sending" | "sent" } | { state: "error"; reason: string };

function EmailNote({ className = "" }: { className?: string }) {
    return (
        <p className={`text-body-sm text-muted ${className}`}>
            Prefer email? Write us at{" "}
            <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-ink link-underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
            >
                {CONTACT_EMAIL}
            </a>
            .
        </p>
    );
}

/**
 * Sticky split contact section matching the FAQ layout: sticky heading, subtitle,
 * and email fallback on the left; open form fields styled like the FAQ cards
 * directly on the page on the right (no outer card container).
 */
export default function ContactSection() {
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
    const { platform } = usePlatform();

    const isSending = status.state === "sending";

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

        setStatus({ state: "sending" });
        const result = await sendContactMessage({
            subject: subject.trim(),
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
        setSubject("");
        setMessage("");
        setErrors({});
        setHasTriedSubmit(false);
        setStatus({ state: "idle" });
    };

    return (
        <Section id="contact" className="flex flex-col items-stretch">
            <div className="w-full flex flex-col lg:flex-row lg:items-start justify-between gap-10 lg:gap-14">
                {/* Left column: sticky heading, subtitle, and understated direct email */}
                <div className="w-full lg:w-[36%] lg:sticky lg:top-24 flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
                    <SectionTitle className="text-center lg:text-left text-balance">
                        Contact Us
                    </SectionTitle>
                    <SectionSubtitle className="max-w-[420px] text-center lg:text-left text-balance">
                        Have questions, feedback, or need support? Reach out and our
                        team will get back to you.
                    </SectionSubtitle>

                    <EmailNote className="hidden lg:block pt-1" />
                </div>

                {/* Right column: borderless tactile form matching the FAQ card aesthetic */}
                <div className="w-full lg:w-[60%] max-w-[760px] mx-auto lg:mx-0 flex flex-col gap-7">
                    <div className="flex flex-col gap-3">
                        <h3 className="px-1 text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft">
                            Send a message
                        </h3>

                        {status.state === "sent" ? (
                            <div className="rounded-card border-2 border-accent-highlight bg-sky-50/75 shadow-control px-6 sm:px-8 py-10 flex flex-col items-center text-center gap-3.5">
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
                                <h4
                                    ref={successHeadingRef}
                                    tabIndex={-1}
                                    className="font-pixel text-2xl font-semibold text-ink focus:outline-none"
                                >
                                    Message sent
                                </h4>
                                <p role="status" className="max-w-[420px] text-body-sm text-muted leading-relaxed">
                                    Thanks{name.trim() ? `, ${name.trim()}` : ""}. We&apos;ve
                                    received your message and will reply
                                    to <span className="font-medium text-ink break-all">{email.trim()}</span>.
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
                                            className={`h-12 px-4 ${INPUT_CLASSES}`}
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
                                            className={`h-12 px-4 ${INPUT_CLASSES}`}
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
                                        placeholder="What's this about?"
                                        maxLength={150}
                                        disabled={isSending}
                                        aria-required="true"
                                        aria-invalid={errors.subject ? true : undefined}
                                        aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                                        className={`h-12 px-4 ${INPUT_CLASSES}`}
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
                                        placeholder="How can we help? For bugs, include what happened and your PAWSE version."
                                        maxLength={5000}
                                        disabled={isSending}
                                        aria-required="true"
                                        aria-invalid={errors.message ? true : undefined}
                                        aria-describedby={errors.message ? "contact-message-error" : undefined}
                                        className={`px-4 py-3.5 resize-y min-h-[140px] leading-relaxed ${INPUT_CLASSES}`}
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
                                        className="flex items-start gap-2.5 rounded-card border-2 border-danger-border bg-danger-soft px-4 py-3.5 text-sm text-danger leading-relaxed"
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
                                    className={buttonClasses({ className: "w-full sm:w-auto sm:self-center sm:min-w-[200px] h-12" })}
                                >
                                    {isSending && (
                                        <span
                                            aria-hidden="true"
                                            className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"
                                        />
                                    )}
                                    <span className={buttonLabelClasses("md")}>
                                        {isSending ? "Sending..." : "Send Message"}
                                    </span>
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Mobile / tablet inline note below form */}
                    <EmailNote className="lg:hidden pt-1 text-center" />
                </div>
            </div>
        </Section>
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
            <label htmlFor={id} className="px-1 text-sm font-medium text-ink">
                {label}
                {optional && <span className="font-normal text-subtle"> (optional)</span>}
            </label>
            {children}
            {error && (
                <p id={`${id}-error`} className="px-1 flex items-start gap-1.5 text-caption text-danger">
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
