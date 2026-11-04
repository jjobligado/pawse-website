"use client";

import { useSyncExternalStore } from "react";

export type DetectedPlatform = "windows" | "mac" | "linux" | "mobile" | "other";

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

export const PLATFORM_CONFIG: Record<DetectedPlatform, PlatformDownloadInfo> = {
    windows: {
        label: "Download for Windows",
        fileName: "pawse-setup.exe",
        href: "/downloads/pawse-setup.exe",
        isDownload: true,
        altPlatformText: "Also available for macOS",
        altPlatformFile: "/downloads/pawse.dmg",
        iconType: "download",
    },
    mac: {
        label: "Download for Mac",
        fileName: "pawse.dmg",
        href: "/downloads/pawse.dmg",
        isDownload: true,
        altPlatformText: "Also available for Windows",
        altPlatformFile: "/downloads/pawse-setup.exe",
        iconType: "download",
    },
    linux: {
        label: "Notify Me for Linux",
        href: "#beta",
        isDownload: false,
        altPlatformText: "Linux build in progress",
        iconType: "bell",
    },
    mobile: {
        label: "Send to My Desktop",
        href: "#",
        isDownload: false,
        isMobileShare: true,
        altPlatformText: "PAWSE is built for Windows & Mac",
        iconType: "share",
    },
    other: {
        label: "Download for Windows",
        fileName: "pawse-setup.exe",
        href: "/downloads/pawse-setup.exe",
        isDownload: true,
        altPlatformText: "Also available for macOS",
        altPlatformFile: "/downloads/pawse.dmg",
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

function subscribePlatform() {
    return () => {};
}

/**
 * Custom hook to safely detect operating system & device form-factor across SSR and Client.
 * Also supports ?os=<platform> during local development.
 */
export function usePlatform() {
    const platform = useSyncExternalStore(
        subscribePlatform,
        getClientPlatform,
        getServerPlatform
    );

    const config = PLATFORM_CONFIG[platform];

    return {
        platform,
        config,
        isMobile: platform === "mobile",
        isDownload: config.isDownload,
    };
}
