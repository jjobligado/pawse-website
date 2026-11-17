"use client";

import { useEffect, useRef, useState } from "react";
import TimerWindow, { type TimerCat, type TimerMode, type TimerPart } from "@/components/app-ui/timer-window";

/**
 * Focus section media: the app's timer window at its real size, looping (17s).
 *
 *    0.0  Tux (Classic)                 slides right to left on its own
 *    1.8  → Ginger (Sprint)
 *    3.6  → Void (Focused)
 *    4.7  the cursor comes in from the right: Resize → Select Mode → Cat Only;
 *         it steps off while the window shrinks, then comes back in (hover)
 *    9.4  Restore → full window; Resize → Timer Only; it steps off, the
 *         window shrinks, it comes back in to Restore → full window
 *   14.9  the cursor leaves to the right
 *   15.4  Void slides on, right to left, to a second Tux at the end of the
 *         track; when the loop restarts the track jumps back to the first
 *         Tux unseen (they look identical), so it reads as one endless loop
 *
 * Every mode change has a visible cause, as in the app (a mini window only
 * returns to full size through Restore).
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

const LOOP_MS = 17_000;
const SLIDE_MS = 800;
const STAGE_H = 480;

// The window's size per mode (timer-window: .at-win, .is-cat, .is-timer)
const SIZE: Record<TimerMode, { w: number; h: number }> = {
    default: { w: 294, h: 422 },
    cat: { w: 224, h: 232 },
    timer: { w: 224, h: 92 },
};

// Click targets, from the window's top-left in its final layout
const TARGET: Record<TimerPart, { x: number; y: number }> = {
    resize: { x: 237, y: 20 }, // title bar, between Minimize and Home
    "timer-only": { x: 147, y: 205 }, // Select Mode's first button
    "cat-only": { x: 147, y: 247 }, // and its second
    restore: { x: 205, y: 19 }, // top-right corner of a mini window
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
        const target = (part: TimerPart, mode: TimerMode = "default") => onWindow(mode, TARGET[part].x, TARGET[part].y);
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
            [1800, () => set({ index: 1, glide: SLIDE_MS })],
            [3600, () => set({ index: 2 })],

            // Resize → Select Mode → Cat Only
            [4700, () => move(target("resize"), 800)],
            [5550, () => set({ hot: "resize" })],
            [5750, () => press("resize")],
            [5900, () => { release(); set({ hot: null, modal: true }); }],
            [6200, () => move(target("cat-only"), 500)],
            [6750, () => set({ hot: "cat-only" })],
            [6950, () => press("cat-only")],
            [7100, () => { release(); set({ hot: null, modal: false }); move(beside("cat", 40), 500); }],
            // Shrinks only once the cursor is clear of it
            [7550, () => set({ mode: "cat" })],
            // Back over the mini window: hover starts as it crosses the edge
            [8100, () => move(onWindow("cat", 132, 100), 550)],
            [8350, () => set({ hover: true })],

            // Restore (the app's way out of a mini mode) → full window
            [9400, () => move(target("restore", "cat"), 450)],
            [9900, () => set({ hot: "restore" })],
            [10100, () => press("restore")],
            [10250, () => { release(); set({ hot: null, hover: false, mode: "default" }); }],

            // Resize → Select Mode → Timer Only
            [10600, () => move(target("resize"), 500)],
            [11150, () => set({ hot: "resize" })],
            [11350, () => press("resize")],
            [11500, () => { release(); set({ hot: null, modal: true }); }],
            [11800, () => move(target("timer-only"), 450)],
            [12300, () => set({ hot: "timer-only" })],
            [12500, () => press("timer-only")],
            [12650, () => { release(); set({ hot: null, modal: false }); move(beside("timer", 60), 500); }],
            [13100, () => set({ mode: "timer" })],

            // Back in to Restore → full window
            [13500, () => move(target("restore", "timer"), 650)],
            [13900, () => set({ hover: true })],
            [14250, () => set({ hot: "restore" })],
            [14450, () => press("restore")],
            [14600, () => { release(); set({ hot: null, hover: false, mode: "default" }); }],

            // Away, and on to Tux
            [14900, () => move(offStage(380), 700, false)],
            [15400, () => set({ index: 3, glide: SLIDE_MS })],
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
