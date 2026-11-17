import { FooterLink } from "@/components/footer-controls";
import { FooterSpreadSection } from "@/components/pixel-divider";
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

export default function Footer() {
    return (
        <FooterSpreadSection>
            <div className="flex flex-col">
                {/* Top tier: closing statement + 3-column navigation with generous separation */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-20">
                    {/* Left: Editorial closing + direct team email */}
                    <div className="w-full lg:max-w-[340px] flex flex-col items-start">
                        <h2 className="font-pixel text-3xl sm:text-4xl font-semibold text-ink leading-[1.08] tracking-tight">
                            Focus, without the rush.
                        </h2>

                        <p className="mt-3 text-body-sm text-ink-soft leading-relaxed text-pretty">
                            A calm Pomodoro timer for your desktop, with a pixel cat
                            who works alongside you. Free and offline.
                        </p>

                        <FooterLink
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="mt-5 gap-2 font-medium"
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
                        className="w-full lg:w-auto lg:shrink-0 grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-8 sm:gap-x-12 xl:gap-x-16"
                    >
                        {LINK_GROUPS.map((group) => (
                            <div key={group.heading} className="flex flex-col gap-2.5">
                                <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft">
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

                {/* Interactive symmetrical pixel PAWSE wordmark */}
                <div className="mt-16 md:mt-24 mb-5 md:mb-7">
                    <PixelWordmark />
                </div>

                {/* Bottom sub-footer bar */}
                <div className="pt-4 border-t border-ink/14 flex justify-center text-center">
                    <p className="text-caption text-ink-soft">
                        © 2026 PAWSE · Built by meowskrrt. All rights reserved.
                    </p>
                </div>
            </div>
        </FooterSpreadSection>
    );
}
