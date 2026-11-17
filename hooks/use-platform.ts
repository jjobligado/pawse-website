"use client";

import { useSyncExternalStore } from "react";

export type DetectedPlatform = "windows" | "mac" | "linux" | "mobile" | "other";

export type DesktopOs = "windows" | "mac" | "linux";

export type DownloadId = "windows" | "mac-arm" | "mac-intel" | "linux-appimage" | "linux-deb";

export interface DesktopDownload {
    id: DownloadId;
    os: DesktopOs;
    name: string;
    subtitle: string;
    /** Tells builds of one OS apart in running text ("Mac (Apple Silicon, Intel)"). */
    short: string;
    extension: string;
    fileName: string;
    href: string;
}

/**
 * Where the installers live. PLACEHOLDER: local paths for now. The backend dev
 * is renaming the release files to version-less names; once they're published
 * on GitHub Releases (educ-jkescritor/Pawse-Releases), point these at
 * `https://github.com/educ-jkescritor/Pawse-Releases/releases/latest/download/<file>`.
 */
const DOWNLOAD_BASE = "/downloads";

function download(d: Omit<DesktopDownload, "href">): DesktopDownload {
    return { ...d, href: `${DOWNLOAD_BASE}/${d.fileName}` };
}

/** Every installer, in the order the "Other platforms" list shows them. */
export const DESKTOP_DOWNLOADS: DesktopDownload[] = [
    download({ id: "windows", short: "Windows", os: "windows", name: "Windows", subtitle: "Windows 10 & 11 (64-bit)", extension: ".exe", fileName: "Pawse-Setup.exe" }),
    download({ id: "mac-arm", short: "Apple Silicon", os: "mac", name: "macOS", subtitle: "Apple Silicon (M1 – M4)", extension: ".dmg", fileName: "Pawse-arm64.dmg" }),
    download({ id: "mac-intel", short: "Intel", os: "mac", name: "macOS", subtitle: "Intel Macs", extension: ".dmg", fileName: "Pawse.dmg" }),
    download({ id: "linux-appimage", short: "AppImage", os: "linux", name: "Linux", subtitle: "Any distro, updates itself", extension: ".AppImage", fileName: "Pawse.AppImage" }),
    download({ id: "linux-deb", short: ".deb", os: "linux", name: "Linux", subtitle: "Ubuntu, Debian & Mint", extension: ".deb", fileName: "pawse_amd64.deb" }),
];

export const OS_LABELS: Record<DesktopOs, string> = { windows: "Windows", mac: "Mac", linux: "Linux" };

export function getDownload(id: DownloadId): DesktopDownload {
    return DESKTOP_DOWNLOADS.find((d) => d.id === id)!;
}

export interface PlatformDownloadInfo {
    label: string;
    fileName?: string;
    href: string;
    isDownload: boolean;
    isMobileShare?: boolean;
    altPlatformText?: string;
    iconType: "download" | "share";
    /** Desktop: the build the main button gives. */
    downloadId?: DownloadId;
    /** Desktop OSes with more than one build: names the one the button gives ("Apple Silicon"). */
    buildLabel?: string;
}

function desktopConfig(label: string, id: DownloadId, buildLabel?: string): PlatformDownloadInfo {
    const d = getDownload(id);
    return {
        label,
        fileName: d.fileName,
        href: d.href,
        isDownload: true,
        altPlatformText: "Other platforms",
        iconType: "download",
        downloadId: id,
        buildLabel,
    };
}

/**
 * Every build except the one the main button gives: the same OS's other build
 * first (Intel Mac, .deb), then the other OSes in list order.
 */
export function otherDownloads(primary: DownloadId): DesktopDownload[] {
    const os = getDownload(primary).os;
    const rest = DESKTOP_DOWNLOADS.filter((d) => d.id !== primary);
    return [...rest.filter((d) => d.os === os), ...rest.filter((d) => d.os !== os)];
}

/**
 * Macs default to Apple Silicon (most Macs since 2020): browsers can't reliably
 * tell the chip (Safari reports every Mac as Intel), so Intel comes first in
 * Other platforms. Linux defaults to the AppImage, which runs anywhere.
 */
export const PLATFORM_CONFIG: Record<DetectedPlatform, PlatformDownloadInfo> = {
    windows: desktopConfig("Download for Windows", "windows"),
    mac: desktopConfig("Download for Mac", "mac-arm", "Apple Silicon"),
    linux: desktopConfig("Download for Linux", "linux-appimage", "AppImage"),
    mobile: {
        label: "Send to My Desktop",
        href: "#",
        isDownload: false,
        isMobileShare: true,
        altPlatformText: "PAWSE is built for Windows, Mac & Linux",
        iconType: "share",
    },
    // Unknown desktop OS: offer Windows, the most likely.
    other: desktopConfig("Download for Windows", "windows"),
};

function getClientPlatform(): DetectedPlatform {
    if (typeof window === "undefined" || !window.navigator) {
        return "windows";
    }

    // QA / Development-only URL override (e.g. ?os=linux, ?os=mac, ?os=mobile)
    // Automatically stripped/inactive outside development
    if (process.env.NODE_ENV === "development") {
        const urlParams = new URLSearchParams(window.location.search);
        const override = urlParams.get("os")?.toLowerCase();
        if (
            override === "linux" ||
            override === "mac" ||
            override === "windows" ||
            override === "mobile"
        ) {
            return override as DetectedPlatform;
        }
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const platform = window.navigator.platform?.toLowerCase() || "";
    const maxTouchPoints = window.navigator.maxTouchPoints || 0;

    const isMobileOrTablet =
        /iphone|ipad|ipod|android|mobile|tablet|silk|blackberry|iemobile|kindle/i.test(ua) ||
        (/mac/i.test(platform) && maxTouchPoints > 1); // iPadOS

    if (isMobileOrTablet) {
        return "mobile";
    }
    if (/macintosh|macintel|macppc|mac68k|darwin/i.test(ua) || /mac/i.test(platform)) {
        return "mac";
    }
    if (/win32|win64|windows|wince/i.test(ua) || /win/i.test(platform)) {
        return "windows";
    }
    if (/linux/i.test(ua) || /linux/i.test(platform)) {
        return "linux";
    }
    return "other";
}

function getServerPlatform(): DetectedPlatform {
    return "windows";
}

let isClientHydrated = false;

function subscribePlatform(onStoreChange: () => void) {
    if (!isClientHydrated) {
        isClientHydrated = true;
        // Notify store after initial hydration finishes to trigger clean client-side platform adoption
        Promise.resolve().then(onStoreChange);
    }
    return () => {};
}

function getClientSnapshot(): DetectedPlatform {
    if (!isClientHydrated) {
        return getServerPlatform();
    }
    return getClientPlatform();
}

/**
 * Custom hook to safely detect operating system & device form-factor across SSR and Client.
 * Also supports ?os=<platform> during local development.
 */
export function usePlatform() {
    const platform = useSyncExternalStore(
        subscribePlatform,
        getClientSnapshot,
        getServerPlatform
    );

    const config = PLATFORM_CONFIG[platform];

    return {
        platform,
        config,
        downloads: DESKTOP_DOWNLOADS,
        isMobile: platform === "mobile",
        isDownload: config.isDownload,
    };
}
