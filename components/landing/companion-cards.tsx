"use client";

import { useEffect, useRef, useState } from "react";
import CompanionButton, { type AppCompanion } from "@/components/app-ui/companion-button";

interface CardData {
    companion: AppCompanion;
    /** First pose (1-4), distinct per cat so server and client agree */
    initialPose: number;
    defaultRotation: number;
    zIndexStacked: number;
}

// Same companions, modes and session lengths as the app's picker
const CARDS: CardData[] = [
    {
        companion: { id: "tux", name: "Tux", mode: "Classic", theme: "classic", focusMin: 25, breakMin: 5 },
        initialPose: 1,
        defaultRotation: -6.5,
        zIndexStacked: 10,
    },
    {
        companion: { id: "ginger", name: "Ginger", mode: "Sprint", theme: "sprint", focusMin: 15, breakMin: 3 },
        initialPose: 2,
        defaultRotation: 0,
        zIndexStacked: 30,
    },
    {
        companion: { id: "void", name: "Void", mode: "Focused", theme: "focused", focusMin: 50, breakMin: 10 },
        initialPose: 3,
        defaultRotation: 6.5,
        zIndexStacked: 20,
    },
];

export default function CompanionCards() {
    const containerRef = useRef<HTMLDivElement>(null);
    const tuxSlotRef = useRef<HTMLDivElement>(null);
    const gingerSlotRef = useRef<HTMLDivElement>(null);
    const voidSlotRef = useRef<HTMLDivElement>(null);

    const [isTriggered, setIsTriggered] = useState(false);
    // Like the app: pick a companion and its button stays selected
    const [selectedId, setSelectedId] = useState<AppCompanion["id"] | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Initial estimate before measurement: ~330px card + 16px gap
    const [offsets, setOffsets] = useState({
        tuxX: 346,
        tuxY: 0,
        voidX: -346,
        voidY: 0,
    });

    const measureOffsets = () => {
        if (!tuxSlotRef.current || !gingerSlotRef.current || !voidSlotRef.current) return;
        const tuxRect = tuxSlotRef.current.getBoundingClientRect();
        const gingerRect = gingerSlotRef.current.getBoundingClientRect();
        const voidRect = voidSlotRef.current.getBoundingClientRect();

        setOffsets({
            tuxX: gingerRect.left - tuxRect.left,
            tuxY: gingerRect.top - tuxRect.top,
            voidX: gingerRect.left - voidRect.left,
            voidY: gingerRect.top - voidRect.top,
        });
    };

    useEffect(() => {
        // Initial state is resolved in the first animation frame (not synchronously in
        // the effect body) so React doesn't do a cascading re-render on mount.
        // Reduced motion: show the organized row immediately, with no fan-out transition.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const frame = window.requestAnimationFrame(() => setIsTriggered(true));
            return () => window.cancelAnimationFrame(frame);
        }

        const container = containerRef.current;
        if (!container) return;

        const targetSection = container.closest("section") || container;

        // Check if section is already 70% visible on mount (e.g. refreshed while scrolled down)
        const rect = targetSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
        const sectionRatio = rect.height > 0 ? visibleHeight / rect.height : 0;
        const isAlreadyPassed = rect.bottom < windowHeight * 0.4;

        const TRIGGER_DELAY_MS = 300; // 300ms delay
        let delayTimer: NodeJS.Timeout | null = null;

        const triggerAnimation = () => {
            if (delayTimer) return;
            delayTimer = setTimeout(() => {
                setIsTriggered(true);
                observer.disconnect();
            }, TRIGGER_DELAY_MS);
        };

        const cancelDelay = () => {
            if (delayTimer) {
                clearTimeout(delayTimer);
                delayTimer = null;
            }
        };

        // If user has already scrolled past the section on mount, show organized immediately
        if (isAlreadyPassed) {
            const frame = window.requestAnimationFrame(() => setIsTriggered(true));
            return () => window.cancelAnimationFrame(frame);
        }

        const mountFrame = window.requestAnimationFrame(() => {
            setIsMounted(true);
            measureOffsets();
        });

        // If section is already 70% visible on initial load, wait the 300ms delay then fan out
        if (sectionRatio >= 0.7) {
            triggerAnimation();
        }

        // Trigger only when that section is at least 70% visible on the screen
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry) return;
                const ratio = entry.intersectionRatio;
                const viewportRatio = entry.intersectionRect.height / window.innerHeight;

                if (ratio >= 0.7 || viewportRatio >= 0.7) {
                    triggerAnimation();
                } else {
                    cancelDelay();
                }
            },
            {
                threshold: [0.7, 0.75, 0.8, 0.9, 1.0],
            }
        );

        observer.observe(targetSection);

        window.addEventListener("resize", measureOffsets);

        return () => {
            window.cancelAnimationFrame(mountFrame);
            cancelDelay();
            observer.disconnect();
            window.removeEventListener("resize", measureOffsets);
        };
    }, []);

    // Current factor: 1 when stacked, 0 when organized
    const factor = isTriggered ? 0 : 1;

    // Card transform styles
    const getCardStyle = (index: number): React.CSSProperties => {
        const card = CARDS[index];
        let deltaX = 0;
        let deltaY = 0;
        let scale = 1;

        if (index === 0) {
            // Tux
            deltaX = offsets.tuxX * factor;
            deltaY = offsets.tuxY * factor;
            scale = 1 - 0.04 * factor;
        } else if (index === 1) {
            // Ginger
            deltaX = 0;
            deltaY = 0;
            scale = 1 + 0.03 * factor;
        } else if (index === 2) {
            // Void
            deltaX = offsets.voidX * factor;
            deltaY = offsets.voidY * factor;
            scale = 1 - 0.04 * factor;
        }

        const rotation = card.defaultRotation * factor;
        const zIndex = card.zIndexStacked;
        const delay = index === 0 ? "0.05s" : index === 2 ? "0.10s" : "0s";

        return {
            transform: `translate3d(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px, 0) rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
            zIndex,
            willChange: "transform",
            transition: isMounted
                ? `transform 1.15s cubic-bezier(0.2, 1.24, 0.35, 1) ${delay}`
                : "none",
        };
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-[1050px] min-h-[190px] flex flex-col lg:flex-row justify-center items-center gap-3 lg:gap-3.5 py-2"
        >
            {CARDS.map((card, index) => {
                const slotRef =
                    index === 0 ? tuxSlotRef : index === 1 ? gingerSlotRef : voidSlotRef;

                return (
                    <div
                        key={card.companion.id}
                        ref={slotRef}
                        className="relative flex justify-center items-center w-[280px] sm:w-[310px] lg:w-[270px] xl:w-[330px] shrink-0 hover:z-40"
                    >
                        {/* Smooth animated fan-out container */}
                        <div style={getCardStyle(index)} className="w-full">
                            {/* The app's companion button (interactive once the cards have spread out) */}
                            <div className={`w-full select-none ${isTriggered ? "" : "pointer-events-none"}`}>
                                <CompanionButton
                                    companion={card.companion}
                                    initialPose={card.initialPose}
                                    selected={selectedId === card.companion.id}
                                    onSelect={() => setSelectedId(card.companion.id)}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
