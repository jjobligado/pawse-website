/**
 * The visitor's time of day ("sky phase") and everything that changes with it.
 *
 * The server can't know the visitor's clock, so the phase is never rendered
 * into the markup. Instead SKY_PHASE_SCRIPT runs in <head> before the first
 * paint and stamps it on <html data-sky="…">, and SKY_PHASE_CSS turns that
 * attribute into CSS variables. Components switch on the attribute in CSS
 * (Tailwind's `in-data-[sky=…]:` variant, or these variables), so the right sky
 * shows from the very first frame instead of "day" turning into the real one.
 */

export type SkyPhase = "morning" | "day" | "dusk" | "night";

export const SKY_PHASES: readonly SkyPhase[] = ["morning", "day", "dusk", "night"];

/** Rendered on <html> by the server; the head script replaces it before paint. */
export const DEFAULT_SKY_PHASE: SkyPhase = "day";

/** Local hour each phase starts at, in order (night runs past midnight to morning). */
const PHASE_STARTS: readonly [SkyPhase, number][] = [
    ["morning", 5],
    ["day", 9],
    ["dusk", 17],
    ["night", 20],
];

export function phaseForHour(hour: number): SkyPhase {
    let phase: SkyPhase = "night";
    for (const [p, start] of PHASE_STARTS) if (hour >= start) phase = p;
    return phase;
}

export function isSkyPhase(value: unknown): value is SkyPhase {
    return typeof value === "string" && (SKY_PHASES as readonly string[]).includes(value);
}

/**
 * The sun is up from 5:00 (morning starts) to 20:00 (night starts); the moon
 * has the rest. Each rises on the right of the window, crosses its top right to
 * left and sets on the left, so its spot in the sky tells the time: --sun-t and
 * --moon-t (0 at rise, 1 at set) go on <html>.
 */
const SUNRISE = PHASE_STARTS[0][1];
const SUNSET = PHASE_STARTS[PHASE_STARTS.length - 1][1];

/** Middle of each phase, for the development-only `?sky=` override. */
const PHASE_MIDDAY: Record<SkyPhase, number> = { morning: 7, day: 13, dusk: 18.5, night: 0.5 };

/** Local time as a fractional hour, including the development-only `?sky=` / `?hour=` overrides. */
function currentHour(): number {
    if (process.env.NODE_ENV === "development") {
        const params = new URLSearchParams(window.location.search);
        const hour = Number.parseFloat(params.get("hour") ?? "");
        if (hour >= 0 && hour < 24) return hour;
        const forced = params.get("sky");
        if (isSkyPhase(forced)) return PHASE_MIDDAY[forced];
    }
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
}

/** How far the sun and moon are across their arcs (0 = rising, 1 = setting). */
export function arcsForHour(hour: number) {
    const clamp = (n: number) => Math.min(1, Math.max(0, n));
    return {
        sun: clamp((hour - SUNRISE) / (SUNSET - SUNRISE)),
        moon: clamp((((hour - SUNSET) % 24) + 24) % 24 / (24 - SUNSET + SUNRISE)),
    };
}

/*
 * How much of the town has its lights on (0..1, --lights-on on <html>): none
 * by day; from 17:00 windows switch on one by one, quickly at first (more than
 * half are lit by 18:00) until all are lit at 19:30;
 * from 23:00 people go to bed and it thins to 40% by 2:00; the last of those go
 * out between 5:00 and 6:30. Each lit window has its own threshold on this
 * (hero-scene.tsx), so the town fills in and empties gradually. The head
 * script carries a copy of this (LIGHTS_JS); keep the two in step.
 */
export function lightsForHour(hour: number): number {
    const x = hour < 12 ? hour + 24 : hour;
    if (x < 17) return 0;
    if (x < 19.5) return Math.sqrt((x - 17) / 2.5);
    if (x < 23) return 1;
    if (x < 26) return 1 - 0.2 * (x - 23);
    if (x < 29) return 0.4;
    if (x < 30.5) return (0.4 * (30.5 - x)) / 1.5;
    return 0;
}
const LIGHTS_JS =
    "function(h){var x=h<12?h+24:h;return x<17?0:x<19.5?Math.sqrt((x-17)/2.5):x<23?1:x<26?1-0.2*(x-23):x<29?0.4:x<30.5?0.4*(30.5-x)/1.5:0}";

/** The phase for right now, including the development-only overrides. */
export function currentSkyPhase(): SkyPhase {
    if (process.env.NODE_ENV === "development") {
        const forced = new URLSearchParams(window.location.search).get("sky");
        if (isSkyPhase(forced)) return forced;
    }
    return phaseForHour(Math.floor(currentHour()));
}

/** Sets <html data-sky> to the current phase (only when it changed), moves the sun and moon and sets the town's lights. */
export function applySkyPhase() {
    const phase = currentSkyPhase();
    const root = document.documentElement;
    if (root.dataset.sky !== phase) root.dataset.sky = phase;
    const hour = currentHour();
    const { sun, moon } = arcsForHour(hour);
    root.style.setProperty("--sun-t", sun.toFixed(4));
    root.style.setProperty("--moon-t", moon.toFixed(4));
    root.style.setProperty("--lights-on", lightsForHour(hour).toFixed(4));
}

/* ------------------------------------------------------------------ */
/* Per-phase looks                                                     */
/* ------------------------------------------------------------------ */

export interface PhaseTheme {
    /** Sky gradient, top to horizon. The copy sits on its lighter middle. */
    gradient: string;
    /** The sky's top stop (the footer's dithered edge meets it). */
    top: string;
    /** The bottom stop (pads the sky below the horizon when the view shifts). */
    horizon: string;
    glow: string;
    cloud: { W: string; S: string };
    hill: string;
    roof: string;
}

/*
 * Contrast: the headline (ink) stays ≥3:1 on each gradient's top half, and the
 * subtitle switches to a darker ink at night (see hero-section.tsx), so body
 * copy stays ≥4.5:1 wherever it sits.
 */
export const THEMES: Record<SkyPhase, PhaseTheme> = {
    morning: {
        gradient: "linear-gradient(180deg,#B9DDFB 0%,#D6E8FA 40%,#FBE4D4 80%,#FFF2E8 100%)",
        top: "#B9DDFB",
        horizon: "#FFF2E8",
        glow: "radial-gradient(circle,rgb(255 220 180/0.9) 0%,rgb(255 220 180/0.35) 35%,transparent 68%)",
        cloud: { W: "#FFFFFF", S: "#F6DCCD" },
        hill: "#D8DEF0",
        roof: "#C0CAE6",
    },
    day: {
        gradient: "linear-gradient(180deg,#9FD6FF 0%,#C6E8FF 42%,#E6F5FF 78%,#F3FAFF 100%)",
        top: "#9FD6FF",
        horizon: "#F3FAFF",
        glow: "radial-gradient(circle,rgb(255 244 204/0.85) 0%,rgb(255 244 204/0.35) 35%,transparent 68%)",
        cloud: { W: "#FFFFFF", S: "#DDEFFC" },
        hill: "#C4E4FA",
        roof: "#A9D6F5",
    },
    dusk: {
        gradient: "linear-gradient(180deg,#F0A79C 0%,#F6C2A6 40%,#FCDDC2 75%,#FFEEDF 100%)",
        top: "#F0A79C",
        horizon: "#FFEEDF",
        glow: "radial-gradient(circle,rgb(255 196 140/0.9) 0%,rgb(255 196 140/0.4) 35%,transparent 68%)",
        cloud: { W: "#FFF1E7", S: "#EFB8A8" },
        hill: "#E2B3B0",
        roof: "#C6939C",
    },
    night: {
        gradient: "linear-gradient(180deg,#5E73B8 0%,#8597D2 30%,#B9C5EC 55%,#D3DAF3 80%,#E4E8F8 100%)",
        top: "#5E73B8",
        horizon: "#E4E8F8",
        glow: "radial-gradient(circle,rgb(226 232 255/0.6) 0%,rgb(226 232 255/0.2) 35%,transparent 68%)",
        cloud: { W: "#DDE3F7", S: "#AEB9E0" },
        hill: "#8F9ED1",
        roof: "#6E7EB9",
    },
};

/**
 * "Done" and its underline (which takes the text colour) shift with the sky
 * behind them: a brand blue that deepens toward dusk and night. Each shade is
 * ≥4.5:1 against the darkest sky pixel behind "Done" (measured at 1440 and 820
 * wide) and well above that on the white wall where phones show the copy.
 */
const DONE_COLOR: Record<SkyPhase, string> = {
    morning: "#17679C",
    day: "#16639A",
    dusk: "#14578A",
    night: "#1A3480",
};

/**
 * The "Done" fish (ginger, tuxedo, void): the app's own pastels (cream #FEE1A9,
 * lime #CFE58A, lilac #E0A9FE), nudged per phase so they stay light but don't
 * melt into the sky: a touch deeper on the pale morning and day skies, lighter
 * where a colour sits too close to the dusk peach, and lighter still against
 * the darker night sky. They're decorative (aria-hidden), so they stay pastel
 * rather than meeting the 3:1 graphics ratio; the dark eye and the soft drop
 * shadow keep them readable.
 */
const FISH_COLORS: Record<SkyPhase, [string, string, string]> = {
    morning: ["#F7C77C", "#B3D266", "#D39AF4"],
    day: ["#F5C377", "#AFCF60", "#D095F2"],
    dusk: ["#FFEDC6", "#E3F2AE", "#C98AF0"],
    night: ["#FFE9BC", "#DDF0A4", "#ECC8FF"],
};
const FISH_EYE: Record<SkyPhase, string> = {
    morning: "#232421",
    day: "#232421",
    dusk: "#232421",
    night: "#232421",
};

/**
 * The light the window throws down the wall to the desk, per time of day (RGB
 * and strength): soft peach in the morning, pale sunlight by day, warm
 * amber-rose at dusk, faint cool moonlight at night.
 */
const WALL_LIGHT: Record<SkyPhase, { rgb: string; alpha: number }> = {
    morning: { rgb: "255 214 178", alpha: 0.34 },
    day: { rgb: "255 232 178", alpha: 0.32 },
    dusk: { rgb: "255 178 140", alpha: 0.3 },
    night: { rgb: "168 184 236", alpha: 0.22 },
};

/*
 * Golden hour: --golden (0..1) is how low the sun is, strongest at sunrise and
 * sunset and gone by mid-morning (the square of 1 - 4t(1 - t), so it falls off
 * fast), and 0 at night. It warms the bottom of the sky and the clouds: their
 * shaded underside (--sky-cloud-edge) turns apricot, their face a touch peach.
 * Pure CSS on --sun-t, so it is right from the first paint.
 */
const GOLDEN_CSS =
    "html{--sun-up:1;--sun-low:calc(1 - 4 * var(--sun-t, 0.5) * (1 - var(--sun-t, 0.5)));--golden:calc(var(--sun-up) * var(--sun-low) * var(--sun-low));" +
    "--sky-cloud-edge:color-mix(in srgb,var(--sky-cloud-s),#F39A6E calc(var(--golden) * 65%));--sky-cloud-face:color-mix(in srgb,var(--sky-cloud-w),#FFDCC0 calc(var(--golden) * 40%))}" +
    'html[data-sky="night"]{--sun-up:0}' +
    /* --body-t: where the light comes from, the sun by day and the moon at night (0 right, 1 left) */
    'html{--body-t:var(--sun-t, 0.5)}html[data-sky="night"]{--body-t:var(--moon-t, 0.5)}';

/** Per-phase CSS variables on <html>, rendered into <head> by the root layout. */
export const SKY_PHASE_CSS = GOLDEN_CSS + SKY_PHASES.map((p) => {
    const t = THEMES[p];
    return `html[data-sky="${p}"]{--sky-top:${t.top};--sky-cloud-w:${t.cloud.W};--sky-cloud-s:${t.cloud.S};--sky-hill:${t.hill};--sky-roof:${t.roof};--hero-done-sky:${DONE_COLOR[p]};--fish-1:${FISH_COLORS[p][0]};--fish-2:${FISH_COLORS[p][1]};--fish-3:${FISH_COLORS[p][2]};--fish-eye:${FISH_EYE[p]};--wall-light:${WALL_LIGHT[p].rgb};--wall-a:${WALL_LIGHT[p].alpha}}`;
}).join("");

/**
 * Runs synchronously in <head>, before the first paint: the same logic as
 * currentSkyPhase(), as a plain string the browser can run before React loads.
 */
export const SKY_PHASE_SCRIPT = `(function(){try{var d=new Date(),h=d.getHours()+d.getMinutes()/60,p,s=${JSON.stringify(PHASE_STARTS)},r=document.documentElement;${
    process.env.NODE_ENV === "development"
        ? `var q=new URLSearchParams(location.search),f=q.get("sky"),x=parseFloat(q.get("hour")),m=${JSON.stringify(PHASE_MIDDAY)};if(x>=0&&x<24)h=x;else if(m[f]!=null)h=m[f];if(m[f]!=null)p=f;`
        : ""
}if(!p){p="night";for(var i=0;i<s.length;i++)if(Math.floor(h)>=s[i][1])p=s[i][0];}r.setAttribute("data-sky",p);var c=function(n){return Math.min(1,Math.max(0,n))};r.style.setProperty("--sun-t",c((h-${SUNRISE})/${SUNSET - SUNRISE}).toFixed(4));r.style.setProperty("--moon-t",c((((h-${SUNSET})%24)+24)%24/${24 - SUNSET + SUNRISE}).toFixed(4));r.style.setProperty("--lights-on",(${LIGHTS_JS})(h).toFixed(4))}catch(e){}})()`;
