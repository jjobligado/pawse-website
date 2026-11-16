"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Every page change starts at the very top. Next.js on its own scrolls the
 * page content to the top of the window, which leaves it 64px down (the height
 * of the sticky header above <main>). Links to a section ("/#faq") keep their
 * own scroll position, and the first load keeps the browser's own restore.
 */
export default function ScrollToTop() {
    const pathname = usePathname();
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (window.location.hash) return;
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);

    return null;
}
