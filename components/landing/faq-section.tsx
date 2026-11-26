import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";
import { FAQ_GROUPS, FAQS } from "./faq-data";

export { FAQS } from "./faq-data";

function ContactNote({ className = "" }: { className?: string }) {
    return (
        <p className={`text-body-sm text-muted ${className}`}>
            Still looking for an answer?{" "}
            <a
                href="#contact"
                className="font-medium text-ink link-underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
            >
                Contact us
            </a>
            .
        </p>
    );
}

/**
 * Split FAQ: all questions appear immediately in three labeled groups
 * so visitors can scan and expand any answer without extra filter clicks.
 */
export default function FaqSection() {
    return (
        <Section id="faq" className="flex flex-col items-stretch">
            <div className="w-full flex flex-col lg:flex-row lg:items-start justify-between gap-10 md:gap-12 lg:gap-16">
                {/* Left column (static, scrolls with the page): heading, subtitle, and understated contact link */}
                <div className="w-full lg:w-[36%] flex flex-col items-center lg:items-start text-center lg:text-left gap-3 md:gap-4">
                    <SectionTitle className="text-center lg:text-left text-balance">
                        Frequently Asked Questions
                    </SectionTitle>
                    <SectionSubtitle className="max-w-[420px] text-center lg:text-left text-balance">
                        Everything you need to know before you download.
                    </SectionSubtitle>

                    <ContactNote className="hidden lg:block pt-2" />
                </div>

                {/* Right column: all 9 tactile accordion cards visible at once, grouped by topic */}
                <div className="w-full lg:w-[60%] max-w-[760px] mx-auto lg:mx-0 flex flex-col gap-8 md:gap-10">
                    {FAQ_GROUPS.map((group) => {
                        const items = FAQS.filter((faq) => faq.category === group.id);
                        return (
                            <div key={group.id} className="flex flex-col gap-4">
                                <h3 className="px-1 text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft">
                                    {group.label}
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {items.map((faq) => (
                                        <details
                                            key={faq.id}
                                            className="group rounded-card border-2 border-stroke bg-white transition-[background-color,border-color,box-shadow] duration-(--duration-short) ease-standard hover:border-stroke-strong hover:bg-sky-50/45 open:border-accent-highlight open:bg-sky-50/75 open:shadow-control"
                                        >
                                            <summary className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden rounded-[calc(var(--radius-card)-2px)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2">
                                                <span className="text-base md:text-label font-medium text-ink-strong leading-snug text-left">
                                                    {faq.question}
                                                </span>
                                                {/* Plus that turns into a minus when open */}
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
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Mobile / tablet inline note below cards */}
                    <ContactNote className="lg:hidden pt-1 text-center" />
                </div>
            </div>
        </Section>
    );
}
