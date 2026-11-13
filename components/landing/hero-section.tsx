"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePlatform } from "@/hooks/use-platform";
import { useSendToDesktop } from "@/hooks/use-send-to-desktop";
import { buttonClasses, buttonLabelClasses } from "@/components/ui/button";

// Parallax speed per layer (px of offset per px scrolled), clamped to the hero's range.
const PARALLAX_MAX_SCROLL = 700;
const PARALLAX_SPEED = {
    ginger: -0.09,
    tux: -0.07,
    showcase: -0.03,
} as const;

type CompanionCatId = "ginger" | "tuxedo" | "void";

const CAT_DIALOGUES: Record<CompanionCatId, string[]> = {
    ginger: [
        "Let's sprint! ⚡",
        "Is it snack break yet? 🐟",
        "5-min pawse, then back to work! 🐾",
        "Zoomies incoming! 🚀",
    ],
    tuxedo: [
        "Stay focused. You got this. 🐾",
        "Purrfection takes patience. ✨",
        "One task at a time. 🎩",
        "Deep work in session. ☕",
    ],
    void: [
        "Phase 1: Nap. Phase 2: World domination... 🌙",
        "Do not tap me. You cannot handle my power. 👁️",
        "Plotting world domination... 🐾",
        "The shadows obey my command. ✨",
    ],
};

export default function HeroSection() {
    const gingerParallaxRef = useRef<HTMLDivElement>(null);
    const tuxParallaxRef = useRef<HTMLDivElement>(null);
    const showcaseParallaxRef = useRef<HTMLDivElement>(null);
    const { copied, sendToDesktop } = useSendToDesktop();
    const [platformsOpen, setPlatformsOpen] = useState(false);
    const [activeDialogueCat, setActiveDialogueCat] = useState<CompanionCatId | null>(null);
    const [dialogueIndices, setDialogueIndices] = useState<Record<CompanionCatId, number>>({
        ginger: 0,
        tuxedo: 0,
        void: 0,
    });
    const [bouncingCat, setBouncingCat] = useState<CompanionCatId | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const platformsTriggerRef = useRef<HTMLButtonElement>(null);
    const {
        platform: detectedPlatform,
        config: platformInfo,
        desktopPlatforms,
        isMobile,
    } = usePlatform();

    const handleCatInteract = (cat: CompanionCatId) => {
        setDialogueIndices((prev) => ({
            ...prev,
            [cat]: (prev[cat] + 1) % CAT_DIALOGUES[cat].length,
        }));
        setActiveDialogueCat(cat);
        setBouncingCat(cat);
        setTimeout(() => {
            setBouncingCat((curr) => (curr === cat ? null : curr));
        }, 400);
    };

    useEffect(() => {
        if (!activeDialogueCat) return;

        const timer = setTimeout(() => {
            setActiveDialogueCat(null);
        }, 4500);

        const handleOutsideTap = (e: MouseEvent | TouchEvent) => {
            const target = e.target as HTMLElement | null;
            if (target && !target.closest("[data-companion-cat]")) {
                setActiveDialogueCat(null);
            }
        };

        document.addEventListener("pointerdown", handleOutsideTap);
        return () => {
            clearTimeout(timer);
            document.removeEventListener("pointerdown", handleOutsideTap);
        };
    }, [activeDialogueCat, dialogueIndices]);

    useEffect(() => {
        if (!platformsOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                setPlatformsOpen(false);
            }
        };

        // Escape closes the list and returns focus to the trigger so keyboard users stay oriented.
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setPlatformsOpen(false);
                platformsTriggerRef.current?.focus();
            }
        };

        // Tabbing past the last platform link closes the list.
        const container = popoverRef.current;
        const handleFocusOut = (e: FocusEvent) => {
            if (container && !container.contains(e.relatedTarget as Node | null)) {
                setPlatformsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        container?.addEventListener("focusout", handleFocusOut);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
            container?.removeEventListener("focusout", handleFocusOut);
        };
    }, [platformsOpen]);

    // Parallax writes transforms straight to the DOM via refs, so scrolling never
    // re-renders this component. Updates stop once the hero is scrolled out of range.
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const layers: [React.RefObject<HTMLDivElement | null>, number][] = [
            [gingerParallaxRef, PARALLAX_SPEED.ginger],
            [tuxParallaxRef, PARALLAX_SPEED.tux],
            [showcaseParallaxRef, PARALLAX_SPEED.showcase],
        ];

        let frame = 0;
        let lastScroll = -1;

        const apply = () => {
            frame = 0;
            const scroll = Math.min(window.scrollY, PARALLAX_MAX_SCROLL);
            if (scroll === lastScroll) return;
            lastScroll = scroll;
            for (const [ref, speed] of layers) {
                if (ref.current) {
                    ref.current.style.transform = `translate3d(0, ${(scroll * speed).toFixed(2)}px, 0)`;
                }
            }
        };

        const handleScroll = () => {
            if (!frame) frame = window.requestAnimationFrame(apply);
        };

        apply();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, []);

    const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Mobile visitors can't install a desktop app: share the link to their computer instead.
        if (platformInfo.isMobileShare) {
            e.preventDefault();
            void sendToDesktop();
        }
    };

    return (
        <section id="hero" className="relative w-full max-w-chrome mx-auto pt-36 sm:pt-32 md:pt-24 lg:pt-28 pb-16 md:pb-28 flex flex-col items-center bg-white overflow-x-clip">
            {/* Ginger Companion (Upper Left on all screen sizes, balanced position) */}
            <div
                ref={gingerParallaxRef}
                className="absolute top-14 sm:top-6 md:top-5 lg:top-7 left-3 sm:left-6 md:left-8 lg:left-16 xl:left-24 z-30 pointer-events-auto will-change-transform"
            >
                <div className="animate-cat-intro-ginger">
                    <div className="animate-cat-float-1">
                        <button
                            type="button"
                            data-companion-cat="ginger"
                            onClick={() => handleCatInteract("ginger")}
                            aria-label="Interact with Ginger companion"
                            aria-expanded={activeDialogueCat === "ginger"}
                            className={`group relative w-[104px] h-[104px] sm:w-[124px] sm:h-[124px] md:w-[145px] md:h-[145px] lg:w-[165px] lg:h-[165px] xl:w-[175px] xl:h-[175px] rotate-6 hover:rotate-0 hover:-translate-y-2 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full ${
                                bouncingCat === "ginger" ? "animate-cat-tap" : ""
                            }`}
                        >
                            {/* Pixel Speech Bubble */}
                            <div
                                role="status"
                                aria-live="polite"
                                className={`pointer-events-none absolute -top-10 sm:-top-11 left-0 sm:left-1/2 sm:-translate-x-1/2 px-2.5 sm:px-3 py-1 bg-white border-2 border-ink shadow-pixel whitespace-nowrap select-none z-40 transition-all duration-200 ${
                                    activeDialogueCat === "ginger"
                                        ? "visible opacity-100 translate-y-0 scale-100"
                                        : "invisible opacity-0 translate-y-2 scale-90 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
                                }`}
                            >
                                <span className="font-pixel text-micro sm:text-xs font-semibold text-ink">
                                    {CAT_DIALOGUES.ginger[dialogueIndices.ginger]}
                                </span>
                                <span
                                    aria-hidden="true"
                                    className="absolute -bottom-[5px] left-5 sm:left-1/2 sm:-translate-x-1/2 w-2 h-2 bg-white border-r-2 border-b-2 border-ink rotate-45"
                                />
                            </div>
                            <Image
                                src="/images/orange-cat-56586a.png"
                                alt="Ginger companion"
                                width={175}
                                height={175}
                                unoptimized
                                className="w-full h-full object-contain select-none [image-rendering:pixelated]"
                                priority
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Centered Hero Copy & Actions */}
            <div className="relative z-30 w-full flex flex-col items-center gap-6 px-6 md:px-10">
                <div className="w-full flex justify-center items-center">
                    <h1 className="font-pixel text-[clamp(1.75rem,8vw,2.35rem)] sm:text-display-xl font-semibold text-ink text-center leading-[1.02]">
                        <span className="block whitespace-nowrap animate-hero-headline-1">
                            The Coziest Way
                        </span>
                        <span className="block whitespace-nowrap animate-hero-headline-2">
                            to Get Things{" "}
                            <span className="group/done relative inline-block pr-6 md:pr-8 animate-hero-done cursor-pointer select-none transition-transform duration-200 ease-out hover:-translate-y-0.5 before:absolute before:-inset-y-8 before:-inset-x-6 before:content-['']">
                                <span className="relative inline-block">
                                    Done
                                    <span
                                        aria-hidden="true"
                                        className="absolute left-1 right-1 bottom-[calc(0.06em-5px)] h-[3px] md:h-[5px] bg-accent animate-hero-done-line"
                                    />
                                </span>

                                {/* Fish 1: Orange - Directly over 'D' */}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none select-none absolute z-20 leading-none top-[20%] left-[1%] -translate-x-1/2 -translate-y-[70%] opacity-0 scale-0 group-hover/done:opacity-100 group-hover/done:scale-100 group-hover/done:-translate-y-[95%] group-hover/done:-rotate-20 group-active/done:scale-110 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                                >
                                    <span className="animate-fish-swim-1 block">
                                        <Image
                                            src="/images/completed-orange-fish.png"
                                            alt=""
                                            width={32}
                                            height={32}
                                            className="w-6 h-6 md:w-7 md:h-7 [image-rendering:pixelated] drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] block"
                                        />
                                    </span>
                                </span>

                                {/* Fish 2: Tuxedo - Directly over 'o' */}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none select-none absolute z-20 leading-none top-[32%] left-[24%] -translate-x-1/2 -translate-y-[70%] opacity-0 scale-0 group-hover/done:opacity-100 group-hover/done:scale-100 group-hover/done:-translate-y-[95%] group-hover/done:rotate-15 group-active/done:scale-110 transition-all duration-300 delay-[50ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                                >
                                    <span className="animate-fish-swim-2 block">
                                        <Image
                                            src="/images/completed-tuxedo-fish.png"
                                            alt=""
                                            width={36}
                                            height={36}
                                            className="w-7 h-7 md:w-8 md:h-8 [image-rendering:pixelated] drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] -scale-x-100 block"
                                        />
                                    </span>
                                </span>

                                {/* Fish 3: Black - Right in the center seam between 'o' and 'n' */}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none select-none absolute z-20 leading-none top-[20%] left-[42%] -translate-x-1/2 -translate-y-[70%] opacity-0 scale-0 group-hover/done:opacity-100 group-hover/done:scale-100 group-hover/done:-translate-y-[98%] group-hover/done:rotate-[24deg] group-active/done:scale-110 transition-all duration-300 delay-[25ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                                >
                                    <span className="animate-fish-swim-3 block">
                                        <Image
                                            src="/images/completed-black-fish.png"
                                            alt=""
                                            width={32}
                                            height={32}
                                            className="w-6 h-6 md:w-7 md:h-7 [image-rendering:pixelated] drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] block"
                                        />
                                    </span>
                                </span>

                                {/* Fish 4: Orange - Directly over 'n' */}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none select-none absolute z-20 leading-none top-[34%] left-[60%] -translate-x-1/2 -translate-y-[70%] opacity-0 scale-0 group-hover/done:opacity-100 group-hover/done:scale-100 group-hover/done:-translate-y-[95%] group-hover/done:-rotate-12 group-active/done:scale-110 transition-all duration-300 delay-[80ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                                >
                                    <span className="animate-fish-swim-4 block">
                                        <Image
                                            src="/images/completed-orange-fish.png"
                                            alt=""
                                            width={36}
                                            height={36}
                                            className="w-7 h-7 md:w-8 md:h-8 [image-rendering:pixelated] drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] -scale-x-100 block"
                                        />
                                    </span>
                                </span>

                                {/* Fish 5: Tuxedo - Directly over 'e' */}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none select-none absolute z-20 leading-none top-[22%] left-[82%] -translate-x-1/2 -translate-y-[70%] opacity-0 scale-0 group-hover/done:opacity-100 group-hover/done:scale-100 group-hover/done:-translate-y-[80%] group-hover/done:rotate-8 group-active/done:scale-110 transition-all duration-300 delay-[110ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                                >
                                    <span className="animate-fish-swim-5 block">
                                        <Image
                                            src="/images/completed-tuxedo-fish.png"
                                            alt=""
                                            width={36}
                                            height={36}
                                            className="w-7 h-7 md:w-8 md:h-8 [image-rendering:pixelated] drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] block"
                                        />
                                    </span>
                                </span>
                            </span>
                        </span>
                    </h1>
                </div>

                {/* Subtitle */}
                <div className="w-full flex justify-center items-center px-4 animate-hero-fade-up-2">
                    <p className="max-w-[620px] text-base md:text-lg text-muted text-center tracking-[0.01em] leading-relaxed">
                        A calm Pomodoro timer for your desktop, with a pixel cat who
                        focuses alongside you. Free to download.
                    </p>
                </div>

                {/* Download Options */}
                <div id="hero-cta" className="sm:relative scroll-mt-24 w-full -mx-6 md:-mx-10 pt-2 flex flex-col justify-center items-center gap-4 animate-hero-fade-up-3">
                    {/* Centered CTA Row with Tuxedo Symmetrically Balanced to Ginger */}
                    <div className="relative w-full max-w-chrome flex items-center justify-center">
                        <div className="relative inline-flex items-center justify-center -translate-x-3 sm:translate-x-0">
                            {/* Plain <a>, not next/link: Link prefetches its href as a page, but installers are files */}
                            <a
                                suppressHydrationWarning
                                href={platformInfo.href}
                                download={platformInfo.fileName}
                                onClick={handleCTAClick}
                                data-os={detectedPlatform}
                                className={buttonClasses({
                                    success: copied,
                                    className: "group min-[360px]:px-7 animate-cta-aura",
                                })}
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
                                        aria-hidden="true"
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
                                        aria-hidden="true"
                                        className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    >
                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                        <polyline points="16 6 12 2 8 6" />
                                        <line x1="12" y1="2" x2="12" y2="15" />
                                    </svg>
                                ) : (
                                    // Inline so the icon follows the label color (currentColor)
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                        className="transition-transform duration-200 ease-out group-hover:translate-y-0.5"
                                    >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <path d="M7 10l5 5 5-5" />
                                        <path d="M12 15V3" />
                                    </svg>
                                )}
                                <span className={buttonLabelClasses("lg")}>
                                    {copied ? "Link Copied to Clipboard! 🐾" : platformInfo.label}
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Secondary meta row: other platforms (desktop) or platform note (mobile) */}
                    <div
                        suppressHydrationWarning
                        className="relative flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs md:text-sm text-muted tracking-[0.02em] animate-hero-fade-up-3b"
                    >
                        {isMobile ? (
                            <span>{platformInfo.altPlatformText}</span>
                        ) : (
                            <div ref={popoverRef} className="relative inline-flex items-center">
                                {/* Other Platforms Popover Trigger */}
                                <button
                                    ref={platformsTriggerRef}
                                    type="button"
                                    onClick={() => setPlatformsOpen((prev) => !prev)}
                                    aria-expanded={platformsOpen}
                                    aria-controls="other-platforms-list"
                                    className={`inline-flex items-center gap-1 rounded hover:text-black transition-colors duration-200 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                                        platformsOpen
                                            ? "text-black [-webkit-text-stroke:0.35px_currentColor]"
                                            : ""
                                    }`}
                                >
                                    <span className="transition-colors duration-200 group-hover:[-webkit-text-stroke:0.35px_currentColor]">
                                        {platformInfo.altPlatformText || "Other platforms"}
                                    </span>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                        className={`w-4 h-4 transition-all duration-200 group-hover:text-black group-hover:[stroke-width:1.5px] ${
                                            platformsOpen
                                                ? "rotate-180 text-black [stroke-width:1.5px]"
                                                : ""
                                        }`}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>

                                {/* Floating Other Platforms list (disclosure pattern: plain links, Tab to move) */}
                                <div
                                    id="other-platforms-list"
                                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[300px] sm:w-[320px] rounded-card bg-white border-2 border-stroke p-1.5 shadow-elevated z-50 origin-top transition-all duration-200 ease-out ${
                                        platformsOpen
                                            ? "visible opacity-100 translate-y-0 scale-100 pointer-events-auto"
                                            : "invisible opacity-0 -translate-y-1.5 scale-95 pointer-events-none"
                                    }`}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        {desktopPlatforms.map((item) => (
                                            <a
                                                key={item.id}
                                                href={item.href}
                                                download={item.fileName}
                                                onClick={() => setPlatformsOpen(false)}
                                                className="group/item flex items-center justify-between gap-3 px-3 py-2.5 rounded-control hover:bg-sky-50 active:bg-sky-100 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {/* Platform Icon Badge */}
                                                    <div className="w-8 h-8 rounded-chip bg-control-track group-hover/item:bg-accent-strong text-ink group-hover/item:text-white flex items-center justify-center shrink-0 transition-colors">
                                                        {item.id === "windows" && (
                                                            <svg
                                                                width="15"
                                                                height="15"
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                                aria-hidden="true"
                                                            >
                                                                <path d="M3 3h8.5v8.5H3V3zm9.5 0H21v8.5h-8.5V3zM3 12.5h8.5V21H3v-8.5zm9.5 0H21V21h-8.5v-8.5z" />
                                                            </svg>
                                                        )}
                                                        {item.id === "mac" && (
                                                            <svg
                                                                width="15"
                                                                height="15"
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                                aria-hidden="true"
                                                            >
                                                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.48-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM15.96 6.33c.67-.81 1.12-1.94 1-3.08-.96.04-2.13.64-2.82 1.45-.61.7-.15 1.86-1.01 2.97 1.08.08 2.16-.53 2.83-1.34z" />
                                                            </svg>
                                                        )}
                                                        {item.id === "linux" && (
                                                            <svg
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                                aria-hidden="true"
                                                            >
                                                                <path d="M12 2C9.5 2 8 3.9 8 6.5c0 1.3.4 2.4.9 3.3C7.2 11.4 6 13.7 6 16.2c0 1.4.4 2.6 1.1 3.5-.4.3-.6.7-.6 1.1 0 .7.8 1.2 2 1.2.9 0 1.7-.3 2.1-.8.4.1.9.1 1.4.1s1-.1 1.4-.1c.4.5 1.2.8 2.1.8 1.2 0 2-.5 2-1.2 0-.4-.2-.8-.6-1.1.7-.9 1.1-2.1 1.1-3.5 0-2.5-1.2-4.8-2.9-6.4.5-.9.9-2 .9-3.3C16 3.9 14.5 2 12 2zm-1.5 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-1.5 2.3c1.1 0 2 .5 2 1.1s-.9 1.1-2 1.1-2-.5-2-1.1.9-1.1 2-1.1zm0 3.7c2 0 3.5 1.9 3.5 4.2 0 1.8-1.5 3.3-3.5 3.3s-3.5-1.5-3.5-3.3c0-2.3 1.5-4.2 3.5-4.2z" />
                                                            </svg>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-ink-strong group-hover/item:text-black">
                                                            {item.name}
                                                        </span>
                                                        <span className="text-micro leading-[inherit] text-muted whitespace-nowrap">
                                                            {item.subtitle}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* File Format & Download Action */}
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-muted group-hover/item:text-ink shrink-0 transition-colors">
                                                    {item.extension}
                                                    <svg
                                                        width="13"
                                                        height="13"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.75"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M12 5v14M19 12l-7 7-7-7" />
                                                    </svg>
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tuxedo Companion: placed AFTER the meta row so screen readers hear Download → Other platforms → cat. Visually: on phones it mirrors Ginger in the top-right corner (positioned against the hero copy wrapper: 88px = 144px hero padding - Ginger's 56px offset); from sm up it sits beside the button (top-8 = 8px padding + half of the 48px button). */}
                    <div className="absolute top-[-88px] right-3 sm:top-8 sm:-translate-y-1/2 sm:right-6 md:right-8 lg:right-16 xl:right-24 z-20 pointer-events-auto">
                        <div ref={tuxParallaxRef} className="will-change-transform">
                            <div className="animate-cat-intro-tuxedo">
                                <div className="animate-cat-float-3">
                                    <button
                                        type="button"
                                        data-companion-cat="tuxedo"
                                        onClick={() => handleCatInteract("tuxedo")}
                                        aria-label="Interact with Tuxedo companion"
                                        aria-expanded={activeDialogueCat === "tuxedo"}
                                        className={`group relative w-[104px] h-[104px] sm:w-[124px] sm:h-[124px] md:w-[145px] md:h-[145px] lg:w-[165px] lg:h-[165px] xl:w-[175px] xl:h-[175px] -rotate-6 hover:rotate-0 hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full ${
                                            bouncingCat === "tuxedo" ? "animate-cat-tap" : ""
                                        }`}
                                    >
                                        {/* Pixel Speech Bubble */}
                                        <div
                                            role="status"
                                            aria-live="polite"
                                            className={`pointer-events-none absolute -top-10 sm:-top-11 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto px-2.5 sm:px-3 py-1 bg-white border-2 border-ink shadow-pixel whitespace-nowrap select-none z-40 transition-all duration-200 ${
                                                activeDialogueCat === "tuxedo"
                                                    ? "visible opacity-100 translate-y-0 scale-100"
                                                    : "invisible opacity-0 translate-y-2 scale-90 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
                                            }`}
                                        >
                                            <span className="font-pixel text-micro sm:text-xs font-semibold text-ink">
                                                {CAT_DIALOGUES.tuxedo[dialogueIndices.tuxedo]}
                                            </span>
                                            <span
                                                aria-hidden="true"
                                                className="absolute -bottom-[5px] right-5 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto w-2 h-2 bg-white border-r-2 border-b-2 border-ink rotate-45"
                                            />
                                        </div>
                                        <Image
                                            src="/images/tuxedo-cat.png"
                                            alt="Tuxedo companion"
                                            width={175}
                                            height={175}
                                            unoptimized
                                            className="w-full h-full object-contain select-none [image-rendering:pixelated]"
                                            priority
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* App Visuals Showcase Container (Peeking at the bottom of the Hero) */}
            <div
                ref={showcaseParallaxRef}
                className="relative z-20 w-full max-w-[1040px] mt-32 sm:mt-28 md:mt-28 lg:mt-32 px-6 md:px-10 will-change-transform"
            >
                <div className="relative animate-hero-fade-up-4">
                    {/* Void: perched on the app preview bezel (top-left) */}
                    <div className="absolute -top-[80px] sm:-top-[96px] md:-top-[112px] lg:-top-[128px] xl:-top-[136px] left-6 sm:left-10 md:left-16 lg:left-24 z-30 pointer-events-auto">
                        <div className="animate-cat-intro-void">
                            <div className="animate-cat-perch-3">
                                <button
                                    type="button"
                                    data-companion-cat="void"
                                    onClick={() => handleCatInteract("void")}
                                    aria-label="Interact with Void companion"
                                    aria-expanded={activeDialogueCat === "void"}
                                    className={`group relative w-[104px] h-[104px] sm:w-[124px] sm:h-[124px] md:w-[145px] md:h-[145px] lg:w-[165px] lg:h-[165px] xl:w-[175px] xl:h-[175px] active:scale-95 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full ${
                                        bouncingCat === "void" ? "animate-cat-tap" : ""
                                    }`}
                                >
                                    {/* Pixel Speech Bubble */}
                                    <div
                                        role="status"
                                        aria-live="polite"
                                        className={`pointer-events-none absolute -top-10 sm:-top-11 left-0 sm:left-1/2 sm:-translate-x-1/2 px-2.5 sm:px-3 py-1 bg-white border-2 border-ink shadow-pixel whitespace-nowrap select-none z-40 transition-all duration-200 ${
                                            activeDialogueCat === "void"
                                                ? "visible opacity-100 translate-y-0 scale-100"
                                                : "invisible opacity-0 translate-y-2 scale-90 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
                                        }`}
                                    >
                                        <span className="font-pixel text-micro sm:text-xs font-semibold text-ink">
                                            {CAT_DIALOGUES.void[dialogueIndices.void]}
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="absolute -bottom-[5px] left-5 sm:left-1/2 sm:-translate-x-1/2 w-2 h-2 bg-white border-r-2 border-b-2 border-ink rotate-45"
                                        />
                                    </div>
                                    <Image
                                        src="/images/black-cat.png"
                                        alt="Void companion"
                                        width={175}
                                        height={175}
                                        unoptimized
                                        className="w-full h-full object-contain select-none [image-rendering:pixelated]"
                                        priority
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-[340px] sm:h-[460px] md:h-[540px] rounded-card-lg border-2 border-stroke surface-wash shadow-raised flex items-center justify-center p-6">
                        <span className="font-pixel text-lg md:text-xl text-muted/60 select-none">
                            App Visuals Preview
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
