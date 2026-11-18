"use client";

import { useEffect, useRef, useState } from "react";
import TimerWindow, { breakMs, type TimerCat } from "@/components/app-ui/timer-window";

/**
 * Break section media: the same timer window, stage, cursor and pacing as
 * FocusDemo (0.6s slides, ~1s holds), looping (~11.2s). Each cat is clicked
 * once and plays its break animation (Tux grooms, Ginger does zoomies, Void
 * does a shadow poof), then the window slides on, right to left.
 *
 *    0.0  Tux; the cursor comes in from the right and clicks the cat
 *    3.6  → Ginger; the cursor comes back in and clicks
 *    7.1  → Void; clicks
 *   10.0  the cursor leaves to the right
 *   10.5  Void slides on to a second Tux at the end of the track; the loop
 *         restarts on the first Tux unseen (they look identical)
 *
 * The cursor aims at the sprite, measured once the window has settled (it
 * never moves while the cursor travels). Clocks tick for real across loops.
 * Starts at half in view, resets after fully off screen, stops in a hidden
 * tab; with reduced motion it shows Tux, still. Styles: .fd-* and .at-*.
 */

const CATS: { id: TimerCat; start: number; fish: number }[] = [
    { id: "tux", start: 4 * 60 + 42, fish: 1 },
    { id: "ginger", start: 3 * 60 + 16, fish: 2 },
    { id: "void", start: 14 * 60 + 5, fish: 4 },
];

const LOOP_MS = 11_150;
const SLIDE_MS = 600;

type Cursor = { x: number; y: number; on: boolean; down: boolean; ms: number };

interface DemoState {
    index: number;
    glide: number;
    playing: number | null;
    sec: number;
    cursor: Cursor;
}

const START: DemoState = {
    index: 0,
    glide: SLIDE_MS,
    playing: null,
    sec: 0,
    cursor: { x: 9999, y: 300, on: false, down: false, ms: 0 },
};

export default function BreakDemo() {
    const stageRef = useRef<HTMLDivElement>(null);
    const [s, setS] = useState<DemoState>(START);
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        let timers: number[] = [];
        let ticker: number | undefined;
        let running = false;

        const set = (patch: Partial<DemoState> | ((p: DemoState) => Partial<DemoState>)) =>
            setS((prev) => ({ ...prev, ...(typeof patch === "function" ? patch(prev) : patch) }));

        // The cat's middle, measured within its own slot (a slot fills the stage once it
        // has slid in, so this holds even mid-slide); unscaled by the stage's scale
        const onCat = (i: number) => {
            const slot = stage.querySelectorAll<HTMLElement>(".fd-slot")[i];
            const sl = slot.getBoundingClientRect();
            const r = slot.querySelector<HTMLElement>(".at-sprite")!.getBoundingClientRect();
            const k = sl.width / stage.offsetWidth || 1;
            return { x: (r.left + r.width / 2 - sl.left) / k, y: (r.top + r.height / 2 - sl.top) / k };
        };
        const offStage = (y: number) => ({ x: stage.offsetWidth + 24, y });
        // Right of the window, clear of it
        const beside = () => ({ x: stage.offsetWidth / 2 + 147 + 46, y: 280 });

        const move = (to: { x: number; y: number }, ms: number, on = true) =>
            set((p) => ({ cursor: { ...p.cursor, ...to, ms, on } }));
        const press = () => set((p) => ({ cursor: { ...p.cursor, down: true } }));
        const click = (i: number) => set((p) => ({ playing: i, cursor: { ...p.cursor, down: false } }));
        const done = () => set({ playing: null });

        // One cat: come in, click, watch the animation, step aside
        const visit = (i: number, at: number, inMs: number): [number, () => void][] => {
            const end = at + inMs + 250 + breakMs(CATS[i].id);
            return [
                [at, () => move(onCat(i), inMs)],
                [at + inMs + 100, press],
                [at + inMs + 250, () => click(i)],
                [end, done],
            ];
        };

        const steps: [number, () => void][] = [
            [0, () => set((p) => ({ index: 0, glide: 0, playing: null, cursor: { ...p.cursor, ...offStage(330), ms: 0, on: false } }))],

            // Tux (break 1.3s)
            ...visit(0, 600, 800),
            [3050, () => move(beside(), 500)],
            [3600, () => set({ index: 1, glide: SLIDE_MS })],

            // Ginger (break 1.17s)
            ...visit(1, 4500, 500),
            [6450, () => move(beside(), 500)],
            [7100, () => set({ index: 2 })],

            // Void (break 0.91s)
            ...visit(2, 8000, 500),

            // Away, and on to Tux
            [10000, () => move(offStage(380), 700, false)],
            [10500, () => set({ index: 3, glide: SLIDE_MS })],
        ];

        const stop = () => {
            timers.forEach((id) => window.clearTimeout(id));
            timers = [];
            window.clearInterval(ticker);
            running = false;
        };
        const start = () => {
            if (running) return;
            running = true;
            ticker = window.setInterval(() => set((p) => ({ sec: p.sec + 1 })), 1000);
            const loop = () => {
                timers = steps.map(([at, run]) => window.setTimeout(run, at));
                timers.push(window.setTimeout(loop, LOOP_MS));
            };
            loop();
        };
        // Same visibility rules as FocusDemo
        let ratio = 0;
        let resetTimer: number | undefined;
        const reset = () => {
            stop();
            setS(START);
        };
        const sync = () => {
            setReduced(mq.matches);
            if (document.hidden || mq.matches) {
                window.clearTimeout(resetTimer);
                reset();
                return;
            }
            if (ratio >= 0.5) {
                window.clearTimeout(resetTimer);
                start();
            } else if (ratio === 0 && running) {
                window.clearTimeout(resetTimer);
                resetTimer = window.setTimeout(reset, 600);
            } else if (ratio > 0) {
                window.clearTimeout(resetTimer);
            }
        };

        const io = new IntersectionObserver(
            ([entry]) => {
                ratio = entry.isIntersecting ? entry.intersectionRatio : 0;
                sync();
            },
            { threshold: [0, 0.5] },
        );
        io.observe(stage);
        document.addEventListener("visibilitychange", sync);
        mq.addEventListener("change", sync);
        return () => {
            stop();
            window.clearTimeout(resetTimer);
            io.disconnect();
            document.removeEventListener("visibilitychange", sync);
            mq.removeEventListener("change", sync);
        };
    }, []);

    return (
        <div
            role="img"
            aria-label="The PAWSE timer window on a break, cycling through Tux, Ginger and Void; clicking each cat plays its break animation"
            className="fd-panel w-full overflow-hidden rounded-3xl border border-stroke surface-sky"
        >
            <div className="fd-frame" aria-hidden="true">
                <div ref={stageRef} className="fd-stage">
                    <div
                        className="fd-track"
                        style={{ transform: `translateX(-${s.index * 100}%)`, ["--fd-glide" as string]: `${s.glide}ms` }}
                    >
                        {[...CATS, CATS[0]].map((cat, i) => (
                            <div key={i} className="fd-slot">
                                <TimerWindow
                                    cat={cat.id}
                                    seconds={cat.start - s.sec}
                                    fish={cat.fish}
                                    animate={!reduced}
                                    playing={s.playing === i}
                                />
                            </div>
                        ))}
                    </div>

                    <span
                        className={`fd-cursor${s.cursor.on ? " is-on" : ""}${s.cursor.down ? " is-down" : ""}`}
                        style={{ transform: `translateX(${s.cursor.x - 4}px)`, ["--fd-ms" as string]: `${s.cursor.ms}ms` }}
                    >
                        <span className="fd-cursor-y" style={{ transform: `translateY(${s.cursor.y - 3}px)` }}>
                            <svg viewBox="0 0 22 22">
                                <path d="M4 3 L4 18 L8 14.2 L10.6 19.6 L13.2 18.4 L10.6 13 L16 13 Z" fill="#141414" stroke="#FFFFFF" strokeWidth="1.4" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}
