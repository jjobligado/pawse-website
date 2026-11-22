"use client";

import { useLayoutEffect } from "react";
import { applySkyPhase } from "@/lib/sky-phase";

/**
 * Keeps <html data-sky> current. The head script sets it before the first
 * paint; this re-applies it before paint after React's development remount
 * (which resets <html> to its JSX attributes) and re-checks once a minute, so
 * a long visit crosses into dusk on its own.
 */
export default function SkyPhaseSync() {
    useLayoutEffect(() => {
        applySkyPhase();
        const id = window.setInterval(applySkyPhase, 60_000);
        return () => window.clearInterval(id);
    }, []);
    return null;
}
