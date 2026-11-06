"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePlatform } from "@/hooks/use-platform";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const { platform: detectedPlatform, config: platformInfo } = usePlatform();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
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
            className={`sticky top-0 z-50 w-full h-[64px] bg-white/95 backdrop-blur-sm border-b-2 transition-colors duration-200 ${
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

                {/* Charcoal Download Button */}
                <Link
                    suppressHydrationWarning
                    href={platformInfo.href}
                    download={platformInfo.fileName}
                    onClick={handleDownloadClick}
                    data-os={detectedPlatform}
                    className="group h-[38px] sm:h-[40px] flex items-center justify-center px-4 sm:px-6 rounded-full bg-[#232323] hover:bg-black text-white shadow-sm hover:shadow transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
                >
                    <span className="font-pixel text-sm sm:text-[17px] font-medium tracking-wide leading-none">
                        Download
                    </span>
                </Link>
            </div>
        </header>
    );
}
