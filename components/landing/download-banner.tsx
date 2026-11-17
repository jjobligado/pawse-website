"use client";

import Image from "next/image";
import { OS_LABELS, usePlatform, type DesktopOs } from "@/hooks/use-platform";
import { DownloadNote } from "./download-options";
import { useSendToDesktop } from "@/hooks/use-send-to-desktop";
import Section from "./section";
import { SectionTitle } from "./section-heading";
import { buttonClasses, buttonLabelClasses } from "@/components/ui/button";

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
    const { platform, config: platformInfo, downloads, isMobile } = usePlatform();
    const { copied, sendToDesktop } = useSendToDesktop();
    // Unknown desktop OSes get the Windows button (see PLATFORM_CONFIG.other), so exclude it here too.
    const primaryOs: DesktopOs = platform === "mac" || platform === "linux" ? platform : "windows";
    const otherOses = (Object.keys(OS_LABELS) as DesktopOs[]).filter((os) => os !== primaryOs);

    return (
        <Section id="download" className="flex flex-col items-stretch">
            <div className="relative overflow-hidden w-full rounded-card-lg border-2 border-stroke surface-sky px-6 py-12 sm:px-12 md:py-16 flex flex-col items-center text-center gap-5">
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

                    {!isMobile && (
                        <p className="text-xs md:text-sm text-muted">
                            <DownloadNote info={platformInfo} />
                        </p>
                    )}

                    {/* Other platforms as plain links (no popover needed this far down) */}
                    <p suppressHydrationWarning className="text-xs md:text-sm text-muted">
                        {isMobile ? (
                            platformInfo.altPlatformText
                        ) : (
                            <>
                                Also available for{" "}
                                {otherOses.map((os, i) => {
                                    const builds = downloads.filter((d) => d.os === os);
                                    return (
                                        <span key={os}>
                                            {i > 0 && (i === otherOses.length - 1 ? " and " : ", ")}
                                            {builds.length === 1 ? (
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
        </Section>
    );
}
