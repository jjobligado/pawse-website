/**
 * The three companions as sill sprites (see docs/SPRITES.md). Shared by the hero
 * and the closing download banner, so a cat behaves the same everywhere.
 *
 * Idle loops on its own; hover / tap plays the break sheet once.
 */

const SPRITES = "/sprites";

/**
 * Cat boxes: 64px frames at whole-number scales so pixels stay crisp
 * (1x phones, 1.5x tablets, 2x from lg).
 */
export const CAT_SIZE = "w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32";

/**
 * Ginger curls up small when napping, so she gets a slightly bigger box than Tux
 * (about 1.1-1.25x his size). Sized to still clear the laptop on every screen.
 */
export const GINGER_SIZE = "w-[72px] h-[72px] sm:w-[104px] sm:h-[104px] lg:w-36 lg:h-36 xl:w-40 xl:h-40";

export const CATS = {
    ginger: {
        label: "Wake Ginger for a break",
        idle: { src: `${SPRITES}/ginger-body-focus-sheet.png`, frames: 3 },
        action: { src: `${SPRITES}/ginger-body-break-sheet.png`, frames: 9 },
        // Slow breathing: z, zz, zzz
        idleSequence: [
            { frame: 0, ms: 900 },
            { frame: 1, ms: 900 },
            { frame: 2, ms: 1100 },
        ],
    },
    tux: {
        label: "Give Tux a break",
        idle: { src: `${SPRITES}/tux-body-focus-sheet.png`, frames: 5 },
        action: { src: `${SPRITES}/tux-body-break-sheet.png`, frames: 10 },
        // Holds the mug, lifts it, sips, lowers it
        idleSequence: [
            { frame: 0, ms: 2600 },
            { frame: 1, ms: 160 },
            { frame: 2, ms: 220 },
            { frame: 3, ms: 900 },
            { frame: 2, ms: 220 },
            { frame: 1, ms: 160 },
        ],
    },
    void: {
        label: "Give Void a break",
        idle: { src: `${SPRITES}/void-body-idle-sheet.png`, frames: 5 },
        action: { src: `${SPRITES}/void-body-break-sheet.png`, frames: 7 },
    },
} as const;
