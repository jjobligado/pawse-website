"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePlatform } from "@/hooks/use-platform";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { platform: detectedPlatform, config: platformInfo } = usePlatform();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on resize to desktop view
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navLinks = [
        { label: "Companions", href: "#companions" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Coming Soon", href: "#coming-soon" },
        { label: "Contact", href: "#contact" },
    ];

    const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (platformInfo.isMobileShare) {
            e.preventDefault();
            const heroCTA = document.getElementById("hero-cta");
            if (heroCTA) {
                heroCTA.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <header
            className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b-2 transition-colors duration-200 ${
                scrolled ? "border-stroke" : "border-transparent"
            }`}
        >
            <div className="w-full flex py-2.5 px-6 sm:px-12 md:px-14 lg:px-20 max-w-[1440px] mx-auto justify-between items-center">
                {/* Brand / Logo */}
                <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
                    <Image
                        src="/images/logo.png"
                        alt="Pawse Logo"
                        width={34}
                        height={33}
                        className="group-hover:scale-110 transition-transform duration-300 ease-in-out"
                    />
                    <span className="font-pixel text-2xl sm:text-3xl font-bold text-[#232323]">
                        PAWSE
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <nav className="hidden md:flex items-center gap-7 lg:gap-9">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-sm text-[#5F5F5F] tracking-[0.02em] hover:text-black hover:[-webkit-text-stroke:0.35px_currentColor] transition-colors duration-200"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Action Group */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                    {/* Charcoal Download Button */}
                    <Link
                        suppressHydrationWarning
                        href={platformInfo.href}
                        download={platformInfo.fileName}
                        onClick={handleDownloadClick}
                        data-os={detectedPlatform}
                        className="group flex items-center justify-center gap-2 py-1.5 px-4 sm:px-5 rounded-full bg-[#232323] hover:bg-black text-white shadow-sm hover:shadow transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
                    >
                        <Image
                            src="/images/download-icon.svg"
                            alt=""
                            width={14}
                            height={14}
                            className="w-3.5 h-3.5 text-white transition-transform duration-200 group-hover:translate-y-0.5"
                        />
                        <span className="font-pixel text-xs sm:text-sm font-medium tracking-wide">
                            Download
                        </span>
                    </Link>

                    {/* Mobile Hamburger Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        aria-label="Toggle navigation menu"
                        aria-expanded={mobileMenuOpen}
                        className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[#232323] hover:bg-[#F3F4F6] transition-colors"
                    >
                        {mobileMenuOpen ? (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        ) : (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="4" y1="7" x2="20" y2="7" />
                                <line x1="4" y1="12" x2="20" y2="12" />
                                <line x1="4" y1="17" x2="20" y2="17" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden w-full border-t border-stroke bg-white/98 px-6 py-4 flex flex-col gap-3.5 shadow-lg animate-fadeIn">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-base text-[#5F5F5F] tracking-[0.02em] hover:text-black hover:[-webkit-text-stroke:0.35px_currentColor] py-1 transition-colors duration-200"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}
