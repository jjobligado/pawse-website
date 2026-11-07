"use client";

import Image from "next/image";
import { usePlatform } from "@/hooks/use-platform";
import { useSendToDesktop } from "@/hooks/use-send-to-desktop";
import Section from "./section";
import { SectionTitle } from "./section-heading";

const FACES = [
    { src: "/images/orange-cat-face.png", tilt: "-rotate-6" },
    { src: "/images/tuxedo-cat-face.png", tilt: "-translate-y-1" },
    { src: "/images/black-cat-face.png", tilt: "rotate-6" },
];

/**
 * Closing call to action, right after the FAQ: visitors who scrolled the whole
 * page can download without going back to the hero.
 */
export default function DownloadBanner() {
    const { platform, config: platformInfo, desktopPlatforms, isMobile } = usePlatform();
    const { copied, sendToDesktop } = useSendToDesktop();
    // Unknown desktop OSes get the Windows button (see PLATFORM_CONFIG.other), so exclude it here too.
    const primaryId = platform === "other" ? "windows" : platform;
    const otherPlatforms = desktopPlatforms.filter((p) => p.id !== primaryId);

    return (
        <Section id="download" className="flex flex-col items-stretch">
            <div className="relative overflow-hidden w-full rounded-3xl border-2 border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#D3EDFF_70%,#A8DCFF_100%)] px-6 py-12 sm:px-12 md:py-16 flex flex-col items-center text-center gap-5">
                {/* The three companions, saying goodbye */}
                <div aria-hidden="true" className="flex items-end gap-3">
                    {FACES.map((face) => (
                        <Image
                            key={face.src}
                            src={face.src}
                            alt=""
                            width={60}
                            height={44}
                            unoptimized
                            className={`[image-rendering:pixelated] ${face.tilt}`}
                        />
                    ))}
                </div>

                <SectionTitle className="text-center text-balance">
                    Ready to Focus with a Friend?
                </SectionTitle>
                <p className="max-w-[480px] text-base md:text-lg text-muted text-balance">
                    Free to download. No account needed. Your companions are waiting.
                </p>

                <div className="mt-1 flex flex-col items-center gap-3">
                    {isMobile ? (
                        <button
                            type="button"
                            onClick={() => void sendToDesktop()}
                            className={`flex items-center justify-center gap-2 py-2.5 px-7 rounded-full text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer ${
                                copied
                                    ? "bg-success hover:bg-[#065F46]"
                                    : "bg-accent-strong hover:bg-accent-strong-hover active:bg-accent-strong-active"
                            }`}
                        >
                            <span className="font-pixel text-lg md:text-xl font-semibold">
                                {copied ? "Link Copied to Clipboard! 🐾" : platformInfo.label}
                            </span>
                        </button>
                    ) : (
                        <a
                            href={platformInfo.href}
                            download={platformInfo.fileName}
                            suppressHydrationWarning
                            className="flex items-center justify-center gap-2 py-2.5 px-7 rounded-full bg-accent-strong hover:bg-accent-strong-hover active:bg-accent-strong-active text-white shadow-[0px_4px_18px_0px_rgba(53,166,241,0.28)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
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
                            <span className="font-pixel text-lg md:text-xl font-semibold">
                                {platformInfo.label}
                            </span>
                        </a>
                    )}

                    {/* Other platforms as plain links (no popover needed this far down) */}
                    <p suppressHydrationWarning className="text-xs md:text-sm text-muted">
                        {isMobile ? (
                            platformInfo.altPlatformText
                        ) : (
                            <>
                                Also available for{" "}
                                {otherPlatforms.map((p, i) => (
                                    <span key={p.id}>
                                        {i > 0 && (i === otherPlatforms.length - 1 ? " and " : ", ")}
                                        <a
                                            href={p.href}
                                            download={p.fileName}
                                            className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 hover:decoration-ink"
                                        >
                                            {p.name}
                                        </a>
                                    </span>
                                ))}
                                .
                            </>
                        )}
                    </p>
                </div>
            </div>
        </Section>
    );
}
