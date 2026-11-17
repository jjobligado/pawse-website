"use client";

import { useEffect, useRef, useState } from "react";
import TimerWindow, { type TimerCat, type TimerMode, type TimerPart } from "@/components/app-ui/timer-window";

/**
 * Focus section media: the app's timer window, looping every 10s.
 *
 *   0.0  Tux (Classic)      the carousel slides by itself, no clicks
 *   1.6  → Ginger (Sprint)
 *   3.2  → Void (Focused)
 *   4.0  the cursor clicks Resize, Select Mode opens, it picks Cat Only
 *   5.6  hovering Cat Only shows its controls
 *   6.6  the window becomes Timer Only (no click, to keep the loop short)
 *   8.0  hover, Restore: back to the full window
 *   8.6  one glide back to Tux, cursor fades; loops at 10.0
 *
 * The clocks tick for real, the cats play their idle loop. The stage is laid
 * out at 400x470 and scaled as one piece (.fd-* in globals.css). The loop
 * runs only while on screen and the tab is visible; with reduced motion it
 * shows Tux's window, still.
 */

const CATS: { id: TimerCat; start: number; fish: number }[] = [
    { id: "tux", start: 18 * 60 + 42, fish: 1 },
    { id: "ginger", start: 9 * 60 + 16, fish: 2 },
    { id: "void", start: 37 * 60 + 5, fish: 1 },
];

const LOOP_MS = 10_000;
const STAGE_W = 400;
// Where the cursor waits, off the window, before it fades in
const CURSOR_HOME = { x: 330, y: 440 };

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
    glide: 450,
    mode: "default",
    hover: false,
    modal: false,
    hot: null,
    down: null,
    sec: 0,
    cursor: { ...CURSOR_HOME, on: false, down: false, ms: 0 },
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
        let visible = false;
        let running = false;

        const set = (patch: Partial<DemoState> | ((p: DemoState) => Partial<DemoState>)) =>
            setS((prev) => ({ ...prev, ...(typeof patch === "function" ? patch(prev) : patch) }));

        // Centre of a named part of Void's window, in stage pixels
        const point = (part: TimerPart) => {
            const el = stage.querySelector<HTMLElement>(`[data-cat="void"] [data-part="${part}"]`);
            const box = stage.getBoundingClientRect();
            if (!el || box.width === 0) return CURSOR_HOME;
            const k = box.width / STAGE_W;
            const r = el.getBoundingClientRect();
            return { x: (r.left + r.width / 2 - box.left) / k, y: (r.top + r.height / 2 - box.top) / k };
        };
        const windowCentre = (dy = 0) => {
            const el = stage.querySelector<HTMLElement>('[data-cat="void"] .at-win');
            const box = stage.getBoundingClientRect();
            if (!el || box.width === 0) return CURSOR_HOME;
            const k = box.width / STAGE_W;
            const r = el.getBoundingClientRect();
            return { x: (r.left + r.width / 2 - box.left) / k + 30, y: (r.top + r.height / 2 - box.top) / k + dy };
        };
        const move = (to: { x: number; y: number }, ms: number, on = true) =>
            set((p) => ({ cursor: { ...p.cursor, ...to, ms, on } }));
        const press = (part: TimerPart) => {
            set((p) => ({ down: part, cursor: { ...p.cursor, down: true } }));
        };
        const release = () => set((p) => ({ down: null, cursor: { ...p.cursor, down: false } }));

        const steps: [number, () => void][] = [
            [0, () => setS(START)],
            [1600, () => set({ index: 1, glide: 450 })],
            [3200, () => set({ index: 2 })],
            [4000, () => move(point("resize"), 550)],
            [4550, () => set({ hot: "resize" })],
            [4650, () => press("resize")],
            [4800, () => { release(); set({ hot: null, modal: true }); }],
            [4950, () => move(point("cat-only"), 300)],
            [5250, () => set({ hot: "cat-only" })],
            [5330, () => press("cat-only")],
            [5450, () => { release(); set({ hot: null, modal: false, mode: "cat" }); }],
            [5850, () => move(windowCentre(), 350)],
            [6050, () => set({ hover: true })],
            [6600, () => { set({ hover: false, mode: "timer" }); move(windowCentre(90), 400); }],
            [7900, () => move(point("restore"), 400)],
            [8050, () => set({ hover: true })],
            [8300, () => set({ hot: "restore" })],
            [8380, () => press("restore")],
            [8500, () => { release(); set({ hot: null, hover: false, mode: "default" }); }],
            [8600, () => { set({ index: 0, glide: 900 }); move(CURSOR_HOME, 600, false); }],
        ];
        for (let t = 1000; t < LOOP_MS; t += 1000) steps.push([t, () => set({ sec: t / 1000 })]);

        const stop = () => {
            timers.forEach((id) => window.clearTimeout(id));
            timers = [];
            running = false;
        };
        const start = () => {
            if (running) return;
            running = true;
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
            className="w-full lg:w-[56%] px-4 py-6 sm:px-12 sm:py-8 rounded-3xl border border-stroke surface-sky shrink-0"
        >
            <div className="fd-frame" aria-hidden="true">
                <div ref={stageRef} className="fd-stage">
                    <div
                        className="fd-track"
                        style={{ transform: `translateX(-${s.index * 360}px)`, ["--fd-glide" as string]: `${s.glide}ms` }}
                    >
                        {CATS.map((cat) => {
                            const isVoid = cat.id === "void";
                            return (
                                <div key={cat.id} data-cat={cat.id} className="fd-slot">
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

                    <span
                        className={`fd-cursor${s.cursor.on ? " is-on" : ""}${s.cursor.down ? " is-down" : ""}`}
                        style={{
                            transform: `translate(${s.cursor.x - 4}px, ${s.cursor.y - 3}px)`,
                            transitionDuration: `${s.cursor.ms}ms, 250ms`,
                        }}
                    >
                        <svg viewBox="0 0 22 22">
                            <path d="M4 3 L4 18 L8 14.2 L10.6 19.6 L13.2 18.4 L10.6 13 L16 13 Z" fill="#141414" stroke="#FFFFFF" strokeWidth="1.4" strokeLinejoin="round" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    );
}
