/* eslint-disable @next/next/no-img-element -- app icons at their native pixel sizes, inside a scaled replica */

/**
 * The PAWSE timer window, rebuilt from the desktop app as a display (nothing
 * here is a control). Source of truth: the app's src/renderer/timer/timer.html
 * and timer.css, plus index.css for the title bar and dialog (educ-jkescritor/
 * Pawse, test-branch). Same markup order, sizes, colours and icons (public/app/
 * icons, the app's own files); styles are the .at-* rules in globals.css.
 *
 * Laid out at the app's real size (294x422 window, 224x232 Cat Only, 224x92
 * Timer Only); the parent scales it. Every interactive state the demo needs is
 * a prop: which mode, whether the pointer is over it (the app's :hover look),
 * which control is highlighted or pressed, and whether Select Mode is open.
 */

export type TimerCat = "tux" | "ginger" | "void";
export type TimerMode = "default" | "cat" | "timer";
/** Named parts the demo can point at (data-part) and highlight. */
export type TimerPart = "resize" | "cat-only" | "timer-only" | "restore";

// The idle strips (64px frames): Tux has 4 frames over 0.6s, Ginger and Void 5 over 0.75s
const IDLE: Record<TimerCat, { frames: 4 | 5; seconds: number }> = {
    tux: { frames: 4, seconds: 0.6 },
    ginger: { frames: 5, seconds: 0.75 },
    void: { frames: 5, seconds: 0.75 },
};

const FISH: Record<TimerCat, string> = {
    tux: "/images/completed-tuxedo-fish.png",
    ginger: "/images/completed-orange-fish.png",
    void: "/images/completed-black-fish.png",
};

const ICONS = "/app/icons";

function format(seconds: number) {
    const s = Math.max(0, seconds);
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export default function TimerWindow({
    cat,
    seconds,
    fish,
    mode = "default",
    hover = false,
    modalOpen = false,
    hot = null,
    down = null,
    animate = true,
}: {
    cat: TimerCat;
    /** Time left, in seconds. */
    seconds: number;
    /** Completed cycles, out of 4. */
    fish: number;
    mode?: TimerMode;
    /** The app's :hover look (mini modes show their controls). */
    hover?: boolean;
    /** Select Mode dialog (opened by the title bar's Resize button). */
    modalOpen?: boolean;
    /** Control under the pointer. */
    hot?: TimerPart | null;
    /** Control being pressed. */
    down?: TimerPart | null;
    /** Play the idle loop (off for reduced motion). */
    animate?: boolean;
}) {
    const state = (part: TimerPart) => `${hot === part ? " is-hot" : ""}${down === part ? " is-down" : ""}`;
    const idle = IDLE[cat];

    return (
        <div className={`at-win${mode === "cat" ? " is-cat" : mode === "timer" ? " is-timer" : ""}${hover ? " is-hover" : ""}`}>
            {/* Keyed by mode: they remount on a mode change and fade in (.at-settle) */}
            <div key={`bar-${mode}`} className="at-titlebar">
                <div className="at-title">
                    <img src="/images/logo.png" alt="" className="at-logo" />
                    <span className="at-name">PAWSE</span>
                </div>
                <div className="at-ctls">
                    <span className="at-ctl"><img src={`${ICONS}/hub-btn.png`} alt="" /></span>
                    <span className="at-divider" />
                    <span className="at-ctl"><img src={`${ICONS}/minimize-btn.png`} alt="" /></span>
                    <span data-part="resize" className={`at-ctl${state("resize")}`}><img src={`${ICONS}/decrease-btn.png`} alt="" /></span>
                    <span className="at-ctl"><img src={`${ICONS}/home-btn.png`} alt="" /></span>
                </div>
            </div>

            <div key={`main-${mode}`} className="at-main">
                <div className="at-time">
                    <span className="at-digits">{format(seconds)}</span>
                </div>
                <div className="at-fish">
                    {[0, 1, 2, 3].map((i) => (
                        <span key={i} style={{ backgroundImage: `url(${i < fish ? FISH[cat] : `${ICONS}/uncompleted-fish.png`})` }} />
                    ))}
                </div>
                <div className="at-cat">
                    <span
                        className="at-sprite"
                        style={{
                            backgroundImage: `url(/sprites/${cat}-body-idle-sheet.png)`,
                            backgroundSize: `${idle.frames * 64}px 64px`,
                            animation: animate ? `at-idle-${idle.frames} ${idle.seconds}s steps(${idle.frames}) infinite` : undefined,
                        }}
                    />
                </div>
                <div className="at-controls">
                    <span data-part="restore" className={`at-btn at-restore${state("restore")}`}><img src={`${ICONS}/increase-btn.png`} alt="" /></span>
                    <span className="at-btn"><img src={`${ICONS}/soundon-btn.png`} alt="" /></span>
                    <span className="at-btn at-play"><img src={`${ICONS}/pause-btn.png`} alt="" /></span>
                    <span className="at-btn"><img src={`${ICONS}/skip-btn.png`} alt="" /></span>
                </div>
            </div>

            <div className={`at-modal${modalOpen ? " is-open" : ""}`}>
                <div className="at-dialog">
                    <p className="at-dialog-title">Select Mode</p>
                    <div className="at-options">
                        <span data-part="timer-only" className={`at-option${state("timer-only")}`}>Timer Only</span>
                        <span data-part="cat-only" className={`at-option${state("cat-only")}`}>Cat Only</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
