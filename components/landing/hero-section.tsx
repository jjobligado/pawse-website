"use client";

import { useEffect, useRef, useState } from "react";
import { otherDownloads, usePlatform } from "@/hooks/use-platform";
import { useSendToDesktop } from "@/hooks/use-send-to-desktop";
import { buttonClasses, buttonLabelClasses } from "@/components/ui/button";
import SpriteCat from "./sprite-cat";
import { Laptop, SillPlant, SillShadow, WindowFrame, WindowSill, WindowSky } from "./hero-scene";
import { CATS, CAT_SIZE, GINGER_SIZE } from "./cats";
import LaptopDesktop from "./laptop-desktop";
import DoneWord from "./done-word";
import { OsIcon } from "./download-options";
import { onSmoothScroll } from "@/lib/smooth-scroll";

/**
 * Desk landing, with no hard stops: every speed change is gradual (see smoothRamp).
 * L = the section's `--land`. Two equal sin² ramps, offset by half:
 *
 * - Lowering (scroll start → start + 2L): the laptop is lowered by L.
 * - Rest (start + L → start + 3L): laptop and desk together trail the scroll by L,
 *   into space reserved under the desk.
 *
 * Their speeds add up to exactly the scroll's while they overlap, so: the laptop
 * eases to a standstill with the scene centred on screen (first L), stays still
 * while the desk rises and slows into it, touching down just as the desk stops
 * (second L), then laptop and desk ease back into the scroll together (last L).
 *
 * Depth comes from one "camera" shared by the desk, the mat and the laptop's
 * keyboard deck (--cam distance, --pitch angle). It tilts down toward the desk as
 * the laptop is set down (DESK_PITCH_FROM → TO), so the desk and the keyboard swing
 * into view together. While in the air the laptop is held front-up (APPROACH_TILT,
 * degrees: the deck tips away and the lid leans back), levelling out exactly at
 * contact; it also shrinks a touch as it moves away from you (LAND_SHRINK). Its
 * shadow lies on the mat and sharpens as it comes down. The window, being farther
 * away, trails behind (WINDOW_LAG of the lowering). Everything follows the
 * scroll position alone (no timed bounce at touch-down), so scrolling stays smooth
 * through the contact point at any speed.
 */
/**
 * Share (0–1) of an offset applied at progress t (0–1). Its rate follows sin²: it
 * starts at zero, peaks mid-way, and returns to zero. Spread over twice the
 * offset's length, the peak rate equals the scroll, so the element slows to a
 * standstill for an instant and never jolts in or out of it.
 */
function smoothRamp(t: number): number {
    const c = Math.min(Math.max(t, 0), 1);
    return c - Math.sin(2 * Math.PI * c) / (2 * Math.PI);
}
const APPROACH_TILT = 4;
const LAND_SHRINK = 0.04;
/**
 * Fallback camera angles (degrees) for the landing; the section sets them per
 * screen size (--pitch-from / --pitch-to). Smaller screens look down at the desk
 * less steeply, so the desk and the keyboard still have room to show.
 */
const DESK_PITCH_FROM = 76;
const DESK_PITCH_TO = 68;
const WINDOW_LAG = 0.3;

/** How much of the skyline's height stands above the laptop's lid at rest. */
const TOWN_PEEK = 0.6;
/** --cam as a multiple of the laptop's width (keep in step with the section's --cam). */
const CAM_PER_WIDTH = 2.4;
/** Approximate height (px) of the deck's front face, which hangs below its front edge. */
const DECK_FACE = 8;
/** How much of the contact shadow (px) shows past the deck's front face, fading out onto the mat. */
const SHADOW_LIP = 10;
/** How far (px) below the first screen the desk starts, so none of it shows before scrolling. */
const DESK_HIDDEN_MARGIN = 8;
/** How far toward the viewer (× the laptop's width, on the mat) the shadow falls when the laptop is highest. */
const SHADOW_THROW = 0.12;
/** At rest: how far toward the viewer the soft shadow reaches (× the laptop's width), and its blur (px). */
const SHADOW_REST_THROW = 0.02;
const SHADOW_REST_BLUR = 8;
/** How much wider than the laptop's base its shadow reaches (penumbra). */
const SHADOW_SPREAD = 1.04;
/** Fallback shortest landing, as a share of the laptop's width; the section sets it per screen size (--land-min, longer on phones). */
const MIN_LAND_PER_WIDTH = 0.45;
/** An element's layout width, ignoring transforms. */
const rect0Width = (el: HTMLElement) => el.offsetWidth;
/** The sticky header's height: "middle of the screen" means the middle of what's visible below it. */
const HEADER_HEIGHT = 64;

// "Done"'s colour (--hero-done-sky) and the window's light on the wall
// (--wall-light, --wall-a) come per time of day from lib/sky-phase.ts.

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const laptopParallaxRef = useRef<HTMLDivElement>(null);
    const laptopShadowRef = useRef<HTMLDivElement>(null);
    const castShadowRef = useRef<HTMLDivElement>(null);
    const deskRef = useRef<HTMLDivElement>(null);
    const deskEdgeRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const glassRef = useRef<HTMLDivElement>(null);
    const { copied, sendToDesktop } = useSendToDesktop();
    const [platformsOpen, setPlatformsOpen] = useState(false);
    const platformsTriggerRef = useRef<HTMLButtonElement>(null);
    const platformsListRef = useRef<HTMLDivElement>(null);
    const {
        platform: detectedPlatform,
        config: platformInfo,
        isMobile,
    } = usePlatform();

    // The Other platforms list is a native popover, so it renders in the browser's
    // top layer: above the laptop and the window without changing how either of them
    // stacks. The browser handles click-outside and Escape; this keeps React's state
    // in sync and pins the list under its trigger while open.
    useEffect(() => {
        const list = platformsListRef.current;
        if (!list) return;
        const onToggle = (e: Event) => setPlatformsOpen((e as ToggleEvent).newState === "open");
        // Tabbing past the last platform link closes the list.
        const onFocusOut = (e: FocusEvent) => {
            const next = e.relatedTarget as Node | null;
            if (next && !list.contains(next) && next !== platformsTriggerRef.current) list.hidePopover();
        };
        list.addEventListener("toggle", onToggle);
        list.addEventListener("focusout", onFocusOut);
        return () => {
            list.removeEventListener("toggle", onToggle);
            list.removeEventListener("focusout", onFocusOut);
        };
    }, []);

    useEffect(() => {
        if (!platformsOpen) return;
        const list = platformsListRef.current;
        const trigger = platformsTriggerRef.current;
        if (!list || !trigger) return;
        let frame = 0;
        const place = () => {
            frame = 0;
            const r = trigger.getBoundingClientRect();
            // Once the trigger slides under the sticky header, close rather than float over it.
            if (r.bottom < HEADER_HEIGHT) {
                list.hidePopover();
                return;
            }
            const half = list.offsetWidth / 2;
            const center = Math.min(Math.max(r.left + r.width / 2, half + 16), window.innerWidth - half - 16);
            list.style.top = `${r.bottom + 10}px`;
            list.style.left = `${center - half}px`;
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(place);
        };
        place();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        };
    }, [platformsOpen]);

    // Parallax writes transforms straight to the DOM via refs, so scrolling never
    // re-renders this component. Updates stop once the hero is scrolled out of range.
    useEffect(() => {
        // With reduced motion nothing moves (--land is 0 and the sky stays put), but the
        // deck is still fitted to the desk below.
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let frame = 0;
        let lastScroll = -1;
        // How far the laptop is lowered onto the desk (the section's --land; 0 on phones).
        let land = 0;
        // Scroll position where the lowering begins (chosen so the scene is centred
        // while the laptop stands still).
        let start = 0;
        // The desk's vanishing point, measured from the laptop's hinge with the laptop
        // landed; the keyboard deck shares it so both recede toward the same spot.
        let vanish = 0;
        // The landing camera angles for this screen size (see DESK_PITCH_FROM).
        let pitchFrom = DESK_PITCH_FROM;
        let pitchTo = DESK_PITCH_TO;
        // The desk's camera distance (--cam, px); the deck's camera sits twice as far back.
        let cam = 0;
        /**
         * Where the deck's perspective origin goes (px below the hinge, in the
         * laptop's units at scale sc) so that its sides recede toward the same
         * vanishing point as the desk's. A plane tilted back by θ under a camera at
         * distance d recedes toward a point d·cot θ above that camera's origin; the
         * desk's origin is its centre (vanish), the deck's camera is at 2·cam.
         */
        const deckOrigin = (deskPitch: number, deckPitch: number, sc: number) => {
            const cot = (deg: number) => 1 / Math.tan((deg * Math.PI) / 180);
            return (vanish - cam * cot(deskPitch)) / sc + 2 * cam * cot(deckPitch);
        };
        const readLand = () => {
            const section = sectionRef.current;
            const laptop = laptopParallaxRef.current;
            const desk = deskRef.current;
            const edge = deskEdgeRef.current;
            // Start from the section's own --land (an earlier pass may have raised it).
            section?.style.removeProperty("--land");
            section?.style.removeProperty("--shadow-scale");
            const styles = section ? getComputedStyle(section) : null;
            land = styles ? parseFloat(styles.getPropertyValue("--land")) || 0 : 0;
            pitchFrom = styles ? parseFloat(styles.getPropertyValue("--pitch-from")) || DESK_PITCH_FROM : DESK_PITCH_FROM;
            pitchTo = styles ? parseFloat(styles.getPropertyValue("--pitch-to")) || DESK_PITCH_TO : DESK_PITCH_TO;
            if (laptop) {
                // Measure resting places without the scroll transforms on them,
                // with the desk at its landed camera angle.
                const laptopTransform = laptop.style.transform;
                const deskTransform = desk?.style.transform ?? "";
                const sectionPitch = section?.style.getPropertyValue("--pitch") ?? "";
                laptop.style.transform = "none";
                const windowTransform = windowRef.current?.style.transform ?? "";
                if (windowRef.current) windowRef.current.style.transform = "none";
                if (desk) desk.style.transform = "none";

                // Always lower the laptop far enough that you can see it travel onto the desk.
                const landMin = rect0Width(laptop) * (parseFloat(styles?.getPropertyValue("--land-min") ?? "") || MIN_LAND_PER_WIDTH);
                if (!reduceMotion && section && land < landMin) {
                    land = landMin;
                    section.style.setProperty("--land", `${land.toFixed(1)}px`);
                }

                // The first screen shows only the window and the peeking laptop; the desk
                // slides up to meet the laptop once you scroll. Wherever the desk's far
                // edge would show at load (phones, tablets, short screens), lower it,
                // and the landing with it, until it starts just below the first screen.
                const deskTop = desk?.firstElementChild;
                if (!reduceMotion && section && deskTop) {
                    section.style.setProperty("--pitch", `${pitchFrom}deg`);
                    const showing = window.innerHeight + DESK_HIDDEN_MARGIN - (deskTop.getBoundingClientRect().top + window.scrollY);
                    if (showing > 0) {
                        land += showing;
                        section.style.setProperty("--land", `${land.toFixed(1)}px`);
                    }
                }

                section?.style.setProperty("--pitch", `${pitchTo}deg`);
                const rect = laptop.getBoundingClientRect();

                // Raise the town until the top of the skyline (TOWN_PEEK of its height)
                // stands above the laptop's lid instead of behind it.
                const glass = glassRef.current?.getBoundingClientRect();
                const skyline = glassRef.current?.querySelector("svg[viewBox='0 0 240 22']")?.getBoundingClientRect();
                if (section && glass && skyline) {
                    const lift = Math.max(glass.bottom - rect.top - skyline.height * (1 - TOWN_PEEK), 0);
                    section.style.setProperty("--town-lift", `${lift.toFixed(1)}px`);
                }
                const edgeBottom = edge ? edge.getBoundingClientRect().bottom + window.scrollY : 0;
                const deskRect = desk?.getBoundingClientRect();
                const footprint = laptopShadowRef.current?.getBoundingClientRect();
                vanish = deskRect ? deskRect.top + deskRect.height / 2 - rect.bottom - land : 0;
                cam = rect.width * CAM_PER_WIDTH;

                // The deck's depth, chosen so its front edge lands on the front of the
                // laptop's contact shadow: the laptop then sits on the mat, never past
                // the desk's edge. Solved from the deck's projection at the landed
                // angle (in the laptop's own units, which are scaled by LAND_SHRINK).
                if (footprint && footprint.height > 0) {
                    const sc = 1 - LAND_SHRINK;
                    const p = (pitchTo * Math.PI) / 180;
                    const far = 2 * cam;
                    const y = (footprint.bottom - SHADOW_LIP - DECK_FACE - (rect.bottom + land)) / sc;
                    const origin = deckOrigin(pitchTo, pitchTo, sc);
                    const depth = (y * far) / (far * Math.cos(p) + (y - origin) * Math.sin(p));
                    const clamped = Math.min(Math.max(depth, rect.width * 0.35), rect.width * 0.75);
                    if (Number.isFinite(clamped)) {
                        laptop.style.setProperty("--deck-aspect", `${rect.width.toFixed(1)} / ${clamped.toFixed(1)}`);
                        // The shadows on the mat cover the same footprint.
                        section?.style.setProperty("--deck-depth", `${clamped.toFixed(1)}px`);
                    }

                    // The deck and the mat use different cameras, so a shadow as wide as
                    // the laptop on the mat looks narrower than the deck. Widen the shadows
                    // to the deck's front edge as it appears landed, plus a little penumbra.
                    const deckEl = laptop.querySelector<HTMLElement>("[data-laptop-deck]");
                    if (deckEl && footprint.width > 0) {
                        const prevPitch = laptop.style.getPropertyValue("--deck-pitch");
                        const prevVp = laptop.style.getPropertyValue("--vp");
                        laptop.style.setProperty("--deck-pitch", `${pitchTo}deg`);
                        laptop.style.setProperty("--vp", `${deckOrigin(pitchTo, pitchTo, sc).toFixed(1)}px`);
                        const deckWidth = deckEl.getBoundingClientRect().width * sc;
                        laptop.style.setProperty("--deck-pitch", prevPitch);
                        laptop.style.setProperty("--vp", prevVp);
                        const scale = (deckWidth * SHADOW_SPREAD) / footprint.width;
                        if (Number.isFinite(scale) && scale > 0) section?.style.setProperty("--shadow-scale", scale.toFixed(3));
                    }
                }

                laptop.style.transform = laptopTransform;
                if (windowRef.current) windowRef.current.style.transform = windowTransform;
                if (desk) desk.style.transform = deskTransform;
                if (sectionPitch) section?.style.setProperty("--pitch", sectionPitch);
                else section?.style.removeProperty("--pitch");

                const top = rect.top + window.scrollY;
                const screenMiddle = HEADER_HEIGHT + (window.innerHeight - HEADER_HEIGHT) / 2;
                // The scene runs from the landed laptop's top to the desk's front edge.
                // The laptop stands still from start + L, having moved L/2 by then, so
                // start where that puts the scene's middle at the middle of the screen.
                const sceneMiddle = edge ? (top + land + edgeBottom) / 2 : top + land + rect.height / 2;
                start = Math.max(sceneMiddle - land - screenMiddle - land / 2, 0);
            }
            lastScroll = -1;
        };

        const apply = () => {
            frame = 0;
            const raw = Math.max(window.scrollY, 0);
            if (raw === lastScroll) return;
            lastScroll = raw;

            // Desk landing: the laptop eases to a near-standstill mid-screen while the
            // window scrolls away, then eases back into the scroll as the desk meets it.
            const laptop = laptopParallaxRef.current;
            if (!laptop) return;
            const progress = land > 0 ? Math.min(Math.max((raw - start) / (2 * land), 0), 1) : 1;
            const eased = smoothRamp(progress);
            const lowered = land * eased;
            // Held front-up in the air, levelling out as it meets the mat.
            const approach = APPROACH_TILT * (1 - eased);
            const pitch = pitchFrom - (pitchFrom - pitchTo) * eased;
            // The rest: the desk rises and slows into the standing laptop, then both ease
            // back into the scroll (the space they trail into is reserved under the desk).
            const hold = land > 0 ? land * smoothRamp((raw - start - land) / (2 * land)) : 0;
            const sc = 1 - eased * LAND_SHRINK;
            laptop.style.transform = `translate3d(0, ${(lowered + hold).toFixed(2)}px, 0) perspective(var(--cam)) rotateX(${approach.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
            laptop.style.setProperty("--deck-pitch", `${(pitch + approach).toFixed(2)}deg`);
            // The deck recedes toward the desk's vanishing point, as seen from the landed
            // hinge. It travels with the laptop (rather than staying on the desk), so the
            // deck is never seen from below.
            laptop.style.setProperty("--vp", `${deckOrigin(pitch, pitch + approach, sc).toFixed(1)}px`);
            if (deskRef.current) deskRef.current.style.transform = `translate3d(0, ${hold.toFixed(2)}px, 0)`;

            // The window is farther away, so it trails the lowering a little.
            if (windowRef.current) {
                windowRef.current.style.transform = `translate3d(0, ${(lowered * WINDOW_LAG + hold).toFixed(2)}px, 0)`;
            }
            // The camera pitches down toward the desk as the laptop is set down
            // (on the section, so the desk, the mat and the keyboard deck share it).
            sectionRef.current?.style.setProperty("--pitch", `${pitch.toFixed(2)}deg`);

            // Shadows, lying on the mat in the laptop's footprint: a soft one that
            // sharpens and darkens as the laptop comes down, then a tight contact
            // shadow in the last stretch.
            const cast = castShadowRef.current;
            if (cast) {
                // High up it is a faint, wide blur; it gathers and darkens as the laptop
                // nears the mat, ending as the tight shadow it rests on.
                cast.style.opacity = (Math.min(progress / 0.6, 1) * (0.04 + 0.6 * eased ** 3)).toFixed(3);
                cast.style.filter = `blur(${(SHADOW_REST_BLUR + 30 * (1 - eased)).toFixed(1)}px)`;
                // The window light comes from behind the desk, so the higher the laptop,
                // the further toward you the shadow falls, the bigger and rounder it
                // spreads; it slides back under the laptop as it lands. At rest it is a soft
                // contact shadow, a little larger than the base and longest on the
                // viewer's side, never a solid block.
                const lift = 1 - eased;
                const laptopWidth = cam / CAM_PER_WIDTH;
                cast.style.transform = `translateY(${((SHADOW_REST_THROW + lift * SHADOW_THROW) * laptopWidth).toFixed(1)}px) scale(${(1.04 + 0.2 * lift).toFixed(3)}, ${(1.08 + 0.36 * lift).toFixed(3)})`;
                cast.style.borderRadius = `${(7 + 27 * lift).toFixed(1)}% / ${(11 + 34 * lift).toFixed(1)}%`;
            }
            const contact = laptopShadowRef.current;
            if (contact) {
                // Smoothstep over the last 30%, so it fades in without a visible kick.
                const near = Math.min(Math.max((progress - 0.7) / 0.3, 0), 1);
                contact.style.opacity = (near * near * (3 - 2 * near)).toFixed(3);
            }
        };

        const handleScroll = () => {
            if (!frame) frame = window.requestAnimationFrame(apply);
        };
        const handleResize = () => {
            readLand();
            handleScroll();
        };

        // Re-measure when the hero's layout settles (fonts, images) or changes size.
        const observer = new ResizeObserver(handleResize);
        if (sectionRef.current) observer.observe(sectionRef.current);

        readLand();
        apply();
        // Lenis moves the page inside its own animation frame: update in that same
        // frame so the laptop, desk and window never trail the page by a frame.
        // (apply skips repeat positions, so the native listener below is a no-op then.)
        const unsubscribe = onSmoothScroll(apply);
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleResize);
        return () => {
            unsubscribe();
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, []);

    const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Mobile visitors can't install a desktop app: share the link to their computer instead.
        if (platformInfo.isMobileShare) {
            e.preventDefault();
            void sendToDesktop();
        }
    };

    return (
        <section ref={sectionRef} id="hero" className="@container [--hero-done:var(--hero-done-sky)] relative w-full pb-20 sm:pb-4 md:pb-28 lg:pb-34 flex flex-col items-center bg-white overflow-x-clip [--wm:clamp(16px,calc(9cqw_-_24px),220px)] [--ww:min(1120px,calc(100cqw_-_2*var(--wm)))] [--wt:clamp(10px,1.6cqw,24px)] [--so:clamp(8px,2cqw,32px)] [--lw:calc(var(--ww)*0.8)] lg:[--lw:min(900px,calc(var(--ww)_-_2*clamp(130px,14cqw,200px)))] [--ov:0.22] sm:[--ov:0.17] lg:[--ov:0.29] lg:short:[--ov:0.18] [--sill:22px] sm:[--sill:28px] lg:[--sill:36px] xl:[--sill:42px] [--wb:calc(var(--lw)*0.28_-_var(--lw)*var(--ov))] lg:[--wb:calc(var(--wt)/2)] [--land:0px] sm:[--land:140px] lg:[--land:220px] xl:[--land:260px] lg:short:[--land:180px] motion-reduce:[--land:0px] [--land-min:0.75] sm:[--land-min:0.45] [--cam:calc(var(--lw)*2.4)] [--pitch-from:58] [--pitch-to:58] [--pitch:58deg] sm:[--pitch-from:70] sm:[--pitch-to:62] sm:[--pitch:62deg] lg:[--pitch-from:76] lg:[--pitch-to:68] lg:[--pitch:68deg]">
            {/*
              The window hangs on the white wall (the page): a walnut French casement with
              wall space either side, a sill that sticks out past it, and the laptop in
              front, overlapping the window's bottom edge at every size.
              From sm the copy sits inside the glass (both in one grid cell). On phones
              the copy moves out onto the wall above, and the window (panels nearly
              closed) becomes the picture under it, so the text gets full contrast and width.
              There the copy takes 60% of the screen below the header, 50% on tall
              phones (taller than 2:1), or its natural height if that is more, and the window fills the rest above the peeking laptop.
            */}
            <div ref={windowRef} className="relative w-[var(--ww)] mt-[var(--wt)] flex flex-col items-center">
                    <div className="relative w-full grid grid-cols-1 grid-rows-[minmax(auto,calc((100svh_-_64px)*0.6_-_var(--wt)))_minmax(120px,1fr)] [@media(max-aspect-ratio:1/2)]:grid-rows-[minmax(auto,calc((100svh_-_64px)*0.5_-_var(--wt)))_minmax(120px,1fr)] min-h-[calc(100svh_-_64px_-_var(--wt)_-_var(--sill)_-_var(--wb))] sm:grid-rows-1 sm:min-h-0">
                        {/*
                          The window: softened corners and layered shadows (a tight contact
                          shadow, a mid one, and a long soft one falling down the wall), so
                          it sits on the wall instead of looking pasted on.
                        */}
                        <div ref={glassRef} className="relative col-start-1 row-start-2 sm:row-start-1 overflow-hidden rounded-[6px] sm:rounded-[9px] lg:rounded-[12px] shadow-[0_1px_2px_rgb(40_20_10/0.14),0_6px_12px_-6px_rgb(40_20_10/0.22),0_28px_48px_-24px_rgb(40_20_10/0.42)]">
                            {/* The town is raised so its rooftops show above the laptop's lid (--town-lift is
                                measured; the fallback is a close guess for the first paint) */}
                            <WindowSky lift="var(--town-lift, max(0px, calc(var(--lw) * var(--ov) * 0.68 - 40px)))" />
                            <WindowFrame />
                        </div>

            {/* Centered Hero Copy & Actions */}
            <div className={`relative z-30 col-start-1 row-start-1 w-full flex flex-col items-center justify-center gap-7 sm:gap-6 sm:px-12 md:px-14 pt-12 pb-12 sm:pt-24 lg:short:pt-20 sm:pb-[calc(var(--lw)*var(--ov)_+_24px)] sm:min-h-[calc(100svh_-_64px_-_var(--wt)_-_var(--sill)_-_var(--wb))]`}>
                <div
                    aria-hidden="true"
                    className="hidden sm:block pointer-events-none absolute -z-10 left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[min(1000px,135%)] h-[78%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_255_255/0.62),rgb(255_255_255/0.32)_55%,transparent)] blur-2xl transition-opacity duration-1000 opacity-85 in-data-[sky=night]:opacity-100 in-data-[sky=dawn]:opacity-100"
                />
                <div className="w-full flex justify-center items-center">
                    <h1 className="font-pixel text-[clamp(1.8rem,calc(10.7vw_-_5px),2.9rem)] sm:text-display-xl font-semibold text-ink text-center leading-[1.02]">
                        <span className="block whitespace-nowrap animate-hero-headline-1">
                            The Coziest Way
                        </span>
                        <span className="block whitespace-nowrap animate-hero-headline-2">
                            to Get Things{" "}
                            <DoneWord />
                        </span>
                    </h1>
                </div>

                {/* Subtitle */}
                <div className="w-full flex justify-center items-center px-4 animate-hero-fade-up-2">
                    <p className="max-w-[620px] text-base md:text-lg text-muted sm:font-medium sm:text-[#33404D] text-center tracking-[0.01em] leading-relaxed transition-colors duration-1000 sm:in-data-[sky=night]:text-ink sm:in-data-[sky=dawn]:text-ink">
                        A calm Pomodoro timer for your desktop, with a pixel cat who
                        focuses alongside you. Free to download.
                    </p>
                </div>

                {/* Download Options */}
                <div id="hero-cta" className="sm:relative scroll-mt-24 w-full -mx-6 md:-mx-10 pt-2 flex flex-col justify-center items-center gap-4 animate-hero-fade-up-3">
                    {/* CTA row: Download button with Tux beside it */}
                    <div className="relative w-full max-w-chrome flex items-center justify-center">
                        <div className="relative inline-flex items-center justify-center">
                            {/* Plain <a>, not next/link: Link prefetches its href as a page, but installers are files */}
                            <a
                                suppressHydrationWarning
                                href={platformInfo.href}
                                download={platformInfo.fileName}
                                onClick={handleCTAClick}
                                data-os={detectedPlatform}
                                className={buttonClasses({
                                    success: copied,
                                    className: "group min-[360px]:px-7 animate-cta-aura",
                                })}
                            >
                                {copied ? (
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : platformInfo.iconType === "share" ? (
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                        className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    >
                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                        <polyline points="16 6 12 2 8 6" />
                                        <line x1="12" y1="2" x2="12" y2="15" />
                                    </svg>
                                ) : (
                                    // Inline so the icon follows the label color (currentColor)
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                       
                                    >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <path d="M7 10l5 5 5-5" />
                                        <path d="M12 15V3" />
                                    </svg>
                                )}
                                <span className={buttonLabelClasses("lg")}>
                                    {copied ? "Link Copied to Clipboard! 🐾" : platformInfo.label}
                                </span>
                            </a>
                        </div>

                    </div>

                    {/* Secondary meta row: other platforms (desktop) or platform note (mobile) */}
                    <div
                        suppressHydrationWarning
                        className="relative flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs md:text-sm text-muted sm:text-[#33404D] tracking-[0.02em] animate-hero-fade-up-3b transition-colors duration-1000 sm:in-data-[sky=night]:text-ink sm:in-data-[sky=dawn]:text-ink"
                    >
                        {isMobile ? (
                            <span>{platformInfo.altPlatformText}</span>
                        ) : (
                            <div className="relative flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
                            {platformInfo.buildLabel && (
                                <>
                                    <span>{platformInfo.buildLabel}</span>
                                    <span aria-hidden="true">·</span>
                                </>
                            )}
                            <div className="inline-flex items-center">
                                {/* Other Platforms Popover Trigger */}
                                <button
                                    ref={platformsTriggerRef}
                                    type="button"
                                    popoverTarget="other-platforms-list"
                                    aria-expanded={platformsOpen}
                                    aria-controls="other-platforms-list"
                                    className={`inline-flex items-center gap-1 rounded hover:text-black transition-colors duration-200 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                                        platformsOpen
                                            ? "text-black [-webkit-text-stroke:0.35px_currentColor]"
                                            : ""
                                    }`}
                                >
                                    <span className="transition-colors duration-200 group-hover:[-webkit-text-stroke:0.35px_currentColor]">
                                        {platformInfo.altPlatformText || "Other platforms"}
                                    </span>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                        className={`w-4 h-4 transition-all duration-200 group-hover:text-black group-hover:[stroke-width:1.5px] ${
                                            platformsOpen
                                                ? "rotate-180 text-black [stroke-width:1.5px]"
                                                : ""
                                        }`}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>

                                {/*
                                  Floating Other Platforms list (disclosure pattern: plain links, Tab to move).
                                  A native popover in the top layer, placed under the trigger by the effect above.
                                */}
                                <div
                                    ref={platformsListRef}
                                    id="other-platforms-list"
                                    popover="auto"
                                    className="fixed inset-auto m-0 overflow-visible w-[min(340px,calc(100vw_-_32px))] rounded-card bg-white border-2 border-stroke p-1.5 shadow-elevated text-xs md:text-sm text-muted tracking-[0.02em] origin-top opacity-0 -translate-y-1.5 scale-95 open:opacity-100 open:translate-y-0 open:scale-100 starting:open:opacity-0 starting:open:-translate-y-1.5 starting:open:scale-95 transition-[opacity,translate,scale,display,overlay] transition-discrete duration-200 ease-out motion-reduce:transition-none"
                                >
                                    <div className="flex flex-col gap-0.5">
                                        {otherDownloads(platformInfo.downloadId ?? "windows").map((item) => (
                                            <a
                                                key={item.id}
                                                href={item.href}
                                                download={item.fileName}
                                                onClick={() => platformsListRef.current?.hidePopover()}
                                                className="group/item flex items-center justify-between gap-3 px-3 py-2.5 rounded-control hover:bg-sky-50 active:bg-sky-100 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {/* Platform Icon Badge */}
                                                    <div className="w-8 h-8 rounded-chip bg-control-track group-hover/item:bg-accent-strong text-ink group-hover/item:text-white flex items-center justify-center shrink-0 transition-colors">
                                                        <OsIcon os={item.os} />
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-ink-strong group-hover/item:text-black">
                                                            {item.name}
                                                        </span>
                                                        <span className="text-micro leading-snug text-muted">
                                                            {item.subtitle}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* File Format & Download Action */}
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-muted group-hover/item:text-ink shrink-0 transition-colors">
                                                    {item.extension}
                                                    <svg
                                                        width="13"
                                                        height="13"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.75"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M12 5v14M19 12l-7 7-7-7" />
                                                    </svg>
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

                    </div>

                {/* The sill, where Ginger naps and Tux has his coffee: ambient cats that only loop their idle animation (no hover, click or action) */}
                <WindowSill className="z-30">
                    {/* Cats from md, where the sill has room beside the laptop; on phones and small tablets they're left out so the scene doesn't feel cramped */}
                    <div className="hidden md:block absolute bottom-[calc(100%-10px)] sm:bottom-[calc(100%-15px)] lg:bottom-[calc(100%-20px)] xl:bottom-[calc(100%-22px)] left-[1.5%] lg:left-[4%] animate-cat-hop [animation-delay:0.95s]">
                        <SillShadow />
                        <SpriteCat {...CATS.ginger} interactive={false} className={GINGER_SIZE} />
                    </div>
                    <SillPlant className="hidden xl:block absolute bottom-[calc(100%-14px)] right-[1.5%] w-[64px] h-auto" />
                    <div className="hidden md:block absolute bottom-[calc(100%-9px)] sm:bottom-[calc(100%-14px)] lg:bottom-[calc(100%-20px)] xl:bottom-[calc(100%-22px)] right-[1.5%] xl:right-[6.5%] animate-cat-hop [animation-delay:1.12s]">
                        <SillShadow />
                        <SpriteCat {...CATS.tux} interactive={false} className={CAT_SIZE} />
                    </div>
                </WindowSill>
                {/*
                  Light from the window spilling onto the wall below the sill, tinted by
                  the time of day (--wall-light): brightest under the window and fading
                  softly in every direction, so the window and the desk read as one room.
                */}
                <div aria-hidden="true" className="absolute -inset-x-[12%] top-full h-[calc(var(--land)_+_var(--lw)*0.7)] -z-10 pointer-events-none bg-[radial-gradient(ellipse_50%_100%_at_50%_0%,rgb(var(--wall-light)/var(--wall-a))_0%,rgb(var(--wall-light)/calc(var(--wall-a)*0.55))_35%,rgb(var(--wall-light)/calc(var(--wall-a)*0.18))_62%,transparent_85%)]" />
            </div>

            {/*
              The visitor's laptop, in the foreground, overlapping the bottom of the window
              and the sill at every size, as seen from the chair.
            */}
            <div
                ref={laptopParallaxRef}
                className="relative z-40 w-[var(--lw)] mt-[calc(var(--lw)*var(--ov)*-1)] origin-bottom will-change-transform"
            >
                <div className="relative animate-hero-laptop">
                    <div className="relative z-10">
                        <Laptop>
                            <LaptopDesktop />
                        </Laptop>
                    </div>
                </div>
            </div>

            {/*
              The desk, in the window's art style: the same wood-h grain and lighting
              (warm light from the window, the sill's shadow along the back), a front
              edge with highlight and dark underside like the sill, and an apron with a
              drawer that fades into the page. Lighter oak than the sill so the two
              read as different furniture. The felt mat and mug rest on it, placed so
              the laptop's base meets the mat once it has been lowered by --land.
              --pitch is the camera angle, driven by the landing.
            */}
            <div
                ref={deskRef}
                aria-hidden="true"
                className="relative z-0 w-[min(calc(var(--ww)*1.1),calc(100%_-_8px))] h-[calc(var(--lw)*0.2)] mt-[calc(var(--land)_+_var(--lw)*0.02)] mb-[calc(var(--lw)*0.1_+_var(--land))] pointer-events-none select-none [perspective:var(--cam)]"
            >
                {/* Desk top */}
                <div className="wood-h [--wood:#BE936B] absolute inset-x-0 bottom-0 h-[calc(var(--lw)*1.5)] origin-bottom [transform:rotateX(var(--pitch))] rounded-t-[6px] shadow-[inset_0_2px_0_rgb(255_236_210/0.3)]">
                    <div className="absolute inset-0 rounded-t-[6px] bg-[linear-gradient(180deg,rgb(40_20_10/0.22)_0%,transparent_12%,rgb(255_236_210/0.2)_42%,transparent_78%,rgb(30_14_4/0.08)_100%)]" />
                    {/* The window's light landing on the desk: a soft pool toward the back, in the desk's perspective */}
                    <div className="absolute inset-0 rounded-t-[6px] bg-[radial-gradient(ellipse_55%_45%_at_50%_8%,rgb(var(--wall-light)/calc(var(--wall-a)*1.1)),rgb(var(--wall-light)/calc(var(--wall-a)*0.35))_55%,transparent_100%)]" />
                </div>
                {/* Front edge: highlight on top, dark underside, like the sill */}
                <div ref={deskEdgeRef} className="wood-h [--wood:#9A6B45] absolute inset-x-0 top-full h-[clamp(10px,1.7cqw,24px)] rounded-b-[6px] shadow-[inset_0_1px_0_rgb(255_226_196/0.45),inset_0_-1px_0_rgb(30_14_4/0.5),0_2px_3px_rgb(40_20_10/0.25)]" />
                {/* Apron with a drawer, in the desk top's shadow, fading into the page */}
                <div className="wood-h [--wood:#7C5434] absolute inset-x-[4%] top-[calc(100%_+_clamp(10px,1.7cqw,24px))] h-[calc(var(--lw)*0.1)] shadow-[inset_0_8px_10px_-6px_rgb(30_14_4/0.55)] [mask-image:linear-gradient(180deg,#000_30%,transparent)]">
                    <div className="absolute left-1/2 -translate-x-1/2 top-[16%] w-[32%] h-[74%] rounded-[3px] shadow-[inset_0_0_0_1px_rgb(30_14_4/0.4),inset_0_1px_0_rgb(255_226_196/0.14)]">
                        <div className="absolute left-1/2 -translate-x-1/2 top-[20%] w-[18%] h-[clamp(3px,0.45cqw,6px)] rounded-full bg-[#4E3121] shadow-[0_1px_0_rgb(255_226_196/0.3)]" />
                    </div>
                </div>

                {/* The felt mat and what sits on it, centred on the desk */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(var(--lw)*0.025)] w-[min(calc(var(--lw)*1.42),86%)] h-full [perspective:var(--cam)]">
                {/* Thickness: the mat's front lip, then its warm shadow on the desk */}
                <div className="absolute inset-x-[0.4%] -bottom-[clamp(3px,0.5cqw,7px)] h-[clamp(8px,1.4cqw,18px)] rounded-b-[clamp(14px,3cqw,32px)] bg-[linear-gradient(180deg,#C6D5E2,#B3C4D3)] shadow-[0_6px_12px_-4px_rgb(40_20_10/0.3)]" />
                <div className="felt absolute inset-x-0 bottom-0 h-[calc(var(--lw)*0.95)] [--foot:calc(var(--lw)*0.07)] sm:[--foot:calc(var(--lw)*0.12)] lg:[--foot:calc(var(--lw)*0.2)] origin-bottom [transform:rotateX(var(--pitch))] rounded-[clamp(14px,3cqw,32px)] shadow-[inset_0_3px_0_rgb(255_255_255/0.7),inset_0_-2px_0_rgb(40_60_80/0.08)]">
                    <div className="absolute inset-[clamp(6px,1.2cqw,16px)] rounded-[clamp(10px,2.2cqw,22px)] border-2 border-dashed border-[rgb(70_105_140/0.28)]" />
                    {/*
                      Shadows in the laptop's footprint, lying on the mat (so they share its
                      perspective): a soft one that sharpens as the laptop comes down, and a
                      soft contact shadow revealed as it lands. Both fade by gradient, not
                      only blur: on the tilted mat a blur is squashed front-to-back and reads hard.
                    */}
                    <div
                        ref={castShadowRef}
                        className="absolute left-1/2 -ml-[calc(var(--lw)*0.5*var(--shadow-scale,1))] w-[calc(var(--lw)*var(--shadow-scale,1))] bottom-[var(--foot)] h-[var(--deck-depth,calc(var(--lw)*0.6))] rounded-[4%/7%] bg-[radial-gradient(closest-side,rgb(40_20_10/0.34),rgb(40_20_10/0.18)_55%,transparent)] blur-[8px] opacity-0 motion-reduce:opacity-60"
                    />
                    <div
                        ref={laptopShadowRef}
                        className="absolute left-1/2 -ml-[calc(var(--lw)*0.5*var(--shadow-scale,1))] w-[calc(var(--lw)*var(--shadow-scale,1))] bottom-[calc(var(--foot)_-_var(--lw)*0.03)] h-[var(--deck-depth,calc(var(--lw)*0.6))] bg-[linear-gradient(to_top,transparent,rgb(40_20_10/0.3)_9%,rgb(40_20_10/0.3))] [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] blur-[1px] opacity-0 max-sm:opacity-100 motion-reduce:opacity-100"
                    />
                </div>
                </div>
            </div>
        </section>
    );
}
