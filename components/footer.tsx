import Image from "next/image";
import Link from "next/link";
import { FooterSpreadSection } from "@/components/pixel-divider";
import { CONTACT_EMAIL } from "@/lib/site-config";

/*
 * The footer doubles as mobile navigation (the header shows no section links
 * on small screens). "/#…" hrefs work from every page, not just the homepage.
 */
const LINK_GROUPS = [
    {
        heading: "Product",
        links: [
            { label: "Download", href: "/#download" },
            { label: "FAQ", href: "/#faq" },
            { label: "Contact", href: "/#contact" },
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
];

export default function Footer() {
    return (
        <FooterSpreadSection>
            {/* Brand */}
            <div className="relative z-10 flex flex-col items-center md:items-start justify-center gap-4 max-w-[600px] text-center md:text-left">
                <Link href="/" className="flex items-center gap-3 group w-fit">
                    <Image
                        src="/images/logo.png"
                        alt="PAWSE home"
                        width={56}
                        height={54}
                        className="group-hover:scale-110 transition-transform duration-300 ease-in-out"
                    />
                    <span className="font-pixel text-2xl md:text-3xl font-bold text-ink">
                        PAWSE
                    </span>
                </Link>
                <div className="flex flex-col items-center md:items-start gap-1 text-xs md:text-sm tracking-[0.02em] text-ink">
                    <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="w-fit hover:link-underline link-hover-weight"
                    >
                        {CONTACT_EMAIL}
                    </a>
                    <p>© 2026 PAWSE App. All rights reserved.</p>
                </div>
            </div>

            {/* Links */}
            <nav aria-label="Footer" className="relative z-10 flex justify-center gap-12 sm:gap-16 text-center md:text-left">
                {LINK_GROUPS.map((group) => (
                    <div key={group.heading} className="flex flex-col gap-2.5">
                        <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                            {group.heading}
                        </h2>
                        <ul className="flex flex-col gap-2">
                            {group.links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-body-sm text-ink hover:link-underline link-hover-weight"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </FooterSpreadSection>
    );
}
