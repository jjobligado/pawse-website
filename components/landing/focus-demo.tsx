"use client";

import { useEffect, useRef, useState } from "react";
import TimerWindow, { type TimerCat, type TimerMode, type TimerPart } from "@/components/app-ui/timer-window";

/**
 * Focus section media: the app's timer window at its real size, looping at an
 * unhurried pace (about 23s).
 *
 *    0.0  Tux (Classic)                 slides right to left on its own
 *    3.0  → Ginger (Sprint)
 *    6.5  → Void (Focused)
 *    8.8  the cursor drifts in from the right edge to Resize, clicks;
 *         Select Mode opens; it picks Cat Only
 *   13.0  the cursor steps off the window while it shrinks to Cat Only,
 *         then comes back in: the hover controls show only once it's over it
 *   16.6  it steps off again (hover ends as it leaves); the window settles
 *         into Timer Only; it comes back in to Restore and clicks
 *   20.5  the cursor drifts off the right edge
 *   21.3  Void slides on, right to left, to a second Tux at the end of the
 *         track; when the loop restarts the track jumps back to the first
 *         Tux unseen (they look identical), so it reads as one endless loop
 *
 * Cursor targets are fixed points on the window's final layout (not measured
 * mid-animation), so clicks always land on the button. X and Y move on two
 * layers with different easings, so every move is a soft arc.
 *
 * The clocks tick for real and keep going across loops, so the two Tux windows
 * always match; the cats play their idle loop. The loop runs only while on
 * screen and the tab is visible; with reduced motion it shows Tux, still.
 * Styles: .fd-* and .at-* in globals.css.
 */

const CATS: { id: TimerCat; start: number; fish: number }[] = [
    { id: "tux", start: 18 * 60 + 42, fish: 1 },
    { id: "ginger", start: 9 * 60 + 16, fish: 2 },
    { id: "void", start: 37 * 60 + 5, fish: 1 },
];

const LOOP_MS = 22_800;
const SLIDE_MS = 1000;
const STAGE_H = 480;

// The window's size per mode (timer-window: .at-win, .is-cat, .is-timer)
const SIZE: Record<TimerMode, { w: number; h: number }> = {
    default: { w: 294, h: 422 },
    cat: { w: 224, h: 232 },
    timer: { w: 224, h: 92 },
};

// Click targets, from the window's top-left in its final layout
const TARGET: Record<TimerPart, { x: number; y: number; mode: TimerMode }> = {
    resize: { x: 237, y: 20, mode: "default" }, // title bar, between Minimize and Home
    "cat-only": { x: 147, y: 247, mode: "default" }, // Select Mode's second button
    "timer-only": { x: 147, y: 205, mode: "default" },
    restore: { x: 205, y: 19, mode: "timer" }, // top-right corner of the mini window
};

type Cursor = { x: number; y: number; on: boolean; down: boolean; ms: number };

interface DemoState {
    index: number;
    glide: number;
    mode: TimerMode;
    hover: boolean;
    modal: boolean;
    hot: TimerPart | null;
    down: TimerPart | null;
    sec: number;
    cursor: Cursor;
}

const START: DemoState = {
    index: 0,
    glide: SLIDE_MS,
    mode: "default",
    hover: false,
    modal: false,
    hot: null,
    down: null,
    sec: 0,
    cursor: { x: 9999, y: 300, on: false, down: false, ms: 0 },
};

export default function FocusDemo() {
    const stageRef = useRef<HTMLDivElement>(null);
    const [s, setS] = useState<DemoState>(START);
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        let timers: number[] = [];
        let ticker: number | undefined;
        let visible = false;
        let running = false;

        const set = (patch: Partial<DemoState> | ((p: DemoState) => Partial<DemoState>)) =>
            setS((prev) => ({ ...prev, ...(typeof patch === "function" ? patch(prev) : patch) }));

        // A point on the centred window, in stage pixels (layout width: unaffected by scaling)
        const onWindow = (mode: TimerMode, x: number, y: number) => {
            const { w, h } = SIZE[mode];
            return { x: (stage.offsetWidth - w) / 2 + x, y: (STAGE_H - h) / 2 + y };
        };
        const target = (part: TimerPart) => onWindow(TARGET[part].mode, TARGET[part].x, TARGET[part].y);
        // Just past the right edge of the stage, where the cursor comes from and goes to
        const offStage = (y: number) => ({ x: stage.offsetWidth + 24, y });
        // Beside the window (outside it) in a given mode
        const beside = (mode: TimerMode, dy: number) => onWindow(mode, SIZE[mode].w + 46, SIZE[mode].h / 2 + dy);

        const move = (to: { x: number; y: number }, ms: number, on = true) =>
            set((p) => ({ cursor: { ...p.cursor, ...to, ms, on } }));
        const press = (part: TimerPart) => set((p) => ({ down: part, cursor: { ...p.cursor, down: true } }));
        const release = () => set((p) => ({ down: null, cursor: { ...p.cursor, down: false } }));

        const steps: [number, () => void][] = [
            // Back on the first Tux, instantly; the cursor waits off the right edge
            [0, () => set((p) => ({ index: 0, glide: 0, cursor: { ...p.cursor, ...offStage(330), ms: 0, on: false } }))],
            [3000, () => set({ index: 1, glide: SLIDE_MS })],
            [6500, () => set({ index: 2 })],

            // Resize → Select Mode
            [8800, () => move(target("resize"), 1300)],
            [10300, () => set({ hot: "resize" })],
            [10650, () => press("resize")],
            [10850, () => { release(); set({ hot: null, modal: true }); }],

            // Cat Only
            [11400, () => move(target("cat-only"), 850)],
            [12450, () => set({ hot: "cat-only" })],
            [12750, () => press("cat-only")],
            [12950, () => { release(); set({ hot: null, modal: false }); move(beside("cat", 40), 700); }],
            // Shrinks only once the cursor is clear of it
            [13650, () => set({ mode: "cat" })],
            // Back over the mini window: hover starts as it crosses the edge
            [14300, () => move(onWindow("cat", 132, 100), 900)],
            [14750, () => set({ hover: true })],

            // Off again (hover ends as it leaves), then Timer Only
            [16600, () => move(beside("cat", 110), 800)],
            [17000, () => set({ hover: false })],
            [17400, () => set({ mode: "timer" })],

            // Back in to Restore
            [18300, () => move(target("restore"), 1000)],
            [18900, () => set({ hover: true })],
            [19600, () => set({ hot: "restore" })],
            [19900, () => press("restore")],
            [20100, () => { release(); set({ hot: null, hover: false, mode: "default" }); }],

            // Away, and on to Tux
            [20500, () => move(offStage(380), 1000, false)],
            [21300, () => set({ index: 3, glide: SLIDE_MS })],
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
        const sync = () => {
            const go = visible && !document.hidden && !mq.matches;
            setReduced(mq.matches);
            if (go) start();
            else {
                stop();
                setS(START);
            }
        };

        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            sync();
        });
        io.observe(stage);
        document.addEventListener("visibilitychange", sync);
        mq.addEventListener("change", sync);
        return () => {
            stop();
            io.disconnect();
            document.removeEventListener("visibilitychange", sync);
            mq.removeEventListener("change", sync);
        };
    }, []);

    return (
        <div
            role="img"
            aria-label="The PAWSE timer window cycling through Tux, Ginger and Void mid-session, then switching to the Cat Only and Timer Only mini windows and back"
            className="fd-panel w-full lg:w-[56%] overflow-hidden rounded-3xl border border-stroke surface-sky shrink-0"
        >
            <div className="fd-frame" aria-hidden="true">
                <div ref={stageRef} className="fd-stage">
                    <div
                        className="fd-track"
                        style={{ transform: `translateX(-${s.index * 100}%)`, ["--fd-glide" as string]: `${s.glide}ms` }}
                    >
                        {/* The three cats, then Tux again so the slide from Void keeps going right to left */}
                        {[...CATS, CATS[0]].map((cat, i) => {
                            const isVoid = cat.id === "void";
                            return (
                                <div key={i} data-cat={i < CATS.length ? cat.id : undefined} className="fd-slot">
                                    <TimerWindow
                                        cat={cat.id}
                                        seconds={cat.start - s.sec}
                                        fish={cat.fish}
                                        animate={!reduced}
                                        mode={isVoid ? s.mode : "default"}
                                        hover={isVoid && s.hover}
                                        modalOpen={isVoid && s.modal}
                                        hot={isVoid ? s.hot : null}
                                        down={isVoid ? s.down : null}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* X on the outer layer, Y on the inner one (different easings: an arc) */}
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
