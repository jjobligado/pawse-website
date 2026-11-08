"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePlatform } from "@/hooks/use-platform";
import { smoothScrollTo } from "@/lib/smooth-scroll";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("");
    const [isDownloadPressed, setIsDownloadPressed] = useState(false);
    const { platform: detectedPlatform, config: platformInfo } = usePlatform();
    // The header persists across page navigations, so the scrollspy re-binds per page.
    const pathname = usePathname();
    const router = useRouter();
    const isHome = pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Scrollspy: watch EVERY homepage section (not only the linked ones) so the
    // highlight clears while reading sections that have no nav link (Focus, Break,
    // Progress, the hero...) instead of sticking on the last linked one.
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-20% 0px -55% 0px",
                threshold: 0,
            }
        );

        document.querySelectorAll("main section[id]").forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [pathname]);

    // "/#id" so the links also work from About / Privacy / Terms (they go back to the homepage).
    const navLinks = [
        { label: "How It Works", id: "how-it-works" },
        { label: "Companions", id: "companions" },
        { label: "FAQ", id: "faq" },
        { label: "Contact", id: "contact" },
    ];

    const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        setIsDownloadPressed(true);
        window.setTimeout(() => setIsDownloadPressed(false), 180);

        if (platformInfo.isMobileShare) {
            e.preventDefault();
            const heroCTA = document.getElementById("hero-cta");
            if (heroCTA) {
                smoothScrollTo(heroCTA);
            } else {
                // Not on the homepage: go to its download area instead.
                router.push("/#hero-cta");
            }
        }
    };

    // On the homepage, smooth-scroll in place; elsewhere let the link navigate to "/#id".
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        const targetElement = document.getElementById(id);
        if (targetElement) {
            e.preventDefault();
            smoothScrollTo(targetElement);
            window.history.pushState(null, "", `#${id}`);
        }
    };

    return (
        <header
            className={`sticky top-0 z-50 w-full h-[64px] bg-white/85 backdrop-blur-md border-b transition-colors duration-300 ${
                scrolled ? "border-stroke" : "border-transparent"
            }`}
        >
            <div className="w-full h-full flex py-2 px-6 sm:px-12 md:px-14 lg:px-20 max-w-[1440px] mx-auto justify-between items-center">
                {/* Brand / Logo */}
                <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
                    <Image
                        src="/images/logo.png"
                        alt="Pawse Logo"
                        width={30}
                        height={28}
                        className="h-[22px] sm:h-[28px] w-auto object-contain group-hover:scale-110 transition-transform duration-300 ease-in-out"
                        priority
                    />
                    <span className="font-pixel text-2xl sm:text-3xl font-bold text-ink leading-none flex items-center">
                        PAWSE
                    </span>
                </Link>

                {/* Nav Links (Visible on laptops & desktops where space permits) */}
                <nav aria-label="Main" className="hidden lg:flex items-center gap-7 xl:gap-9">
                    {navLinks.map((link) => {
                        const isActive = isHome && activeSection === link.id;
                        return (
                            <Link
                                key={link.id}
                                href={`/#${link.id}`}
                                onClick={(e) => handleNavClick(e, link.id)}
                                aria-current={isActive ? "location" : undefined}
                                className={`text-sm tracking-[0.02em] transition-colors duration-200 ${
                                    isActive
                                        ? "text-black [-webkit-text-stroke:0.35px_currentColor]"
                                        : "text-muted hover:text-black hover:[-webkit-text-stroke:0.35px_currentColor]"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Charcoal Download Button */}
                <Link
                    suppressHydrationWarning
                    href={platformInfo.href}
                    download={platformInfo.fileName}
                    onClick={handleDownloadClick}
                    data-os={detectedPlatform}
                    // Visible text stays "Download"; the accessible name says which file ("Download PAWSE for Windows").
                    aria-label={
                        platformInfo.isMobileShare
                            ? "Download PAWSE"
                            : platformInfo.label.replace("Download", "Download PAWSE")
                    }
                    className={`h-[38px] sm:h-[40px] flex items-center justify-center px-4 sm:px-6 rounded-full text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 cursor-pointer shrink-0 select-none ${
                        isDownloadPressed
                            ? "bg-ink-active"
                            : "bg-ink hover:bg-ink-hover active:bg-ink-active"
                    }`}
                >
                    <span className="font-pixel text-sm sm:text-[17px] font-medium tracking-wide leading-none">
                        Download
                    </span>
                </Link>
            </div>
        </header>
    );
}
