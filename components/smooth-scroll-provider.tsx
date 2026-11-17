"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { setLenis } from "@/lib/smooth-scroll";

/**
 * Inertia scrolling for the whole site: the wheel eases the page toward its
 * target instead of jumping in steps. It still scrolls the real window, so
 * scroll listeners, IntersectionObservers and `position: sticky` keep working.
 * `anchors` sends "#id" links through it (it honours `scroll-mt-*`), and it
 * switches itself off for visitors who prefer reduced motion.
 */
export default function SmoothScrollProvider() {
    useEffect(() => {
        const lenis = new Lenis({
            autoRaf: true,
            lerp: 0.1, // share of the remaining distance covered each frame: lower = floatier
            wheelMultiplier: 0.9,
            anchors: true,
            respectReducedMotion: true,
        });
        setLenis(lenis);
        return () => {
            setLenis(null);
            lenis.destroy();
        };
    }, []);

    return null;
}
