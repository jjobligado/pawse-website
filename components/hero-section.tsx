"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePlatform } from "@/hooks/use-platform";

export default function HeroSection() {
    const [scrollY, setScrollY] = useState(0);
    const [copied, setCopied] = useState(false);
    const { platform: detectedPlatform, config: platformInfo } = usePlatform();

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrollY(window.scrollY);
                    ticking = false;
                });
                ticking = true;
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleCTAClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (platformInfo.isMobileShare) {
            e.preventDefault();
            const shareUrl = window.location.href;

            // Try native mobile sharing first (AirDrop, device send, messaging)
            if (typeof navigator !== "undefined" && navigator.share) {
                try {
                    await navigator.share({
                        title: "PAWSE — The Coziest Way to Get Things Done",
                        text: "A desktop productivity app combining a focus timer with a virtual companion.",
                        url: shareUrl,
                    });
                    return;
                } catch {
                    // User dismissed share sheet or share failed; fallback to clipboard copy
                }
            }

            // Fallback: copy link to clipboard and show feedback
            try {
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                    await navigator.clipboard.writeText(shareUrl);
                }
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
            } catch {
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
            }
        } else if (platformInfo.href === "#beta") {
            e.preventDefault();
            const betaElement = document.getElementById("beta");
            if (betaElement) {
                betaElement.scrollIntoView({ behavior: "smooth" });
                const emailInput = betaElement.querySelector<HTMLInputElement>("input[type='email']");
                if (emailInput) {
                    emailInput.focus();
                }
            }
        }
    };

    // Clamp parallax offsets so they stay smooth within the hero viewport
    const clampedScroll = Math.min(scrollY, 700);
    const gingerParallax = clampedScroll * -0.09;
    const voidParallax = clampedScroll * -0.05;
    const tuxParallax = clampedScroll * -0.07;
    const showcaseParallax = clampedScroll * -0.03;

    return (
        <section className="relative w-full max-w-[1440px] mx-auto pt-16 pb-16 md:pt-24 md:pb-28 px-6 md:px-10 flex flex-col items-center bg-white">
            {/* Scattered Cats on Left & Right Sides */}
            <div className="pointer-events-none hidden md:block absolute inset-0 max-w-[1320px] mx-auto z-20">
                {/* Left Top Cat (Ginger) */}
                <div
                    style={{ transform: `translate3d(0, ${gingerParallax}px, 0)` }}
                    className="absolute left-2 lg:left-8 top-10 lg:top-12 transition-transform duration-75 ease-out"
                >
                    <div className="animate-cat-pop-1">
                        <div className="animate-cat-float-1">
                            <div className="pointer-events-auto group relative w-[130px] h-[130px] lg:w-[165px] lg:h-[165px] -rotate-6 hover:rotate-0 hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer">
                                {/* Pixel Speech Bubble */}
                                <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-white border-2 border-[#232323] shadow-[2px_2px_0px_0px_#232323] opacity-0 translate-y-2 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-200 whitespace-nowrap z-30">
                                    <span className="font-pixel text-xs font-semibold text-[#232323]">
                                        Let&apos;s sprint! ⚡
                                    </span>
                                </div>
                                <Image
                                    src="/images/orange-cat-56586a.png"
                                    alt="Ginger companion"
                                    width={165}
                                    height={165}
                                    className="w-full h-full object-contain select-none"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Left Bottom Cat (Void) */}
                <div
                    style={{ transform: `translate3d(0, ${voidParallax}px, 0)` }}
                    className="absolute left-8 lg:left-24 top-[250px] lg:top-[280px] transition-transform duration-75 ease-out"
                >
                    <div className="animate-cat-pop-3">
                        <div className="animate-cat-float-2">
                            <div className="pointer-events-auto group relative w-[125px] h-[125px] lg:w-[155px] lg:h-[155px] rotate-6 hover:rotate-0 hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer">
                                {/* Pixel Speech Bubble */}
                                <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-white border-2 border-[#232323] opacity-0 translate-y-2 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-200 whitespace-nowrap shadow-[2px_2px_0px_0px_#232323] z-30">
                                    <span className="font-pixel text-xs font-semibold text-[#232323]">
                                        Deep flow... 🌙
                                    </span>
                                </div>
                                <Image
                                    src="/images/black-cat.png"
                                    alt="Void companion"
                                    width={155}
                                    height={155}
                                    className="w-full h-full object-contain select-none"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Center Cat (Tuxedo) */}
                <div
                    style={{ transform: `translate3d(0, ${tuxParallax}px, 0)` }}
                    className="absolute right-4 lg:right-14 top-[130px] lg:top-[150px] transition-transform duration-75 ease-out"
                >
                    <div className="animate-cat-pop-2">
                        <div className="animate-cat-float-3">
                            <div className="pointer-events-auto group relative w-[140px] h-[140px] lg:w-[175px] lg:h-[175px] rotate-6 hover:rotate-0 hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer">
                                {/* Pixel Speech Bubble */}
                                <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-white border-2 border-[#232323] opacity-0 translate-y-2 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-200 whitespace-nowrap shadow-[2px_2px_0px_0px_#232323] z-30">
                                    <span className="font-pixel text-xs font-semibold text-[#232323]">
                                        purr... 🐾
                                    </span>
                                </div>
                                <Image
                                    src="/images/tuxedo-cat.png"
                                    alt="Tux companion"
                                    width={175}
                                    height={175}
                                    className="w-full h-full object-contain select-none"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Centered Hero Copy & Actions */}
            <div className="relative z-10 w-full flex flex-col items-center gap-6">
                <div className="w-full flex justify-center items-center animate-hero-fade-up-1">
                    <h1 className="font-pixel text-[clamp(1.75rem,6vw,4.25rem)] font-semibold text-[#232323] text-center leading-[1.15]">
                        <span className="block whitespace-nowrap">The Coziest Way</span>
                        <span className="block whitespace-nowrap">
                            to Get Things{" "}
                            <span className="group/done relative inline-block animate-hero-done cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-0.5">
                                Done
                                {/* Pixel Sparkle / Confetti Burst (Suggestion 4) */}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -top-1 left-2 w-2.5 h-2.5 bg-accent border border-[#232323] opacity-0 scale-0 group-hover/done:opacity-100 group-hover/done:scale-100 group-hover/done:-translate-x-4 group-hover/done:-translate-y-4 group-hover/done:rotate-12 transition-all duration-300 ease-out"
                                />
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -top-2 left-1/2 w-2 h-2 bg-companion-ginger border border-[#232323] opacity-0 scale-0 group-hover/done:opacity-100 group-hover/done:scale-100 group-hover/done:translate-x-1 group-hover/done:-translate-y-5 group-hover/done:-rotate-12 transition-all duration-300 delay-75 ease-out"
                                />
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute top-0 right-1 w-3 h-3 bg-companion-tux border border-[#232323] opacity-0 scale-0 group-hover/done:opacity-100 group-hover/done:scale-100 group-hover/done:translate-x-5 group-hover/done:-translate-y-3 group-hover/done:rotate-45 transition-all duration-300 delay-50 ease-out"
                                />
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute bottom-3 -left-1 w-2 h-2 bg-companion-void border border-[#232323] opacity-0 scale-0 group-hover/done:opacity-100 group-hover/done:scale-100 group-hover/done:-translate-x-5 group-hover/done:translate-y-1 transition-all duration-300 delay-100 ease-out"
                                />
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute bottom-2 -right-1 w-2 h-2 bg-accent-highlight border border-[#232323] opacity-0 scale-0 group-hover/done:opacity-100 group-hover/done:scale-100 group-hover/done:translate-x-5 group-hover/done:translate-y-2 group-hover/done:-rotate-12 transition-all duration-300 delay-75 ease-out"
                                />
                                <span
                                    aria-hidden="true"
                                    className="absolute left-[1%] right-[1%] bottom-[0.06em] h-[3px] md:h-[5px] bg-accent animate-hero-done-line"
                                />
                            </span>
                        </span>
                    </h1>
                </div>

                {/* Subtitle */}
                <div className="w-full flex justify-center items-center px-4 animate-hero-fade-up-2">
                    <p className="max-w-[620px] text-base md:text-lg text-[#5F5F5F] text-center tracking-[0.01em] leading-relaxed">
                        A desktop productivity app combining a focus timer with a virtual
                        companion. Built for students, professionals, and cat lovers.
                    </p>
                </div>

                {/* Download Options */}
                <div className="w-full pt-2 flex flex-col justify-center items-center gap-3.5 animate-hero-fade-up-3">
                    <Link
                        href={platformInfo.href}
                        download={platformInfo.fileName}
                        onClick={handleCTAClick}
                        data-os={detectedPlatform}
                        className={`group flex items-center justify-center gap-2 py-2.5 px-7 rounded-[50px] shadow-[0px_0px_24px_0px_rgba(53,166,241,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0px_8px_30px_0px_rgba(53,166,241,0.45)] active:translate-y-0 active:scale-[0.97] active:shadow-[0px_2px_14px_0px_rgba(53,166,241,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer ${
                            copied
                                ? "bg-[#10B981] hover:bg-[#059669]"
                                : "bg-accent hover:bg-[#2394DF] active:bg-[#1B7FBE]"
                        }`}
                    >
                        {copied ? (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        ) : platformInfo.iconType === "share" ? (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            >
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" y1="2" x2="12" y2="15" />
                            </svg>
                        ) : platformInfo.iconType === "bell" ? (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white transition-transform duration-200 ease-out group-hover:rotate-12"
                            >
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        ) : (
                            <Image
                                src="/images/download-icon.svg"
                                alt=""
                                width={20}
                                height={20}
                                className="transition-transform duration-200 ease-out group-hover:translate-y-0.5"
                            />
                        )}
                        <span className="font-pixel text-lg md:text-xl font-medium text-white">
                            {copied ? "Link Copied to Clipboard! 🐾" : platformInfo.label}
                        </span>
                    </Link>

                    {/* Secondary Contextual Meta-Row */}
                    <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs md:text-sm text-[#5F5F5F] tracking-[0.02em]">
                        {/* Alternative Platform Override Link / Status */}
                        {platformInfo.altPlatformFile ? (
                            <a
                                href={platformInfo.altPlatformFile}
                                download={platformInfo.altPlatformFile.split("/").pop()}
                                className="hover:text-[#232323] transition-colors underline decoration-1 decoration-[#C4C4C8] hover:decoration-[#8E8E93] underline-offset-4"
                            >
                                {platformInfo.altPlatformText}
                            </a>
                        ) : platformInfo.altPlatformText ? (
                            <span className="text-[#5F5F5F]">
                                {platformInfo.altPlatformText}
                            </span>
                        ) : null}

                        {platformInfo.altPlatformText && (
                            <span className="w-1 h-1 rounded-full bg-[#C4C4C8]" aria-hidden="true" />
                        )}

                        {/* View on GitHub */}
                        <Link
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-medium hover:text-[#232323] transition-colors group"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                                className="w-4 h-4"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                />
                            </svg>
                            <span className="relative inline-block">
                                View on GitHub
                                <span
                                    aria-hidden="true"
                                    className="absolute left-[2%] right-[2%] -bottom-0.5 h-[1px] bg-[#C4C4C8] group-hover:bg-[#8E8E93] transition-colors"
                                />
                            </span>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                            >
                                <path
                                    d="M5 12H19"
                                    stroke="currentColor"
                                    strokeWidth="2.25"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12 5L19 12L12 19"
                                    stroke="currentColor"
                                    strokeWidth="2.25"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* App Visuals Showcase Container (Peeking at the bottom of the Hero) */}
            <div
                style={{ transform: `translate3d(0, ${showcaseParallax}px, 0)` }}
                className="relative z-10 w-full max-w-[1040px] mt-12 md:mt-16 transition-transform duration-75 ease-out"
            >
                <div className="animate-hero-fade-up-4">
                    <div className="w-full h-[340px] sm:h-[460px] md:h-[540px] rounded-3xl border-2 border-stroke bg-[linear-gradient(180deg,#F8FAFC_0%,#EBF6FF_100%)] shadow-[0px_12px_40px_0px_rgba(0,0,0,0.08)] flex items-center justify-center p-6">
                        <span className="font-pixel text-lg md:text-xl text-[#5F5F5F]/60 select-none">
                            App Visuals Preview
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
