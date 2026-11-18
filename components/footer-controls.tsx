"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { smoothScrollTo } from "@/lib/smooth-scroll";

const FOCUS_RING =
    "rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const LINK_CLASSES =
    `inline-flex items-center min-h-9 md:min-h-0 py-1 md:py-0.5 text-body-sm text-ink hover:text-black transition-colors duration-150 hover:link-underline link-hover-weight ${FOCUS_RING}`;

/**
 * Footer link that smoothly scrolls in place when targeting a section on the
 * current homepage, navigates cleanly from subpages, and renders mailto links
 * as native anchors.
 */
export function FooterLink({
    href,
    children,
    className = "",
}: {
    href: string;
    children: ReactNode;
    className?: string;
}) {
    const pathname = usePathname();
    const classes = `${LINK_CLASSES} ${className}`.trim();

    if (href.startsWith("mailto:")) {
        return (
            <a href={href} className={classes}>
                {children}
            </a>
        );
    }

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (pathname !== "/" || !href.startsWith("/#")) return;
        const id = href.slice(2);
        const target = document.getElementById(id);
        if (target) {
            e.preventDefault();
            smoothScrollTo(target);
            window.history.pushState(null, "", `#${id}`);
        }
    };

    return (
        <Link href={href} onClick={handleClick} className={classes}>
            {children}
        </Link>
    );
}
