"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePlatform } from "@/hooks/use-platform";
import { smoothScrollTo } from "@/lib/smooth-scroll";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("");
    const [isDownloadPressed, setIsDownloadPressed] = useState(false);
    const { platform: detectedPlatform, config: platformInfo } = usePlatform();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const sectionIds = ["how-it-works", "coming-soon", "contact"];

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

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const navLinks = [
        { label: "How It Works", href: "#how-it-works" },
        { label: "Coming Soon", href: "#coming-soon" },
        { label: "Contact", href: "#contact" },
    ];

    const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        setIsDownloadPressed(true);
        window.setTimeout(() => setIsDownloadPressed(false), 180);

        if (platformInfo.isMobileShare) {
            e.preventDefault();
            const heroCTA = document.getElementById("hero-cta");
            if (heroCTA) {
                smoothScrollTo(heroCTA);
            }
        } else if (
            platformInfo.href === "#beta" ||
            platformInfo.href === "#contact"
        ) {
            e.preventDefault();
            const contactElement =
                document.getElementById("contact") ||
                document.getElementById("beta");
            if (contactElement) {
                smoothScrollTo(contactElement, {
                    onComplete: () => {
                        const emailInput =
                            contactElement.querySelector<HTMLInputElement>(
                                "input[type='email']"
                            );
                        if (emailInput) {
                            emailInput.focus();
                        }
                    },
                });
            }
        }
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#")) {
            const targetId = href.slice(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                smoothScrollTo(targetElement);
                window.history.pushState(null, "", href);
            }
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
                    <span className="font-pixel text-2xl sm:text-3xl font-bold text-[#232323] leading-none flex items-center">
                        PAWSE
                    </span>
                </Link>

                {/* Nav Links (Visible on laptops & desktops where space permits) */}
                <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
                    {navLinks.map((link) => {
                        const isActive = activeSection === link.href.slice(1);
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className={`text-sm tracking-[0.02em] transition-colors duration-200 ${
                                    isActive
                                        ? "text-black [-webkit-text-stroke:0.35px_currentColor]"
                                        : "text-[#5F5F5F] hover:text-black hover:[-webkit-text-stroke:0.35px_currentColor]"
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
                    className={`h-[38px] sm:h-[40px] flex items-center justify-center px-4 sm:px-6 rounded-full text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#232323] focus-visible:ring-offset-2 cursor-pointer shrink-0 select-none ${
                        isDownloadPressed
                            ? "bg-[#111111]"
                            : "bg-[#232323] hover:bg-[#3F3F46] active:bg-[#111111]"
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
