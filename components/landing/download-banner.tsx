"use client";

import { useEffect, useRef, useState } from "react";
import { OS_LABELS, otherDownloads, usePlatform, type DesktopOs } from "@/hooks/use-platform";
import { useSendToDesktop } from "@/hooks/use-send-to-desktop";
import Section from "./section";
import { SectionTitle } from "./section-heading";
import { buttonClasses, buttonLabelClasses } from "@/components/ui/button";
import SpriteCat from "./sprite-cat";
import { CATS, CAT_SIZE, GINGER_SIZE } from "./cats";
import { SillPlant, SillShadow, WindowFrame, WindowSill, WindowSky, useSkyPhase } from "./hero-scene";

/** Where each cat sits on the sill (from the bottom of the window). */
const ON_SILL = "absolute bottom-[calc(100%-12px)] sm:bottom-[calc(100%-16px)] lg:bottom-[calc(100%-20px)] xl:bottom-[calc(100%-22px)]";

/**
 * Closing call to action, right after the FAQ: a smaller copy of the hero's
 * window, showing the same sky (the visitor's time of day), with all three
 * companions finally together on the sill. Visitors who scrolled the whole
 * page can download without going back up.
 */
export default function DownloadBanner() {
    const skyPhase = useSkyPhase();
    const { config: platformInfo, isMobile } = usePlatform();
    const { copied, sendToDesktop } = useSendToDesktop();
    // Everything but the button's build, grouped by OS (same OS's other build first).
    const others = otherDownloads(platformInfo.downloadId ?? "windows");
    const otherOses = [...new Set(others.map((d) => d.os))] as DesktopOs[];

    // The cats hop onto the sill when the window scrolls into view, not on page load.
    const sceneRef = useRef<HTMLDivElement>(null);
    const [arrived, setArrived] = useState(false);
    useEffect(() => {
        const el = sceneRef.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setArrived(true);
                    io.disconnect();
                }
            },
            { threshold: 0.35 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);
    const hop = (delay: string) => (arrived ? `animate-cat-hop ${delay}` : "opacity-0");

    // Meta text sits on the sky: a darker ink than `muted` keeps it readable on every phase.
    const metaText = "text-[#33404D] transition-colors duration-1000 group-data-[sky=night]/sky:text-ink";

    return (
        <Section id="download" className="flex flex-col items-stretch">
            <div
                ref={sceneRef}
                data-sky={skyPhase}
                className="@container group/sky relative w-full flex flex-col items-center [--so:clamp(8px,2cqw,32px)]"
            >
                <div className="relative w-[calc(100%_-_2*var(--so))] flex flex-col items-center">
                {/* The window, with the copy on its glass */}
                <div className="relative w-full overflow-hidden rounded-[6px] sm:rounded-[9px] lg:rounded-[12px] shadow-[0_1px_2px_rgb(40_20_10/0.14),0_6px_12px_-6px_rgb(40_20_10/0.22),0_28px_48px_-24px_rgb(40_20_10/0.42)]">
                    <WindowSky phase={skyPhase} entrance={false} />
                    <WindowFrame alwaysOpen />

                    <div className="relative z-10 flex flex-col items-center text-center gap-5 px-8 sm:px-16 pt-14 sm:pt-20 lg:pt-24 pb-28 sm:pb-36 lg:pb-44">
                        {/* Soft light behind the copy, so it reads on every sky */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -z-10 left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[min(900px,130%)] h-[80%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_255_255/0.62),rgb(255_255_255/0.32)_55%,transparent)] blur-2xl opacity-85 transition-opacity duration-1000 group-data-[sky=night]/sky:opacity-100"
                        />

                        <SectionTitle className="text-center text-balance">
                            Ready to Focus with a Friend?
                        </SectionTitle>
                        <p className={`max-w-[480px] text-base md:text-lg sm:font-medium text-balance ${metaText}`}>
                            Free to download. No account needed. Your companions are waiting.
                        </p>

                        <div className="mt-1 flex flex-col items-center gap-3">
                            {isMobile ? (
                                <button
                                    type="button"
                                    onClick={() => void sendToDesktop()}
                                    className={buttonClasses({ success: copied })}
                                >
                                    <span className={buttonLabelClasses("lg")}>
                                        {copied ? "Link Copied to Clipboard! 🐾" : platformInfo.label}
                                    </span>
                                </button>
                            ) : (
                                <a
                                    href={platformInfo.href}
                                    download={platformInfo.fileName}
                                    suppressHydrationWarning
                                    className={buttonClasses()}
                                >
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
                                    <span className={buttonLabelClasses("lg")}>
                                        {platformInfo.label}
                                    </span>
                                </a>
                            )}

                            {/* Other platforms as plain links (no popover needed this far down) */}
                            <p suppressHydrationWarning className={`text-xs md:text-sm text-balance tracking-[0.02em] ${metaText}`}>
                                {isMobile ? (
                                    platformInfo.altPlatformText
                                ) : (
                                    <>
                                        Also available for{" "}
                                        {otherOses.map((os, i) => {
                                            const builds = others.filter((d) => d.os === os);
                                            return (
                                                <span key={os}>
                                                    {i > 0 && (i === otherOses.length - 1 ? " and " : ", ")}
                                                    {builds.length === 1 && builds[0].short === OS_LABELS[os] ? (
                                                        <a href={builds[0].href} download={builds[0].fileName} className="font-medium text-ink link-underline">
                                                            {OS_LABELS[os]}
                                                        </a>
                                                    ) : (
                                                        <>
                                                            {OS_LABELS[os]} (
                                                            {builds.map((d, j) => (
                                                                <span key={d.id}>
                                                                    {j > 0 && ", "}
                                                                    <a href={d.href} download={d.fileName} className="font-medium text-ink link-underline">
                                                                        {d.short}
                                                                    </a>
                                                                </span>
                                                            ))}
                                                            )
                                                        </>
                                                    )}
                                                </span>
                                            );
                                        })}
                                        .
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* The sill, with all three companions together for the first time */}
                <WindowSill className="z-20">
                    <div className={`${ON_SILL} left-[2%] ${hop("[animation-delay:0.05s]")}`}>
                        <SillShadow />
                        <SpriteCat {...CATS.ginger} className={GINGER_SIZE} />
                    </div>
                    <div className={`hidden sm:block ${ON_SILL} left-[17%] lg:left-[15%] ${hop("[animation-delay:0.2s]")}`}>
                        <SillShadow />
                        <SpriteCat {...CATS.void} className={CAT_SIZE} />
                    </div>
                    <SillPlant className="hidden xl:block absolute bottom-[calc(100%-14px)] right-[1.5%] w-[64px] h-auto" />
                    <div className={`${ON_SILL} right-[3%] xl:right-[6.5%] ${hop("[animation-delay:0.35s]")}`}>
                        <SillShadow />
                        <SpriteCat {...CATS.tux} className={CAT_SIZE} />
                    </div>
                </WindowSill>
                </div>
            </div>
        </Section>
    );
}
