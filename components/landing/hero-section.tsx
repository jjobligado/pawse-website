"use client";

import { useEffect, useRef, useState } from "react";
import { otherDownloads, usePlatform } from "@/hooks/use-platform";
import { useSendToDesktop } from "@/hooks/use-send-to-desktop";
import { buttonClasses, buttonLabelClasses } from "@/components/ui/button";
import SpriteCat from "./sprite-cat";
import { Laptop, SillPlant, SillShadow, WindowFrame, WindowSill, WindowSky, useSkyPhase } from "./hero-scene";
import { CATS, CAT_SIZE, GINGER_SIZE } from "./cats";
import LaptopDesktop from "./laptop-desktop";
import DoneWord from "./done-word";
import { OsIcon } from "./download-options";

// Parallax speed per layer (px of offset per px scrolled), clamped to the hero's range.
const PARALLAX_MAX_SCROLL = 700;
// Positive = lags behind the page (reads as far away); negative = moves ahead (near).
const PARALLAX_SPEED = {
    skyFar: 0.16,
    skyNear: 0.08,
} as const;

/**
 * Desk landing. The laptop follows the scroll at LAND_FOLLOW (1 = perfectly still
 * on screen) until it has been lowered by the section's `--land`, where it rests on
 * the felt mat. LAND_SETTLE is the touch-down dip in px.
 */
const LAND_FOLLOW = 0.9;
const LAND_SETTLE = 3;

/**
 * "Done" sits on the sky, not on white, so it takes a deeper blue per time of
 * day to keep large-text contrast (≥3:1) against the gradient behind it.
 */
const DONE_COLOR = {
    morning: "#1A74AE",
    day: "#1A74AE",
    dusk: "#17679C",
    night: "#1C3F8F",
} as const;

export default function HeroSection() {
    const skyPhase = useSkyPhase();
    const sectionRef = useRef<HTMLElement>(null);
    const laptopParallaxRef = useRef<HTMLDivElement>(null);
    const laptopShadowRef = useRef<HTMLDivElement>(null);
    const skyFarRef = useRef<HTMLDivElement>(null);
    const skyNearRef = useRef<HTMLDivElement>(null);
    const { copied, sendToDesktop } = useSendToDesktop();
    const [platformsOpen, setPlatformsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const platformsTriggerRef = useRef<HTMLButtonElement>(null);
    const {
        platform: detectedPlatform,
        config: platformInfo,
        isMobile,
    } = usePlatform();

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
            [skyFarRef, PARALLAX_SPEED.skyFar],
            [skyNearRef, PARALLAX_SPEED.skyNear],
        ];

        let frame = 0;
        let lastScroll = -1;
        // How far the laptop is lowered onto the desk (the section's --land; 0 on phones).
        let land = 0;
        const readLand = () => {
            const section = sectionRef.current;
            land = section ? parseFloat(getComputedStyle(section).getPropertyValue("--land")) || 0 : 0;
            lastScroll = -1;
        };

        const apply = () => {
            frame = 0;
            const raw = Math.max(window.scrollY, 0);
            if (raw === lastScroll) return;
            lastScroll = raw;
            const scroll = Math.min(raw, PARALLAX_MAX_SCROLL);
            for (const [ref, speed] of layers) {
                if (ref.current) {
                    ref.current.style.transform = `translate3d(0, ${(scroll * speed).toFixed(2)}px, 0)`;
                }
            }

            // Desk landing: the laptop holds its place on screen (drifting up a touch)
            // while the window scrolls away, until the desk rises to meet it.
            const laptop = laptopParallaxRef.current;
            if (!laptop) return;
            const progress = land > 0 ? Math.min(raw / (land / LAND_FOLLOW), 1) : 1;
            // A small dip as it touches down, then back up: the settle.
            const settle =
                progress > 0.88 && progress < 1 ? Math.sin(((progress - 0.88) / 0.12) * Math.PI) * LAND_SETTLE : 0;
            laptop.style.transform = `translate3d(0, ${(land * progress + settle).toFixed(2)}px, 0)`;
            const shadow = laptopShadowRef.current;
            if (shadow) {
                // Contact shadow tightens and darkens as the laptop nears the mat.
                const near = Math.max((progress - 0.55) / 0.45, 0);
                shadow.style.opacity = near.toFixed(3);
                shadow.style.transform = `scaleX(${(1.25 - near * 0.25).toFixed(3)})`;
            }
        };

        const handleScroll = () => {
            if (!frame) frame = window.requestAnimationFrame(apply);
        };
        const handleResize = () => {
            readLand();
            handleScroll();
        };

        readLand();
        apply();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
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
        <section ref={sectionRef} id="hero" data-sky={skyPhase} style={{ "--hero-done-sky": DONE_COLOR[skyPhase] } as React.CSSProperties} className="@container group/sky [--hero-done:var(--color-accent-strong)] sm:[--hero-done:var(--hero-done-sky)] relative w-full pb-14 md:pb-24 flex flex-col items-center bg-white overflow-x-clip [--wm:clamp(16px,calc(9cqw_-_24px),220px)] [--ww:min(1120px,calc(100cqw_-_2*var(--wm)))] [--wt:clamp(10px,1.6cqw,24px)] [--so:clamp(8px,2cqw,32px)] [--lw:calc(var(--ww)*0.8)] lg:[--lw:min(900px,calc(var(--ww)_-_2*clamp(130px,14cqw,200px)))] [--ov:0.22] sm:[--ov:0.17] lg:short:[--ov:0.13] [--sill:22px] sm:[--sill:28px] lg:[--sill:36px] xl:[--sill:42px] [--wb:clamp(20px,5svh,44px)] lg:[--wb:calc(var(--wt)/2)] [--land:0px] sm:[--land:140px] lg:[--land:220px] xl:[--land:260px] lg:short:[--land:180px] motion-reduce:[--land:0px]">
            {/*
              The window hangs on the white wall (the page): a walnut French casement with
              wall space either side, a sill that sticks out past it, and the laptop in
              front, overlapping the window's bottom edge at every size.
              From sm the copy sits inside the glass (both in one grid cell). On phones
              the copy moves out onto the wall above, and the window (panels nearly
              closed) becomes the picture under it, so the text gets full contrast and width.
            */}
            <div className="relative w-[var(--ww)] mt-[var(--wt)] flex flex-col items-center">
                    <div className="relative w-full grid grid-cols-1 grid-rows-[auto_minmax(170px,1fr)] min-h-[calc(100svh_-_64px_-_var(--wt)_-_var(--sill)_-_var(--wb))] sm:grid-rows-1 sm:min-h-0">
                        {/*
                          The window: softened corners and layered shadows (a tight contact
                          shadow, a mid one, and a long soft one falling down the wall), so
                          it sits on the wall instead of looking pasted on.
                        */}
                        <div className="relative col-start-1 row-start-2 sm:row-start-1 overflow-hidden rounded-[6px] sm:rounded-[9px] lg:rounded-[12px] shadow-[0_1px_2px_rgb(40_20_10/0.14),0_6px_12px_-6px_rgb(40_20_10/0.22),0_28px_48px_-24px_rgb(40_20_10/0.42)]">
                            <WindowSky phase={skyPhase} farRef={skyFarRef} nearRef={skyNearRef} />
                            <WindowFrame />
                        </div>

            {/* Centered Hero Copy & Actions */}
            <div className={`relative ${platformsOpen ? "z-[45]" : "z-30"} col-start-1 row-start-1 w-full flex flex-col items-center justify-center gap-6 sm:px-12 md:px-14 pt-6 pb-8 sm:pt-24 lg:short:pt-20 sm:pb-[calc(var(--lw)*var(--ov)_+_48px)] sm:min-h-[calc(100svh_-_64px_-_var(--wt)_-_var(--sill)_-_var(--wb))]`}>
                <div
                    aria-hidden="true"
                    className="hidden sm:block pointer-events-none absolute -z-10 left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[min(1000px,135%)] h-[78%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_255_255/0.62),rgb(255_255_255/0.32)_55%,transparent)] blur-2xl transition-opacity duration-1000 opacity-85 group-data-[sky=night]/sky:opacity-100"
                />
                <div className="w-full flex justify-center items-center">
                    <h1 className="font-pixel text-[clamp(1.8rem,calc(10.7vw_-_5px),2.9rem)] sm:text-display-xl font-semibold text-ink text-center leading-[1.02]">
                        <span className="block whitespace-nowrap animate-hero-headline-1">
                            The Coziest Way
                        </span>
                        <span className="block whitespace-nowrap animate-hero-headline-2">
                            to Get Things{" "}
                            <DoneWord />
                        </span>
                    </h1>
                </div>

                {/* Subtitle */}
                <div className="w-full flex justify-center items-center px-4 animate-hero-fade-up-2">
                    <p className="max-w-[620px] text-base md:text-lg text-muted sm:font-medium sm:text-[#33404D] text-center tracking-[0.01em] leading-relaxed transition-colors duration-1000 sm:group-data-[sky=night]/sky:text-ink">
                        A calm Pomodoro timer for your desktop, with a pixel cat who
                        focuses alongside you. Free to download.
                    </p>
                </div>

                {/* Download Options */}
                <div id="hero-cta" className="sm:relative scroll-mt-24 w-full -mx-6 md:-mx-10 pt-2 flex flex-col justify-center items-center gap-4 animate-hero-fade-up-3">
                    {/* CTA row: Download button with Tux beside it */}
                    <div className="relative w-full max-w-chrome flex items-center justify-center">
                        <div className="relative inline-flex items-center justify-center">
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
                        className="relative flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs md:text-sm text-muted sm:text-[#33404D] tracking-[0.02em] animate-hero-fade-up-3b transition-colors duration-1000 sm:group-data-[sky=night]/sky:text-ink"
                    >
                        {isMobile ? (
                            <span>{platformInfo.altPlatformText}</span>
                        ) : (
                            <div className="relative flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
                            {platformInfo.buildLabel && (
                                <>
                                    <span>{platformInfo.buildLabel}</span>
                                    <span aria-hidden="true">·</span>
                                </>
                            )}
                            <div ref={popoverRef} className="inline-flex items-center">
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
                                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[min(340px,calc(100vw_-_32px))] rounded-card bg-white border-2 border-stroke p-1.5 shadow-elevated z-50 origin-top transition-all duration-200 ease-out ${
                                        platformsOpen
                                            ? "visible opacity-100 translate-y-0 scale-100 pointer-events-auto"
                                            : "invisible opacity-0 -translate-y-1.5 scale-95 pointer-events-none"
                                    }`}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        {otherDownloads(platformInfo.downloadId ?? "windows").map((item) => (
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
                                                        <OsIcon os={item.os} />
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-ink-strong group-hover/item:text-black">
                                                            {item.name}
                                                        </span>
                                                        <span className="text-micro leading-snug text-muted">
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
                            </div>
                        )}
                    </div>
                </div>
            </div>

                    </div>

                {/* The sill, where Ginger naps and Tux has his coffee */}
                <WindowSill className="z-30">
                    {/* Cats from lg, where there's room beside the laptop; smaller screens give the laptop the space */}
                    <div className="hidden lg:block absolute bottom-[calc(100%-20px)] xl:bottom-[calc(100%-22px)] left-[1.5%] animate-cat-hop [animation-delay:0.95s]">
                        <SillShadow />
                        <SpriteCat {...CATS.ginger} className={GINGER_SIZE} />
                    </div>
                    <SillPlant className="hidden xl:block absolute bottom-[calc(100%-14px)] right-[1.5%] w-[64px] h-auto" />
                    <div className="hidden lg:block absolute bottom-[calc(100%-20px)] xl:bottom-[calc(100%-22px)] right-[1.5%] xl:right-[6.5%] animate-cat-hop [animation-delay:1.12s]">
                        <SillShadow />
                        <SpriteCat {...CATS.tux} className={CAT_SIZE} />
                    </div>
                </WindowSill>
            </div>

            {/*
              The visitor's laptop, in the foreground, overlapping the bottom of the window
              and the sill at every size, as seen from the chair.
            */}
            <div
                ref={laptopParallaxRef}
                className="relative z-40 w-[var(--lw)] mt-[calc(var(--lw)*var(--ov)*-1)] will-change-transform"
            >
                <div className="relative animate-hero-laptop">
                    {/* Contact shadow on the mat, revealed as the laptop lands */}
                    <div
                        ref={laptopShadowRef}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-[2%] right-[2%] -bottom-2 sm:-bottom-3 h-4 sm:h-6 rounded-[50%] bg-[rgb(20_30_50/0.32)] blur-[6px] sm:blur-[10px] opacity-0 max-sm:opacity-100 motion-reduce:opacity-100"
                    />
                    <div className="relative z-10">
                        <Laptop>
                            <LaptopDesktop />
                        </Laptop>
                    </div>
                    {/* Note stuck on the bezel: the bridge to How It Works' sticky notes */}
                    <div
                        aria-hidden="true"
                        className="absolute z-20 left-[5%] bottom-[3%] w-[clamp(46px,13%,124px)] aspect-[1/0.92] p-[clamp(4px,1.4%,14px)] -rotate-[5deg] rounded-[2px] bg-[#FFEFA1] shadow-[0_1px_2px_rgb(20_20_20/0.08),0_8px_14px_-6px_rgb(20_20_20/0.25)] font-hand font-bold text-ink leading-none text-[clamp(11px,2.2cqw,25px)]"
                    >
                        how it works ↓
                    </div>
                </div>
            </div>

            {/*
              The desk is never drawn as a surface (the white page is the desk). Only
              what rests on it shows: the felt mat in perspective and a mug. Placed so
              the laptop's base meets the mat once it has been lowered by --land.
            */}
            <div
                aria-hidden="true"
                className="relative z-0 w-[min(calc(var(--lw)*1.42),calc(100%_-_8px))] h-[calc(var(--lw)*0.2)] mt-[calc(var(--land)_-_var(--lw)*0.12)] pointer-events-none select-none [perspective:calc(var(--lw)*1.5)]"
            >
                <div className="absolute inset-x-0 bottom-0 h-[calc(var(--lw)*0.5)] origin-bottom [transform:rotateX(64deg)] rounded-[clamp(14px,3cqw,32px)] bg-[#E8F1F8] shadow-[0_2px_0_rgb(20_20_20/0.04)]">
                    <div className="absolute inset-[clamp(6px,1.2cqw,16px)] rounded-[clamp(10px,2.2cqw,22px)] border-2 border-dashed border-ink/[0.13]" />
                </div>
                {/* Mug, upright on the mat to the right of the laptop */}
                <div className="hidden lg:block absolute right-[3%] bottom-[22%] w-[calc(var(--lw)*0.075)] aspect-[0.86] rounded-[6px_6px_16px_16px] bg-white shadow-[inset_-10px_0_0_rgb(0_0_0/0.04),0_0_0_1px_rgb(0_0_0/0.06),0_10px_12px_-8px_rgb(20_30_50/0.3)]">
                    <div className="absolute inset-x-0 top-0 h-[12%] rounded-[50%] bg-[#7A5338] shadow-[0_0_0_3px_#fff]" />
                    <div className="absolute -right-[34%] top-[22%] w-[40%] h-[46%] rounded-r-[18px] border-[7px] border-l-0 border-white [filter:drop-shadow(1px_0_0_rgb(0_0_0/0.1))_drop-shadow(0_0_0.5px_rgb(0_0_0/0.15))]" />
                </div>
            </div>
        </section>
    );
}
