"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { smoothScrollTo } from "@/lib/smooth-scroll";

/**
 * The PAWSE logo link. From another page it navigates home (ScrollToTop puts
 * the page at the top). On the homepage itself a plain link to "/" does
 * nothing, so it glides back to the top and clears any "#section" from the URL.
 */
export default function HomeLink({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (pathname !== "/") return;
        e.preventDefault();
        smoothScrollTo(document.body, { offset: 0 });
        if (window.location.hash) window.history.pushState(null, "", "/");
    };

    return (
        <Link href="/" onClick={handleClick} className={className}>
            {children}
        </Link>
    );
}
