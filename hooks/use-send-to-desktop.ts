"use client";

import { useCallback, useEffect, useState } from "react";

const SHARE_TITLE = "PAWSE — The Coziest Way to Get Things Done";
const SHARE_TEXT =
    "A calm Pomodoro timer for your desktop, with a pixel cat who focuses alongside you.";

/**
 * "Send to My Desktop" for mobile visitors (PAWSE is desktop-only).
 * Opens the native share sheet when available; otherwise copies the page link.
 * `copied` is true for 2.5s only after a copy actually succeeded.
 */
export function useSendToDesktop() {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timer = setTimeout(() => setCopied(false), 2500);
        return () => clearTimeout(timer);
    }, [copied]);

    const sendToDesktop = useCallback(async () => {
        // Share the page itself, without any #section hash.
        const url = `${window.location.origin}${window.location.pathname}`;

        if (navigator.share) {
            try {
                await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url });
                return;
            } catch (error) {
                // The visitor closed the share sheet: respect that, don't copy instead.
                if (error instanceof DOMException && error.name === "AbortError") return;
                // Any other failure falls through to the clipboard.
            }
        }

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
        } catch {
            // Clipboard unavailable: leave the button as is rather than claim success.
        }
    }, []);

    return { copied, sendToDesktop };
}
