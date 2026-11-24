import type Lenis from "lenis";

let activeAnimationId: number | null = null;
let activeCleanup: (() => void) | null = null;

// The site-wide Lenis instance (set by SmoothScrollProvider). Scripted scrolls go
// through it while it runs; writing window.scrollTo underneath it would fight its easing.
let lenis: Lenis | null = null;

// Scroll-driven effects that must move in the same frame as the page (see onSmoothScroll).
const scrollListeners = new Set<() => void>();
let detachListeners: (() => void) | null = null;

export function setLenis(instance: Lenis | null) {
    detachListeners?.();
    detachListeners = null;
    lenis = instance;
    if (instance) detachListeners = instance.on("scroll", () => scrollListeners.forEach((fn) => fn()));
}

/**
 * Calls `fn` right after Lenis moves the page, in the same animation frame.
 * A plain "scroll" listener only hears about it after that frame has painted, so
 * anything it positions trails the page by a frame and visibly jitters against it.
 * Returns an unsubscribe function. Without Lenis (reduced motion) it never fires,
 * so keep a native scroll listener too.
 */
export function onSmoothScroll(fn: () => void): () => void {
    scrollListeners.add(fn);
    return () => {
        scrollListeners.delete(fn);
    };
}

/** Jump to the very top with no animation (used on page changes). */
export function jumpToTop() {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

export interface SmoothScrollOptions {
    duration?: number;
    offset?: number;
    onComplete?: () => void;
}

/**
 * High-performance cubic bezier evaluator with Newton-Raphson approximation.
 * Default curve: (0.22, 1, 0.36, 1) — smooth initial takeoff with a long,
 * strategic deceleration tail that glides gently to an asymptotic halt.
 */
function createCubicBezier(x1: number, y1: number, x2: number, y2: number) {
    return function (t: number): number {
        if (t <= 0) return 0;
        if (t >= 1) return 1;

        let u = t;
        for (let i = 0; i < 8; i++) {
            const currentX =
                3 * (1 - u) * (1 - u) * u * x1 +
                3 * (1 - u) * u * u * x2 +
                u * u * u;
            const currentXDerivative =
                3 * (1 - u) * (1 - u) * x1 +
                6 * (1 - u) * u * (x2 - x1) +
                3 * u * u * (1 - x2);
            if (Math.abs(currentXDerivative) < 1e-6) break;
            const diff = currentX - t;
            u -= diff / currentXDerivative;
            u = Math.max(0, Math.min(1, u));
        }

        return (
            3 * (1 - u) * (1 - u) * u * y1 +
            3 * (1 - u) * u * u * y2 +
            u * u * u
        );
    };
}

const strategicDecelEase = createCubicBezier(0.22, 1, 0.36, 1);

/**
 * Smoothly scrolls to a target element or selector with an organic micro-ramp takeoff,
 * brisk transit speed, and a strategic, cushioned deceleration arriving at the target.
 */
export function smoothScrollTo(
    target: HTMLElement | string,
    options?: SmoothScrollOptions
) {
    if (typeof window === "undefined") return;

    const el =
        typeof target === "string"
            ? (document.querySelector(target) as HTMLElement | null)
            : target;
    if (!el) return;

    // Respect user's motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.scrollIntoView({ behavior: "auto" });
        options?.onComplete?.();
        return;
    }

    // Cancel any ongoing scroll animation cleanly
    if (activeAnimationId !== null) {
        cancelAnimationFrame(activeAnimationId);
        activeAnimationId = null;
    }
    if (activeCleanup) {
        activeCleanup();
        activeCleanup = null;
    }

    // Calculate target position respecting scroll-margin-top or custom offset
    const scrollMarginTop = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const offset = scrollMarginTop > 0 ? scrollMarginTop : (options?.offset ?? 74);
    const targetY = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);

    if (lenis) {
        const distance = Math.abs(targetY - window.scrollY);
        lenis.scrollTo(targetY, {
            duration: (options?.duration ?? Math.min(Math.max(650, Math.pow(distance, 0.42) * 55), 980)) / 1000,
            easing: strategicDecelEase,
            onComplete: () => options?.onComplete?.(),
        });
        return;
    }

    const startY = window.scrollY;
    const difference = targetY - startY;

    // If already at target, finish immediately
    if (Math.abs(difference) < 2) {
        options?.onComplete?.();
        return;
    }

    // Distance-adaptive duration: short hops (~300px) take ~650ms, long leaps (~2500px) take ~950ms
    const distance = Math.abs(difference);
    const duration =
        options?.duration ??
        Math.min(Math.max(650, Math.pow(distance, 0.42) * 55), 980);

    const startTime = performance.now();

    // Disable native CSS scroll-behavior during animation to prevent double-interpolation stutter
    const prevScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    const cleanup = () => {
        cancelEvents.forEach((ev) => window.removeEventListener(ev, onUserInterrupt));
        document.documentElement.style.scrollBehavior = prevScrollBehavior;
        activeAnimationId = null;
        activeCleanup = null;
    };

    // If user tries to manually scroll, cancel animation so we don't fight user input
    const onUserInterrupt = () => {
        if (activeAnimationId !== null) {
            cancelAnimationFrame(activeAnimationId);
            activeAnimationId = null;
        }
        cleanup();
    };

    const cancelEvents = ["wheel", "touchmove", "pointerdown", "keydown"];
    cancelEvents.forEach((ev) =>
        window.addEventListener(ev, onUserInterrupt, { passive: true, once: true })
    );

    activeCleanup = cleanup;

    function step(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = strategicDecelEase(progress);

        window.scrollTo(0, startY + difference * easedProgress);

        if (progress < 1) {
            activeAnimationId = requestAnimationFrame(step);
        } else {
            cleanup();
            options?.onComplete?.();
        }
    }

    activeAnimationId = requestAnimationFrame(step);
}
