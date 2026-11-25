"use client";

/* eslint-disable @next/next/no-img-element -- app icons at their native pixel sizes, inside a scaled replica */

import { useSyncExternalStore, type CSSProperties } from "react";

/**
 * The PAWSE Dashboard's three analytics cards and its Weekly Flow chart, lifted
 * out of the app window (like Meet Your Companions shows only the cat buttons).
 *
 * Source of truth: the app's src/renderer/settings.html / settings.css /
 * settings.js (educ-jkescritor/Pawse, test-branch): same colours, fonts, icons
 * (public/app/*), states and copy; numbers use the app's Pixeloid Sans.
 *
 * Scaling (see .dc- in app/globals.css): laid out once at 320px and sized in
 * --u, a fraction of the container's width, so it scales like a picture:
 * height follows width, the three cards always sit in one row.
 *
 * Static on purpose (no entrance animation); the app's hover states remain:
 * bars darken and lift with a time tooltip, the day label goes bold.
 * The week and "today" follow the visitor's clock; the numbers are illustrative.
 */

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// A believable week of focus (seconds); today's bar always matches the Daily Focus card
const SAMPLE_WEEK = [4300, 7600, 5800, 9400, 6100, 8300, 3200];
const TODAY_SECONDS = 1 * 3600 + 52 * 60;

const subscribe = () => () => {};
const getToday = () => new Date().toDateString();

function hm(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return { h, m };
}

export default function DashboardCards() {
    // Null on the server (no date yet); the visitor's date on the client
    const todayKey = useSyncExternalStore(subscribe, getToday, () => null);
    const today = todayKey ? new Date(todayKey) : null;
    const todayIndex = today ? today.getDay() : -1;

    const week = SAMPLE_WEEK.map((s, i) => (todayIndex < 0 ? s : i < todayIndex ? s : i === todayIndex ? TODAY_SECONDS : 0));
    const active = week.filter((s) => s > 0);
    const avg = active.length ? Math.round(active.reduce((a, b) => a + b, 0) / active.length) : 0;
    const ceiling = Math.max(...week, avg, 1);
    const avgFmt = (() => {
        const { h } = hm(avg);
        const m = Math.round((avg % 3600) / 60);
        return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
    })();

    let range = "This Week";
    if (today) {
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - todayIndex);
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        const mon = (d: Date) => d.toLocaleDateString("en-US", { month: "short" });
        range = `${mon(sunday)} ${sunday.getDate()} - ${mon(saturday)} ${saturday.getDate()}`;
    }
    const focus = hm(TODAY_SECONDS);

    return (
        <div className="dc-scale">
            <div
                className="dc"
                role="img"
                aria-label="The PAWSE Dashboard: today's focus time above the daily average, a 6-day streak, Tux as the top companion, and a Weekly Flow chart of focus time per day"
            >
                <div className="dc-cards" aria-hidden="true">
                    <div className="dc-card dc-card-focus">
                        <div className="dc-card-title">Daily Focus</div>
                        <div className="dc-icon dc-icon-focus"><img src="/app/icons/visual-hourglass.png" alt="" /></div>
                        <div className="dc-card-body">
                            <div className="dc-value">
                                <span><span className="dc-num">{focus.h}</span>h</span>
                                <span><span className="dc-num">{focus.m}</span>m</span>
                            </div>
                            <span className="dc-sub">Above daily average!</span>
                        </div>
                    </div>
                    <div className="dc-card dc-card-streak">
                        <div className="dc-card-title">Current Streak</div>
                        <div className="dc-icon dc-icon-streak"><img src="/app/icons/visual-streak-active.png" alt="" /></div>
                        <div className="dc-card-body">
                            <div className="dc-value">
                                <span className="dc-num">6</span>
                                <span>days</span>
                            </div>
                            <span className="dc-sub">Purr-suing 9 days.</span>
                        </div>
                    </div>
                    <div className="dc-card dc-card-companion">
                        <div className="dc-card-title">Top Companion</div>
                        <div className="dc-icon"><img src="/app/photos/tuxedo-cat-face.png" alt="" /></div>
                        <div className="dc-card-body">
                            <div className="dc-value"><span>Tux</span></div>
                            <span className="dc-sub">Chosen 46% of the time</span>
                        </div>
                    </div>
                </div>

                {/* Weekly Flow */}
                <div className="dc-graph" aria-hidden="true">
                    <div className="dc-graph-head">
                        <p className="dc-h2">Weekly Flow</p>
                        <div className="dc-picker">
                            <span className="dc-arrow">&#8249;</span>
                            <span className="dc-range">{range}</span>
                            <span className="dc-arrow dc-arrow-off">&#8250;</span>
                        </div>
                    </div>
                    <div className="dc-legend">
                        <span><i className="dc-sw" />Completed</span>
                        <span><i className="dc-sw dc-sw-today" />Today</span>
                    </div>
                    <div className="dc-bars">
                        {week.map((s, i) => {
                            const t = hm(s);
                            return (
                                <div key={DAYS[i]} className={`dc-col ${i === todayIndex ? "dc-today" : ""}`}>
                                    <div className="dc-bar" style={{ height: `${(s / ceiling) * 100}%` }}>
                                        {s > 0 && <span className="dc-tip">{t.h}h {t.m}m</span>}
                                    </div>
                                    <span className="dc-day">{DAYS[i]}</span>
                                </div>
                            );
                        })}
                        {avg > 0 && (
                            <div className="dc-avg" style={{ "--avg": (avg / ceiling).toFixed(4) } as CSSProperties}>
                                <span className="dc-avg-label"><strong>{avgFmt}</strong> avg</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
