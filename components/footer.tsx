"use client";

import { FooterLink } from "@/components/footer-controls";
import { WindowSky, useSkyPhase } from "@/components/landing/hero-scene";
import PixelWordmark from "@/components/pixel-wordmark";
import { CONTACT_EMAIL } from "@/lib/site-config";

/*
 * The footer doubles as mobile navigation (the header shows no section links
 * on small screens). "/#…" hrefs work from every page, not just the homepage.
 */
const LINK_GROUPS = [
    {
        heading: "Product",
        links: [
            { label: "How It Works", href: "/#how-it-works" },
            { label: "Features", href: "/#companions" },
            { label: "Coming Soon", href: "/#coming-soon" },
            { label: "Download", href: "/#download" },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "About", href: "/about" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
        ],
    },
    {
        heading: "Support",
        links: [
            { label: "FAQ", href: "/#faq" },
            { label: "Contact Us", href: "/#contact" },
        ],
    },
] as const;

/** The sky's top colour for the visitor's time of day (lib/sky-phase.ts), for seamless dithered edges. */
const SKY_TOP = "var(--sky-top)";

function hash01(c: number, r: number): number {
    let h = (Math.imul(c + 1, 374761393) + Math.imul(r + 1, 668265263)) >>> 0;
    h = (h ^ (h >>> 13)) >>> 0;
    h = Math.imul(h, 1274126177) >>> 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

const DITHER_COLS = 76;
const DITHER_DENSITY = [0.12, 0.36, 0.72] as const;
const DITHER_CELLS = DITHER_DENSITY.flatMap((d, r) =>
    Array.from({ length: DITHER_COLS }, (_, c) => (hash01(c, r + 7) < d ? { c, r } : null)).filter(
        (cell): cell is { c: number; r: number } => cell !== null
    )
);

/**
 * Dithered pixel transition from the white page into the sky's top color.
 * The bottom bridge row is 100% solid and bleeds past the SVG edge (-mb-px) so
 * there is never a gap or visible seam above WindowSky.
 */
function DitherEdge() {
    return (
        <svg
            aria-hidden="true"
            viewBox={`0 0 ${DITHER_COLS} ${DITHER_DENSITY.length + 1}`}
            shapeRendering="crispEdges"
            className="relative z-10 -mb-0.5 block w-full transition-colors duration-1000 ease-out"
            style={{ color: SKY_TOP }}
        >
            {DITHER_CELLS.map(({ c, r }) => (
                <rect key={`${c}-${r}`} x={c - 0.02} y={r} width={1.04} height={1.06} fill="currentColor" />
            ))}
            <rect x={0} y={DITHER_DENSITY.length - 0.04} width={DITHER_COLS} height={1.08} fill="currentColor" />
        </svg>
    );
}

/** Full-bleed walnut window sill matching WindowSill in hero-scene.tsx. */
function WalnutSillBand() {
    return (
        <div aria-hidden="true" className="relative w-full">
            <div className="relative h-3.5 sm:h-[18px] lg:h-6 wood-h [--wood:#94634A] shadow-[inset_0_1px_0_rgb(40_20_10/0.25),inset_0_4px_6px_-3px_rgb(40_20_10/0.28)]">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_10%,rgb(255_236_210/0.2))]" />
            </div>
            <div className="h-2 sm:h-2.5 lg:h-3 wood-h [--wood:#6A422C] shadow-[inset_0_1px_0_rgb(255_226_196/0.4),inset_0_-1px_0_rgb(30_14_4/0.55),0_1px_2px_rgb(40_20_10/0.3)]" />
            <div className="h-3 sm:h-4 bg-[linear-gradient(180deg,rgb(40_20_10/0.14),transparent)] pointer-events-none" />
        </div>
    );
}

/** Extra light behind the footer copy, at night only. */
const NIGHT_BACKDROP =
    "hidden in-data-[sky=night]:block pointer-events-none absolute -z-10 -inset-x-16 -inset-y-12 rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_255_255/0.68),rgb(255_255_255/0.42)_58%,transparent)] blur-2xl";

export default function Footer() {
    // The canvas wordmark is drawn in script, so it takes the phase as a value;
    // the markup switches on <html data-sky> in CSS, so it is right from the first paint.
    const skyPhase = useSkyPhase();
    const metaText = "text-[#33404D] in-data-[sky=night]:text-ink";

    return (
        <footer className="w-full flex flex-col bg-white">
            {/* Breathing room above the dithered sky edge */}
            <div className="w-full h-8 md:h-14 bg-white" />

            <DitherEdge />

            {/* Sky stage matching the hero and download banner windows, ending on the walnut sill */}
            <div className="relative w-full overflow-hidden">
                <WindowSky />

                {/* Neutralizes WindowSky's top frame-head shadow so DitherEdge meets the sky seamlessly */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-10 transition-colors duration-1000 ease-out"
                    style={{
                        color: SKY_TOP,
                        background: "linear-gradient(180deg, currentColor 0%, currentColor 25%, transparent 100%)",
                    }}
                />

                <div className="relative z-10 w-full max-w-chrome mx-auto px-6 sm:px-12 md:px-14 lg:px-20 pt-16 md:pt-20 pb-0">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-20">
                        {/* Left: Editorial closing + direct team email */}
                        <div className="relative w-full max-w-[264px] flex flex-col items-start">
                            <div aria-hidden="true" className={NIGHT_BACKDROP} />
                            <h2 className="font-pixel text-3xl sm:text-4xl font-semibold text-ink leading-[1.08] tracking-tight">
                                Focus, without{" "}
                                <br />
                                the rush.
                            </h2>

                            <p className={`mt-3 text-body-sm leading-relaxed text-pretty transition-colors duration-1000 ${metaText}`}>
                                A calm Pomodoro timer for your desktop, with a pixel cat
                                who works alongside you. Free and offline.
                            </p>

                            <FooterLink
                                href={`mailto:${CONTACT_EMAIL}`}
                                className="mt-5 gap-2"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                    className="shrink-0"
                                >
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                <span>{CONTACT_EMAIL}</span>
                            </FooterLink>
                        </div>

                        {/* Right: 3-Column Navigation */}
                        <nav
                            aria-label="Footer"
                            className="relative w-full lg:w-auto lg:shrink-0 grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-8 sm:gap-x-12 xl:gap-x-16"
                        >
                            <div aria-hidden="true" className={NIGHT_BACKDROP} />
                            {LINK_GROUPS.map((group) => (
                                <div key={group.heading} className="flex flex-col gap-2.5">
                                    <h3 className={`text-xs font-semibold uppercase tracking-[0.08em] transition-colors duration-1000 ${metaText}`}>
                                        {group.heading}
                                    </h3>
                                    <ul className="flex flex-col gap-1 md:gap-2">
                                        {group.links.map((link) => (
                                            <li key={link.href}>
                                                <FooterLink href={link.href}>
                                                    {link.label}
                                                </FooterLink>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* Interactive companion-coloured PAWSE wordmark resting on the walnut sill */}
                    <div className="relative z-10 mt-16 md:mt-28">
                        <PixelWordmark phase={skyPhase} />
                    </div>
                </div>
            </div>

            {/* Walnut window sill directly under the sky & PAWSE letters */}
            <div className="relative z-20">
                <WalnutSillBand />
            </div>

            {/* Clean white wall below the sill */}
            <div className="w-full bg-white">
                <div className="w-full max-w-chrome mx-auto px-6 sm:px-12 md:px-14 lg:px-20 pt-2 pb-6 flex justify-center text-center">
                    <p className="text-caption text-ink-soft">
                        © 2026 PAWSE · Built by meowskrrt. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
