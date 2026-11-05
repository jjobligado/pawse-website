"use client";

import { useSyncExternalStore } from "react";

export type DetectedPlatform = "windows" | "mac" | "linux" | "mobile" | "other";

export interface DesktopPlatformOption {
    id: "windows" | "mac" | "linux";
    name: string;
    subtitle: string;
    extension: string;
    fileName: string;
    href: string;
}

export interface PlatformDownloadInfo {
    label: string;
    fileName?: string;
    href: string;
    isDownload: boolean;
    isMobileShare?: boolean;
    altPlatformText?: string;
    altPlatformFile?: string;
    iconType: "download" | "share" | "bell";
}

export const DESKTOP_PLATFORMS: DesktopPlatformOption[] = [
    {
        id: "windows",
        name: "Windows",
        subtitle: "Windows 10 & 11 (64-bit)",
        extension: ".exe",
        fileName: "pawse-setup.exe",
        href: "/downloads/pawse-setup.exe",
    },
    {
        id: "mac",
        name: "macOS",
        subtitle: "Apple Silicon & Intel",
        extension: ".dmg",
        fileName: "pawse.dmg",
        href: "/downloads/pawse.dmg",
    },
    {
        id: "linux",
        name: "Linux",
        subtitle: "64-bit Linux (x86_64)",
        extension: ".AppImage",
        fileName: "pawse.AppImage",
        href: "/downloads/pawse.AppImage",
    },
];

export const PLATFORM_CONFIG: Record<DetectedPlatform, PlatformDownloadInfo> = {
    windows: {
        label: "Download for Windows",
        fileName: "pawse-setup.exe",
        href: "/downloads/pawse-setup.exe",
        isDownload: true,
        altPlatformText: "Other platforms",
        iconType: "download",
    },
    mac: {
        label: "Download for Mac",
        fileName: "pawse.dmg",
        href: "/downloads/pawse.dmg",
        isDownload: true,
        altPlatformText: "Other platforms",
        iconType: "download",
    },
    linux: {
        label: "Download for Linux",
        fileName: "pawse.AppImage",
        href: "/downloads/pawse.AppImage",
        isDownload: true,
        altPlatformText: "Other platforms",
        iconType: "download",
    },
    mobile: {
        label: "Send to My Desktop",
        href: "#",
        isDownload: false,
        isMobileShare: true,
        altPlatformText: "PAWSE is built for Windows, Mac & Linux",
        iconType: "share",
    },
    other: {
        label: "Download for Windows",
        fileName: "pawse-setup.exe",
        href: "/downloads/pawse-setup.exe",
        isDownload: true,
        altPlatformText: "Other platforms",
        iconType: "download",
    },
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
        desktopPlatforms: DESKTOP_PLATFORMS,
        isMobile: platform === "mobile",
        isDownload: config.isDownload,
    };
}
