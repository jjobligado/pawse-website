import type { CSSProperties } from "react";
import Image from "next/image";
import Section from "./section";
import { SectionHeader, SectionSubtitle, SectionTitle } from "./section-heading";
import {
    COMPANIONS,
    SHOW_TESTIMONIALS,
    TESTIMONIALS,
    TESTIMONIALS_COPY,
    type Companion,
    type Testimonial,
} from "./testimonials-data";

/**
 * Testimonials: what testers say, after the feature tour and before Coming
 * Soon. It is a supporting section, so every direction stays quiet: no sky, no
 * full wall of notes, no motion beyond a hover, and nothing bigger than the
 * feature sections around it.
 *
 * Four design directions share the same data (see /dev/testimonials to compare
 * them side by side):
 *   postcards  postcards pegged to a line of twine
 *   guestbook  an open guestbook, signed with each tester's companion
 *   cards      plain white cards, like the FAQ and contact cards (in use)
 *   log        entries in an app-style session log
 *
 * While the quotes are samples (SAMPLE in testimonials-data.ts) the section
 * renders in development only.
 */

export type TestimonialsVariant = "postcards" | "guestbook" | "cards" | "log";

/** A companion's mini sprite, cropped to the cat, on its colour. */
function CompanionMini({ cat, className = "" }: { cat: Companion; className?: string }) {
    return (
        <span
            aria-hidden="true"
            className={`block shrink-0 bg-no-repeat bg-center [image-rendering:pixelated] ${className}`}
            style={{ backgroundImage: `url(/sprites/${cat}-mini-idle.png)`, backgroundSize: "165%", backgroundColor: COMPANIONS[cat].colour }}
        />
    );
}

/** An opening quote mark, drawn in pixels. */
function PixelQuote({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 7 5" shapeRendering="crispEdges" aria-hidden="true" focusable="false" className={className}>
            <path fill="currentColor" d="M0 0h3v3H0zM1 3h2v1H1zM0 4h2v1H0zM4 0h3v3H4zM5 3h2v1H5zM4 4h2v1H4z" />
        </svg>
    );
}

const companionLine = (t: Testimonial) => `focuses with ${COMPANIONS[t.companion].name}`;

/* ------------------------------------------------------------------ */
/* A. Postcards on a line                                              */
/* ------------------------------------------------------------------ */

const POSTCARD_TILT = [-2.2, 1.4, -1.1];

function Postcards({ items }: { items: Testimonial[] }) {
    return (
        <div className="relative w-full max-w-[1110px] mx-auto">
            {/* The twine, sagging between the pegs (wide screens, where the cards sit in a row) */}
            <svg
                aria-hidden="true"
                viewBox="0 0 1000 40"
                preserveAspectRatio="none"
                className="hidden md:block absolute inset-x-[-2%] top-1 w-[104%] h-10 text-[#B39A7C]"
            >
                <path d="M0 6 Q 167 34 333 14 T 667 14 T 1000 6" fill="none" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            </svg>

            <ul className="relative grid gap-12 md:gap-6 lg:gap-10 md:grid-cols-3 pt-6 md:pt-8">
                {items.slice(0, 3).map((t, i) => (
                    <li
                        key={t.name}
                        className="relative md:rotate-(--tilt) transition-transform duration-300 ease-out md:hover:rotate-0 md:hover:-translate-y-1 motion-reduce:transition-none"
                        style={{ "--tilt": `${POSTCARD_TILT[i % POSTCARD_TILT.length]}deg` } as CSSProperties}
                    >
                        {/* Wooden peg */}
                        <span
                            aria-hidden="true"
                            className="absolute left-1/2 -top-6 z-10 -translate-x-1/2 w-3 h-10 rounded-[2px] bg-[linear-gradient(90deg,#A0724F,#C99B72_45%,#A0724F)] shadow-[0_2px_3px_rgb(40_20_10/0.3)]"
                        />
                        <figure className="relative flex flex-col gap-4 h-full rounded-[4px] bg-[#FBF8F1] p-5 sm:p-6 shadow-[0_1px_2px_rgb(40_20_10/0.12),0_14px_28px_-14px_rgb(40_20_10/0.35)]">
                            <div className="flex items-start justify-between">
                                {/* Postmark */}
                                <span
                                    aria-hidden="true"
                                    className="grid place-items-center size-14 rounded-full border-2 border-[rgb(192_58_53/0.45)] -rotate-12 font-pixel text-[9px] leading-[1.15] text-center text-[rgb(192_58_53/0.6)] uppercase"
                                >
                                    Pawse
                                    <br />
                                    Beta
                                    <br />
                                    2026
                                </span>
                                {/* Stamp: the tester's companion */}
                                <span aria-hidden="true" className="relative p-1 bg-white outline-2 outline-dotted outline-white -outline-offset-1 shadow-[0_1px_2px_rgb(40_20_10/0.25)] rotate-3">
                                    <CompanionMini cat={t.companion} className="w-11 h-12" />
                                </span>
                            </div>
                            <blockquote className="flex-1 font-hand text-xl leading-7 text-[#2368B0] bg-[repeating-linear-gradient(transparent_0_27px,rgb(35_104_176/0.14)_27px_28px)]">
                                <p>{t.quote}</p>
                            </blockquote>
                            <figcaption className="flex flex-col">
                                <span className="font-hand text-xl leading-7 text-[#2368B0]">— {t.name}</span>
                                <span className="text-sm text-muted">
                                    {t.role} · {t.tag}
                                </span>
                            </figcaption>
                        </figure>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* B. Guestbook                                                        */
/* ------------------------------------------------------------------ */

/** The How It Works inks (their CSS variables only exist inside that wall). */
const GUEST_INK = ["#2368B0", "#5B45A0", "#2C7652", "#2E3238"];
const RULED = "bg-[repeating-linear-gradient(transparent_0_31px,rgb(88_93_100/0.16)_31px_32px)]";

function GuestbookEntry({ t, i }: { t: Testimonial; i: number }) {
    return (
        <li>
            <figure className="flex flex-col">
                <blockquote className="font-hand text-[1.3rem] leading-8" style={{ color: GUEST_INK[i % GUEST_INK.length] }}>
                    <p>{t.quote}</p>
                </blockquote>
                <figcaption className="flex items-center justify-end gap-3 h-16">
                    <span className="flex flex-col items-end">
                        <span className="font-hand text-[1.3rem] leading-6" style={{ color: GUEST_INK[i % GUEST_INK.length] }}>
                            {t.name}
                        </span>
                        <span className="text-xs text-muted">
                            {t.role} · {companionLine(t)}
                        </span>
                    </span>
                    {/* The companion, pressed like a paw stamp beside the signature */}
                    <CompanionMini cat={t.companion} className="size-10 rounded-full -rotate-6" />
                </figcaption>
            </figure>
        </li>
    );
}

function Guestbook({ items }: { items: Testimonial[] }) {
    const pages = [items.slice(0, 2), items.slice(2, 4)];
    return (
        <div className="relative w-full max-w-[1000px] mx-auto">
            {/* Ribbon bookmark */}
            <span
                aria-hidden="true"
                className="absolute z-10 -top-2 right-10 md:right-16 w-5 h-24 bg-[#C03A35] [clip-path:polygon(0_0,100%_0,100%_100%,50%_82%,0_100%)]"
            />
            {/* Cover, then the two pages */}
            <div className="rounded-[14px] bg-window-frame p-2 sm:p-2.5 shadow-[0_2px_3px_rgb(40_20_10/0.2),0_24px_40px_-20px_rgb(40_20_10/0.45)]">
                <div className="relative grid md:grid-cols-2 rounded-[8px] overflow-hidden bg-[#FBF8F1]">
                    {/* Spine shadow down the middle */}
                    <span aria-hidden="true" className="hidden md:block absolute inset-y-0 left-1/2 w-16 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgb(40_20_10/0.12)_48%,rgb(40_20_10/0.2)_50%,rgb(40_20_10/0.12)_52%,transparent)]" />
                    {pages.map((page, p) => (
                        <div key={p} className={`relative px-6 sm:px-10 pt-8 pb-6 ${RULED} ${p === 1 ? "border-t md:border-t-0 border-stroke" : ""}`}>
                            <p aria-hidden="true" className="h-8 font-pixel text-xs uppercase tracking-widest text-subtle">
                                {p === 0 ? "Guestbook" : " "}
                            </p>
                            <ul className="flex flex-col gap-8">
                                {page.map((t, i) => (
                                    <GuestbookEntry key={t.name} t={t} i={p * 2 + i} />
                                ))}
                            </ul>
                            <p aria-hidden="true" className={`mt-4 font-pixel text-xs text-subtle ${p === 0 ? "text-left" : "text-right"}`}>
                                {p + 1}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* C. Quiet cards                                                      */
/* ------------------------------------------------------------------ */

function Cards({ items }: { items: Testimonial[] }) {
    return (
        <ul className="grid gap-5 md:gap-6 md:grid-cols-3 w-full max-w-[1110px] mx-auto">
            {items.slice(0, 3).map((t) => (
                <li key={t.name}>
                    <figure className="flex flex-col gap-5 h-full rounded-card border border-stroke bg-white p-6 lg:p-7 shadow-raised">
                        <div className="flex items-center justify-between gap-3">
                            <PixelQuote className="w-7 h-5 rotate-180 text-accent-strong" />
                            <span className="rounded-pill bg-control-track px-2.5 py-1 text-xs text-ink-soft">{t.tag}</span>
                        </div>
                        <blockquote className="flex-1 text-base leading-relaxed text-ink-soft">
                            <p>{t.quote}</p>
                        </blockquote>
                        <figcaption className="flex items-center gap-3 pt-5 border-t border-stroke">
                            <CompanionMini cat={t.companion} className="size-11 rounded-full" />
                            <span className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-ink-strong">{t.name}</span>
                                <span className="text-sm text-muted">{t.role}</span>
                            </span>
                        </figcaption>
                    </figure>
                </li>
            ))}
        </ul>
    );
}

/* ------------------------------------------------------------------ */
/* D. Session log                                                      */
/* ------------------------------------------------------------------ */

function SessionLog({ items }: { items: Testimonial[] }) {
    return (
        <div className="w-full max-w-[820px] mx-auto p-4 sm:p-8 md:p-10 rounded-3xl border border-stroke surface-sky">
            <div className="rounded-lg bg-mockup-surface shadow-screenshot overflow-hidden">
                {/* Title bar, like the app's window */}
                <div aria-hidden="true" className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-mockup-stroke">
                    <span className="font-pixel text-sm text-ink">Session Notes</span>
                    <span className="font-pixel text-xs text-subtle">{Math.min(items.length, 3)} entries</span>
                </div>
                <ul className="divide-y divide-mockup-stroke">
                    {items.slice(0, 3).map((t) => {
                        const c = COMPANIONS[t.companion];
                        return (
                            <li key={t.name}>
                                <figure className="grid grid-cols-[auto_1fr] gap-4 px-4 sm:px-5 py-5 bg-white/60">
                                    <CompanionMini cat={t.companion} className="size-12 rounded-md" />
                                    <div className="flex flex-col gap-2 min-w-0">
                                        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-pixel text-xs text-subtle">
                                            <span>{c.name}</span>
                                            <span aria-hidden="true">·</span>
                                            <span>{c.minutes}:00</span>
                                            <span aria-hidden="true">·</span>
                                            <span className="inline-flex items-center gap-1">
                                                <Image src="/images/fish.svg" alt="" width={14} height={14} />
                                                Completed
                                            </span>
                                        </p>
                                        <blockquote className="text-sm sm:text-base leading-relaxed text-ink-soft">
                                            <p>{t.quote}</p>
                                        </blockquote>
                                        <figcaption className="text-sm">
                                            <span className="font-semibold text-ink-strong">{t.name}</span>
                                            <span className="text-muted">
                                                {" "}
                                                · {t.role} · {t.tag}
                                            </span>
                                        </figcaption>
                                    </div>
                                </figure>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

const BODIES: Record<TestimonialsVariant, (p: { items: Testimonial[] }) => React.JSX.Element> = {
    postcards: Postcards,
    guestbook: Guestbook,
    cards: Cards,
    log: SessionLog,
};

export default function TestimonialsSection({
    variant = "postcards",
    id = "testimonials",
}: {
    variant?: TestimonialsVariant;
    /** Section id (the dev preview renders several, so each needs its own). */
    id?: string;
}) {
    // Sample quotes never ship: see testimonials-data.ts.
    if (!SHOW_TESTIMONIALS) return null;

    const Body = BODIES[variant];
    return (
        <Section id={id}>
            <SectionHeader>
                <SectionTitle>{TESTIMONIALS_COPY.title}</SectionTitle>
                <SectionSubtitle className="text-center text-balance">{TESTIMONIALS_COPY.subtitle}</SectionSubtitle>
            </SectionHeader>
            <Body items={TESTIMONIALS} />
        </Section>
    );
}
