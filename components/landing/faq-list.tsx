"use client";

import { useRef, useState } from "react";
import { smoothScrollTo } from "@/lib/smooth-scroll";
import {
    FAQ_CATEGORIES,
    FAQS,
    type ContactTopic,
    type FaqFilter,
} from "./faq-data";

/** Dispatches topic intent to the Contact form (if present) and glides smoothly to #contact. */
function jumpToContact(e: React.MouseEvent<HTMLAnchorElement>, topic: ContactTopic) {
    window.dispatchEvent(new CustomEvent("pawse:contact-topic", { detail: topic }));
    try {
        window.sessionStorage.setItem("pawse-contact-topic", topic);
    } catch {
        // Ignore storage errors in restricted browsing contexts.
    }

    const contactEl = document.getElementById("contact");
    if (contactEl) {
        e.preventDefault();
        smoothScrollTo(contactEl);
    }
}

function ContactJumpPill({
    topic,
    label,
}: {
    topic: ContactTopic;
    label: string;
}) {
    return (
        <a
            href="#contact"
            onClick={(e) => jumpToContact(e, topic)}
            className="inline-flex items-center gap-1.5 rounded-pill bg-[#EAF5FD] px-3.5 py-1.5 text-sm font-medium text-[#1A6CA3] ring-1 ring-inset ring-[#CFE6F8] transition-[background-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#DDEFFC] hover:ring-[#B9DCF6] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
        >
            <span>{label}</span>
            <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
            </svg>
        </a>
    );
}

/**
 * Interactive category tabs and tactile FAQ cards. Defaults to "Basics" so
 * the list stays compact above the closing download window, while keeping
 * "Setup", "Sessions", and "All" one click away.
 */
export default function FaqList() {
    const [activeFilter, setActiveFilter] = useState<FaqFilter>("basics");
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const visibleFaqs =
        activeFilter === "all"
            ? FAQS
            : FAQS.filter((faq) => faq.category === activeFilter);

    const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
        const last = FAQ_CATEGORIES.length - 1;
        let nextIndex: number | null = null;
        if (e.key === "ArrowRight") nextIndex = index === last ? 0 : index + 1;
        else if (e.key === "ArrowLeft") nextIndex = index === 0 ? last : index - 1;
        else if (e.key === "Home") nextIndex = 0;
        else if (e.key === "End") nextIndex = last;

        if (nextIndex === null) return;
        e.preventDefault();
        setActiveFilter(FAQ_CATEGORIES[nextIndex].id);
        tabRefs.current[nextIndex]?.focus();
    };

    return (
        <div className="w-full flex flex-col items-center gap-6 mt-1">
            {/* Segmented category filter using the shared control-track tokens */}
            <div
                role="tablist"
                aria-label="FAQ categories"
                className="inline-flex max-w-full flex-wrap items-center justify-center gap-1 rounded-pill border border-stroke/80 bg-control-track p-1"
            >
                {FAQ_CATEGORIES.map((category, index) => {
                    const selected = activeFilter === category.id;
                    return (
                        <button
                            key={category.id}
                            ref={(el) => {
                                tabRefs.current[index] = el;
                            }}
                            id={`faq-tab-${category.id}`}
                            role="tab"
                            type="button"
                            aria-selected={selected}
                            aria-controls="faq-panel"
                            tabIndex={selected ? 0 : -1}
                            onClick={() => setActiveFilter(category.id)}
                            onKeyDown={(e) => handleTabKeyDown(e, index)}
                            className={`rounded-pill px-3.5 sm:px-4 py-1.5 text-caption sm:text-body-sm transition-[background-color,color,box-shadow] duration-(--duration-micro) ease-standard cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 ${
                                selected
                                    ? "bg-white font-semibold text-ink-strong shadow-control"
                                    : "font-medium text-muted hover:text-ink"
                            }`}
                        >
                            {category.label}
                        </button>
                    );
                })}
            </div>

            {/* Individual tactile FAQ cards */}
            <div
                id="faq-panel"
                role="tabpanel"
                aria-labelledby={`faq-tab-${activeFilter}`}
                className="w-full max-w-[820px] flex flex-col gap-3"
            >
                {visibleFaqs.map((faq) => (
                    <details
                        key={faq.id}
                        className="group rounded-card border-2 border-stroke bg-white transition-[background-color,border-color,box-shadow] duration-(--duration-short) ease-standard hover:border-stroke-strong hover:bg-sky-50/45 open:border-accent-highlight open:bg-sky-50/75 open:shadow-control"
                    >
                        <summary className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden rounded-[calc(var(--radius-card)-2px)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2">
                            <span className="text-base md:text-label font-medium text-ink-strong leading-snug text-left">
                                {faq.question}
                            </span>
                            {/* Plus that transitions to minus when open */}
                            <span
                                aria-hidden="true"
                                className="relative w-7 h-7 shrink-0 rounded-full bg-control-track transition-colors duration-150 group-hover:bg-accent-highlight/60 group-open:bg-accent-strong"
                            >
                                <span className="absolute left-1/2 top-1/2 w-3 h-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink transition-colors duration-150 group-open:bg-white" />
                                <span className="absolute left-1/2 top-1/2 w-0.5 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink transition-[transform,background-color] duration-200 group-open:scale-y-0 group-open:bg-white" />
                            </span>
                        </summary>
                        <div className="px-5 sm:px-6 pb-5 pt-0.5 text-body-sm md:text-base text-muted leading-relaxed">
                            {faq.answer}
                            {faq.actions && (
                                <div className="mt-3.5 flex flex-wrap gap-2">
                                    {faq.actions.map((action) => (
                                        <ContactJumpPill
                                            key={action.topic}
                                            topic={action.topic}
                                            label={action.label}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </details>
                ))}
            </div>

            {/* Light bridge straight down to Contact Us */}
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-body-sm text-muted">
                <span>Still looking for an answer?</span>
                <ContactJumpPill topic="general" label="Ask the team" />
            </div>
        </div>
    );
}
