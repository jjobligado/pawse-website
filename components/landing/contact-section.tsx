"use client";

import { type FormEvent, useState } from "react";
import { SectionTitle } from "./section-heading";

type ContactTopicId = "general" | "feature" | "bug" | "feedback";

interface ContactTopic {
    id: ContactTopicId;
    label: string;
    placeholder: string;
}

const CONTACT_TOPICS: ContactTopic[] = [
    {
        id: "general",
        label: "General Inquiry",
        placeholder: "Tell us what's on your mind...",
    },
    {
        id: "feature",
        label: "Feature Request",
        placeholder:
            "What cozy feature or companion idea would you love to see next?",
    },
    {
        id: "bug",
        label: "Bug Report",
        placeholder:
            "Describe what happened, steps to reproduce, and what OS you're using...",
    },
    {
        id: "feedback",
        label: "App Feedback",
        placeholder:
            "Tell us what's working well for your focus routine (and what could be better)...",
    },
];

export default function ContactSection() {
    const [selectedTopic, setSelectedTopic] =
        useState<ContactTopicId>("general");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const activeTopic =
        CONTACT_TOPICS.find((t) => t.id === selectedTopic) ?? CONTACT_TOPICS[0];

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    const handleReset = () => {
        setName("");
        setEmail("");
        setMessage("");
        setIsSubmitted(false);
    };

    return (
        <section
            id="contact"
            className="scroll-mt-20 w-full max-w-[1280px] mx-auto py-24 md:py-32 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-6 bg-white"
        >
            <SectionTitle>Contact Us</SectionTitle>

            <div className="px-4 md:px-10 flex justify-center items-center">
                <p className="max-w-[640px] text-base md:text-lg text-muted text-center leading-relaxed">
                    Have a question, spotted a bug, want to suggest a new
                    feature, or share feedback on your experience? Drop us a
                    message below and we&apos;ll get back to you.
                </p>
            </div>

            <div className="w-full max-w-[580px] mt-2 p-6 sm:p-8 md:p-10 rounded-3xl border-2 border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#F4FAFF_68%,#E3F4FF_100%)] shadow-[0px_12px_32px_-8px_rgba(20,20,20,0.06)]">
                {isSubmitted ? (
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
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>

                        <h3 className="font-pixel text-2xl md:text-3xl font-semibold text-ink">
                            Message Sent!
                        </h3>

                        <p className="max-w-[440px] text-sm sm:text-base text-muted leading-relaxed">
                            Thanks for reaching out{name ? `, ${name}` : ""}!
                            We&apos;ve received your{" "}
                            <span className="font-medium text-ink">
                                {activeTopic.label.toLowerCase()}
                            </span>{" "}
                            note and will get back to you at{" "}
                            <span className="font-medium text-ink">
                                {email}
                            </span>{" "}
                            soon.
                        </p>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="mt-2 py-2.5 px-6 rounded-full bg-white border-2 border-stroke hover:border-accent text-sm font-medium text-ink transition-colors duration-200 cursor-pointer"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="w-full flex flex-col gap-5"
                    >
                        {/* Topic Pills (Single-line labels, left-aligned) */}
                        <div className="flex flex-col items-start gap-2.5">
                            <span className="text-sm font-medium text-ink">
                                What can we help you with?
                            </span>
                            <div
                                role="radiogroup"
                                aria-label="Contact topic"
                                className="w-full flex flex-nowrap items-center justify-start gap-1.5 sm:gap-2"
                            >
                                {CONTACT_TOPICS.map((topic) => {
                                    const isActive = selectedTopic === topic.id;
                                    return (
                                        <button
                                            key={topic.id}
                                            type="button"
                                            role="radio"
                                            aria-checked={isActive}
                                            onClick={() =>
                                                setSelectedTopic(topic.id)
                                            }
                                            className={`px-2.5 sm:px-3.5 py-2 rounded-full text-[11px] sm:text-[13px] font-medium border whitespace-nowrap text-left transition-all duration-150 cursor-pointer select-none ${
                                                isActive
                                                    ? "bg-accent text-white border-accent shadow-[0px_4px_12px_0px_rgba(53,166,241,0.28)]"
                                                    : "bg-white text-ink-soft border-stroke hover:border-accent hover:text-ink"
                                            }`}
                                        >
                                            {topic.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Name Row (Optional) */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="contact-name"
                                    className="text-sm font-medium text-ink"
                                >
                                    Name
                                </label>
                                <span className="text-xs text-subtle">
                                    Optional
                                </span>
                            </div>
                            <input
                                id="contact-name"
                                type="text"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                className="h-[46px] px-4 rounded-xl bg-white border-2 border-stroke text-sm md:text-base text-ink placeholder:text-faint transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[0_0_0_4px_rgba(168,220,255,0.4)]"
                            />
                        </div>

                        {/* Email Row */}
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="contact-email"
                                className="text-sm font-medium text-ink"
                            >
                                Email
                            </label>
                            <input
                                id="contact-email"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="h-[46px] px-4 rounded-xl bg-white border-2 border-stroke text-sm md:text-base text-ink placeholder:text-faint transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[0_0_0_4px_rgba(168,220,255,0.4)]"
                            />
                        </div>

                        {/* Message Textarea */}
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="contact-message"
                                className="text-sm font-medium text-ink"
                            >
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
                                className="p-4 rounded-xl bg-white border-2 border-stroke text-sm md:text-base text-ink placeholder:text-faint resize-y transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[0_0_0_4px_rgba(168,220,255,0.4)]"
                            />
                        </div>

                        {/* Centered Submit Button */}
                        <div className="pt-2 flex justify-center">
                            <button
                                type="submit"
                                className="w-full sm:w-auto flex items-center justify-center py-2.5 px-10 rounded-full bg-accent hover:bg-accent-hover active:bg-accent-active text-white font-pixel text-lg shadow-[0px_4px_18px_0px_rgba(53,166,241,0.28)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
