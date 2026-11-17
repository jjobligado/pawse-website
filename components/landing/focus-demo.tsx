"use client";

import { useEffect, useRef, useState } from "react";
import TimerWindow, { type TimerCat, type TimerMode, type TimerPart } from "@/components/app-ui/timer-window";

/**
 * Focus section media: the app's timer window at its real size, looping at an
 * unhurried pace (about 24s).
 *
 *    0.0  Tux (Classic)                 slides right to left on its own
 *    3.0  → Ginger (Sprint)
 *    6.5  → Void (Focused)
 *    9.5  the cursor drifts to Resize, Select Mode opens, it picks Cat Only
 *   14.2  it rests on Cat Only, showing the hover controls
 *   16.7  the window settles into Timer Only (no click)
 *   18.3  hover, Restore: back to the full window; the cursor fades out
 *   21.2  Void slides on, right to left, to a second Tux at the end of the
 *         track; when the loop restarts the track jumps back to the first
 *         Tux unseen (they look identical), so it reads as one endless loop
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

const LOOP_MS = 24_500;
const SLIDE_MS = 1000;

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
    // Off to the lower right, invisible; placed properly once the stage is measured
    cursor: { x: 9999, y: 9999, on: false, down: false, ms: 0 },
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

        // Stage pixels (unscaled) from screen pixels
        const toStage = (x: number, y: number) => {
            const box = stage.getBoundingClientRect();
            const k = box.width / (stage.offsetWidth || 1);
            return { x: (x - box.left) / k, y: (y - box.top) / k };
        };
        const home = () => ({ x: stage.offsetWidth * 0.5 + 190, y: stage.offsetHeight - 30 });
        const point = (part: TimerPart) => {
            const el = stage.querySelector<HTMLElement>(`[data-cat="void"] [data-part="${part}"]`);
            if (!el) return home();
            const r = el.getBoundingClientRect();
            return toStage(r.left + r.width / 2, r.top + r.height / 2);
        };
        const windowPoint = (dx: number, dy: number) => {
            const el = stage.querySelector<HTMLElement>('[data-cat="void"] .at-win');
            if (!el) return home();
            const r = el.getBoundingClientRect();
            const c = toStage(r.left + r.width / 2, r.top + r.height / 2);
            return { x: c.x + dx, y: c.y + dy };
        };
        const move = (to: { x: number; y: number }, ms: number, on = true) =>
            set((p) => ({ cursor: { ...p.cursor, ...to, ms, on } }));
        const press = (part: TimerPart) => set((p) => ({ down: part, cursor: { ...p.cursor, down: true } }));
        const release = () => set((p) => ({ down: null, cursor: { ...p.cursor, down: false } }));

        const steps: [number, () => void][] = [
            // Back on the first Tux, instantly; the cursor waits, unseen, off the window
            [0, () => set((p) => ({ index: 0, glide: 0, cursor: { ...p.cursor, ...home(), ms: 0, on: false } }))],
            [3000, () => set({ index: 1, glide: SLIDE_MS })],
            [6500, () => set({ index: 2 })],
            [9500, () => move(point("resize"), 1100)],
            [10900, () => set({ hot: "resize" })],
            [11150, () => press("resize")],
            [11350, () => { release(); set({ hot: null, modal: true }); }],
            [12100, () => move(point("cat-only"), 800)],
            [13050, () => set({ hot: "cat-only" })],
            [13350, () => press("cat-only")],
            [13550, () => { release(); set({ hot: null, modal: false, mode: "cat" }); }],
            [14200, () => move(windowPoint(30, 0), 900)],
            [15000, () => set({ hover: true })],
            [16700, () => { set({ hover: false, mode: "timer" }); move(windowPoint(30, 110), 1000); }],
            [18300, () => move(point("restore"), 900)],
            [18900, () => set({ hover: true })],
            [19500, () => set({ hot: "restore" })],
            [19750, () => press("restore")],
            [19950, () => { release(); set({ hot: null, hover: false, mode: "default" }); }],
            [20600, () => move(home(), 1000, false)],
            [21200, () => set({ index: 3, glide: SLIDE_MS })],
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

                    <span
                        className={`fd-cursor${s.cursor.on ? " is-on" : ""}${s.cursor.down ? " is-down" : ""}`}
                        style={{
                            transform: `translate(${s.cursor.x - 4}px, ${s.cursor.y - 3}px)`,
                            transitionDuration: `${s.cursor.ms}ms, 400ms`,
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
