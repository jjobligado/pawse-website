"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * What's on the visitor's laptop in the hero: a desktop with PAWSE running.
 * The focus timer window really counts down, Void reads inside it, and
 * the Progress dashboard sits behind. Interim replica of the app (same design as
 * the timer illustration further down the page) until the exact Figma replicas land.
 *
 * Everything is sized in container-query units (cqw) of the laptop screen, so
 * the whole desktop scales with the laptop like a real screenshot would.
 * Exposed to assistive tech as one labelled image.
 */

const START_SECONDS = 24 * 60 + 49;

function useCountdown(start: number) {
    const [seconds, setSeconds] = useState(start);
    useEffect(() => {
        const id = window.setInterval(() => {
            // Loop back to a full session instead of hitting 00:00 on a long visit.
            setSeconds((s) => (s <= 0 ? 25 * 60 : s - 1));
        }, 1000);
        return () => window.clearInterval(id);
    }, []);
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
}

/** A looping sprite sheet (decorative, not interactive). */
function SpriteLoop({ src, frames, durationMs, className }: { src: string; frames: number; durationMs: number; className?: string }) {
    return (
        <span className={`relative block overflow-hidden ${className ?? ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- pixel strip, must not be resampled */}
            <img
                src={src}
                alt=""
                draggable={false}
                className="absolute left-0 top-0 h-full max-w-none [image-rendering:pixelated] animate-sprite-loop"
                style={{
                    width: `${frames * 100}%`,
                    animationDuration: `${durationMs}ms`,
                    animationTimingFunction: `steps(${frames})`,
                }}
            />
        </span>
    );
}

export default function LaptopDesktop() {
    const time = useCountdown(START_SECONDS);

    return (
        <div
            role="img"
            aria-label="A laptop desktop running PAWSE: the focus timer counting down with Void reading beside it, and the Progress dashboard behind it"
            className="@container absolute inset-0 overflow-hidden bg-[linear-gradient(160deg,#DCEEFF_0%,#EAF4FF_45%,#FCEFE2_100%)] select-none"
        >
            {/* Menu bar */}
            <div className="absolute inset-x-0 top-0 h-[3cqw] flex items-center justify-between px-[1.6cqw] bg-white/55 backdrop-blur-sm text-[1.25cqw] text-ink-soft">
                <span className="flex items-center gap-[0.9cqw]">
                    <Image src="/images/logo.png" alt="" width={20} height={19} className="w-[1.6cqw] h-auto" />
                    <span className="font-semibold text-ink">PAWSE</span>
                    <span>File</span>
                    <span>View</span>
                    <span>Window</span>
                </span>
                <span>Focus · 2 of 4</span>
            </div>

            {/* Progress dashboard window (behind) */}
            <div className="absolute left-[42cqw] top-[7.5cqw] w-[52cqw] rounded-[1cqw] overflow-hidden bg-white shadow-[0_2cqw_4cqw_-1.5cqw_rgb(20_40_70/0.35)] ring-1 ring-black/5">
                <div className="h-[2.4cqw] flex items-center justify-end gap-[0.9cqw] px-[1.2cqw] bg-[#F4F5F7] text-[1.1cqw] text-subtle">
                    <span aria-hidden="true">–</span>
                    <span aria-hidden="true">×</span>
                </div>
                <Image
                    src="/images/dashboard.png"
                    alt=""
                    width={540}
                    height={391}
                    sizes="(min-width: 1280px) 520px, 50vw"
                    className="w-full h-auto"
                />
            </div>

            {/* Focus timer window (front) */}
            <div className="absolute left-[9cqw] top-[6cqw] w-[27cqw] aspect-[292/452] rounded-[1cqw] overflow-hidden bg-mockup-surface shadow-[0_2.5cqw_5cqw_-1.5cqw_rgb(20_40_70/0.45)] ring-1 ring-black/5 flex flex-col">
                <div className="h-[2.4cqw] shrink-0 flex items-center justify-between px-[1.2cqw] bg-white/70 text-[1.1cqw] text-subtle">
                    <span className="font-medium text-ink-soft">Focus</span>
                    <span className="flex gap-[0.9cqw]" aria-hidden="true">
                        <span>–</span>
                        <span>×</span>
                    </span>
                </div>
                <div className="flex-1 flex flex-col items-center pt-[2.4cqw]">
                    <span className="app-clock text-[5.2cqw] leading-none text-ink-strong">{time}</span>
                    <span className="mt-[0.9cqw] flex gap-[0.35cqw]">
                        {[0, 1, 2, 3].map((i) => (
                            <Image
                                key={i}
                                src="/images/fish.svg"
                                alt=""
                                width={25}
                                height={25}
                                className={`w-[2.1cqw] h-auto ${i > 1 ? "grayscale opacity-50" : ""}`}
                            />
                        ))}
                    </span>
                    <SpriteLoop
                        src="/sprites/void-body-focus-sheet.png"
                        frames={5}
                        durationMs={1500}
                        className="mt-[0.6cqw] w-[19.2cqw] h-[19.2cqw]"
                    />
                    {/* Drawn controls: audio, pause, skip */}
                    <span className="mt-auto mb-[2.6cqw] flex items-center gap-[1.5cqw]" aria-hidden="true">
                        <span className="w-[2.9cqw] h-[2.9cqw] rounded-full bg-white border border-mockup-stroke flex items-center justify-center">
                            <Image src="/images/timer-icon-left.svg" alt="" width={16} height={16} className="w-[1.4cqw] h-auto" />
                        </span>
                        <span className="w-[4cqw] h-[4cqw] rounded-full bg-accent flex items-center justify-center">
                            <Image src="/images/timer-icon-center.svg" alt="" width={44} height={45} className="w-full h-auto" />
                        </span>
                        <span className="w-[2.9cqw] h-[2.9cqw] rounded-full bg-white border border-mockup-stroke flex items-center justify-center">
                            <Image src="/images/timer-icon-right.svg" alt="" width={16} height={16} className="w-[1.4cqw] h-auto" />
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}
