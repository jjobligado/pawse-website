"use client";

/* eslint-disable @next/next/no-img-element -- app icons at their native pixel sizes, inside a scaled replica */

import { useSyncExternalStore } from "react";

/**
 * The PAWSE desktop app's Dashboard window, rebuilt for the web.
 *
 * Source of truth: the app's src/renderer/settings.html / settings.css /
 * settings.js and index.css (educ-jkescritor/Pawse, test-branch). Same layout
 * (180px sidebar, title bar, "Your Progress" header, three analytics cards, the
 * Weekly Flow chart with its legend, week picker and dashed daily-average line),
 * same colours, fonts, states and copy; icons are the app's own files
 * (public/app/*), numbers use the app's Pixeloid Sans (digits only, 1.3KB).
 *
 * Scaling: it is laid out at the app's real size (720×480) and scaled as one
 * piece to the width it's given (container query + tan(atan2()) for the ratio,
 * no JS), so it shrinks like a crisp screenshot instead of re-flowing.
 *
 * Static on purpose (no entrance animation); the app's hover states remain:
 * bars darken and lift with a time tooltip, the day label goes bold.
 * The date, the week and "today" follow the visitor's clock; the sample
 * numbers are illustrative.
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

export default function DashboardWindow() {
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

    let dateLine = "";
    let range = "Date";
    if (today) {
        dateLine = today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - todayIndex);
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        const mon = (d: Date) => d.toLocaleDateString("en-US", { month: "short" });
        range = `${mon(sunday)} ${sunday.getDate()} - ${mon(saturday)} ${saturday.getDate()}`;
    }
    const focus = hm(TODAY_SECONDS);

    return (
        <div className="app-dash-frame">
            <div className="app-dash" role="img" aria-label="The PAWSE Dashboard: today's focus time above the daily average, a 6-day streak, Tux as the top companion, and a Weekly Flow chart of focus time per day">
                <div className="ad-page" aria-hidden="true">
                    {/* Sidebar */}
                    <div className="ad-side">
                        <div className="ad-side-head">
                            <div className="ad-brand">
                                <img src="/images/logo.png" alt="" className="ad-brand-logo" />
                                <span className="ad-title">PAWSE</span>
                            </div>
                            <span className="ad-dock"><img src="/app/icons/dock-btn.png" alt="" /></span>
                        </div>
                        <span className="ad-nav ad-nav-active"><img src="/app/icons/dashboard.svg" alt="" /><span>Dashboard</span></span>
                        <div className="ad-utilities">
                            <span className="ad-nav"><img src="/app/icons/settings.svg" alt="" /><span>Settings</span></span>
                            <span className="ad-nav"><img src="/app/icons/info.svg" alt="" /><span>About</span></span>
                        </div>
                    </div>

                    <div className="ad-right">
                        {/* Title bar */}
                        <div className="ad-titlebar">
                            <span className="ad-ctl"><img src="/app/icons/minimize-btn.png" alt="" /></span>
                            <span className="ad-ctl"><img src="/app/icons/close-btn.png" alt="" /></span>
                        </div>

                        <div className="ad-main">
                            <div className="ad-header">
                                <div className="ad-header-row">
                                    <p className="ad-h1">Your Progress</p>
                                    <img src="/app/icons/refresh-btn.svg" alt="" className="ad-refresh" />
                                </div>
                                <p className="ad-date">{dateLine}</p>
                            </div>

                            {/* Analytics cards */}
                            <div className="ad-cards">
                                <div className="ad-card ad-card-focus">
                                    <div className="ad-card-title">Daily Focus</div>
                                    <div className="ad-icon ad-icon-focus"><img src="/app/icons/visual-hourglass.png" alt="" /></div>
                                    <div className="ad-card-body">
                                        <div className="ad-value">
                                            <span><span className="ad-num">{focus.h}</span>h</span>
                                            <span><span className="ad-num">{focus.m}</span>m</span>
                                        </div>
                                        <span className="ad-sub">Above daily average!</span>
                                    </div>
                                </div>
                                <div className="ad-card ad-card-streak">
                                    <div className="ad-card-title">Current Streak</div>
                                    <div className="ad-icon ad-icon-streak"><img src="/app/icons/visual-streak-active.png" alt="" /></div>
                                    <div className="ad-card-body">
                                        <div className="ad-value">
                                            <span className="ad-num">6</span>
                                            <span>days</span>
                                        </div>
                                        <span className="ad-sub">Purr-suing 9 days.</span>
                                    </div>
                                </div>
                                <div className="ad-card ad-card-companion">
                                    <div className="ad-card-title">Top Companion</div>
                                    <div className="ad-icon"><img src="/app/photos/tuxedo-cat-face.png" alt="" /></div>
                                    <div className="ad-card-body">
                                        <div className="ad-value"><span>Tux</span></div>
                                        <span className="ad-sub">Chosen 46% of the time</span>
                                    </div>
                                </div>
                            </div>

                            {/* Weekly Flow */}
                            <div className="ad-graph">
                                <div className="ad-graph-head">
                                    <p className="ad-h2">Weekly Flow</p>
                                    <div className="ad-picker">
                                        <span className="ad-arrow">&#8249;</span>
                                        <span className="ad-range">{range}</span>
                                        <span className="ad-arrow ad-arrow-off">&#8250;</span>
                                    </div>
                                </div>
                                <div className="ad-legend">
                                    <span><i className="ad-sw" />Completed</span>
                                    <span><i className="ad-sw ad-sw-today" />Today</span>
                                </div>
                                <div className="ad-bars">
                                    {week.map((s, i) => {
                                        const t = hm(s);
                                        return (
                                            <div key={DAYS[i]} className={`ad-col ${i === todayIndex ? "ad-today" : ""}`}>
                                                <div className="ad-bar" style={{ height: `${(s / ceiling) * 100}%` }}>
                                                    {s > 0 && <span className="ad-tip">{t.h}h {t.m}m</span>}
                                                </div>
                                                <span className="ad-day">{DAYS[i]}</span>
                                            </div>
                                        );
                                    })}
                                    {avg > 0 && (
                                        <div className="ad-avg" style={{ bottom: `calc(20px + ${(avg / ceiling).toFixed(4)} * (100% - 36px))` }}>
                                            <span className="ad-avg-label"><strong>{avgFmt}</strong> avg</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
