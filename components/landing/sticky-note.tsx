import type { ReactNode } from "react";

/**
 * A tactile sticky note pinned to the desk workspace mat.
 *
 * Designed like real stationery: an adhesive strip across the top, a subtle
 * ruled-paper pattern, a stepped bottom-corner lift shadow, and a CSS push-pin.
 * Informational only (never a full-card button); interactive links belong in
 * the body below the sticker.
 */

export type StickyNoteColor = "yellow" | "sky" | "mint" | "lavender";
export type PushPinColor = "coral" | "blue" | "sage" | "amber";

const NOTE_PALETTE: Record<
    StickyNoteColor,
    { paper: string; adhesive: string; border: string; curl: string }
> = {
    yellow: {
        paper: "bg-[linear-gradient(180deg,#FFF4B0_0%,#FFF7C8_100%)]",
        adhesive: "bg-[#F7E588]/75",
        border: "border-[#E9D56E]/60",
        curl: "bg-[#EFE08E]",
    },
    sky: {
        paper: "bg-[linear-gradient(180deg,#D6EEFF_0%,#E7F5FF_100%)]",
        adhesive: "bg-[#B8DFFB]/75",
        border: "border-[#A4D2F4]/60",
        curl: "bg-[#BCE0FA]",
    },
    mint: {
        paper: "bg-[linear-gradient(180deg,#E2F8C1_0%,#EEFBD9_100%)]",
        adhesive: "bg-[#C7EB95]/75",
        border: "border-[#B5DF7C]/60",
        curl: "bg-[#CFEF9F]",
    },
    lavender: {
        paper: "bg-[linear-gradient(180deg,#EEDBFF_0%,#F6EBFF_100%)]",
        adhesive: "bg-[#DFC0FB]/75",
        border: "border-[#CDA6F5]/60",
        curl: "bg-[#E2C6FA]",
    },
};

const PIN_PALETTE: Record<PushPinColor, { cap: string; rim: string }> = {
    coral: { cap: "bg-[#F06B5A]", rim: "border-[#C74737]" },
    blue: { cap: "bg-[#35A6F1]", rim: "border-[#1D7BB8]" },
    sage: { cap: "bg-[#5BB36A]", rim: "border-[#3B8B49]" },
    amber: { cap: "bg-[#F29D38]", rim: "border-[#C47418]" },
};

/** Small tactile 3D push-pin anchoring the sticky note to the desk mat. */
function PushPin({ color }: { color: PushPinColor }) {
    const pin = PIN_PALETTE[color];
    return (
        <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
        >
            {/* Pin cast shadow onto the adhesive strip */}
            <span className="absolute top-2.5 left-1.5 w-3.5 h-2 rounded-full bg-black/15 blur-[1.5px]" />
            {/* Pin head */}
            <span
                className={`relative block w-4 h-4 rounded-full border ${pin.cap} ${pin.rim} shadow-[0_2px_3px_rgb(20_20_20/0.25),inset_0_2px_2px_rgb(255_255_255/0.55)]`}
            >
                <span className="absolute top-[2px] left-[3px] w-1.5 h-1 rounded-full bg-white/70 -rotate-12" />
            </span>
        </span>
    );
}

export default function StickyNote({
    step,
    color,
    pinColor = "coral",
    sticker,
    className = "",
    children,
}: {
    /** Step index label printed in the top-left adhesive band (e.g. "01"). */
    step: string;
    color: StickyNoteColor;
    pinColor?: PushPinColor;
    /** Static pixel illustration rendered as a crisp sticker patch on the note. */
    sticker: ReactNode;
    className?: string;
    children: ReactNode;
}) {
    const palette = NOTE_PALETTE[color];

    return (
        <figure
            className={`group/note relative flex flex-col rounded-[3px] rounded-br-[14px_6px] border ${palette.border} ${palette.paper} shadow-[0_1px_2px_rgb(35_30_20/0.08),0_6px_12px_-6px_rgb(35_30_20/0.16),0_16px_26px_-18px_rgb(35_30_20/0.28)] transition-[translate,rotate,scale,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:z-10 motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-[1.02] hover:shadow-[0_2px_4px_rgb(35_30_20/0.08),0_14px_24px_-10px_rgb(35_30_20/0.2),0_28px_44px_-22px_rgb(35_30_20/0.34)] ${className}`}
        >
            {/* Subtle lifted-corner shadow behind the peeled bottom edge */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -z-10 bottom-1 right-1.5 w-[72%] h-5 rounded-full bg-[rgb(35_30_20/0.16)] blur-[5px] rotate-[1.8deg] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover/note:translate-y-1 motion-safe:group-hover/note:opacity-90"
            />

            <PushPin color={pinColor} />

            {/* Top adhesive strip with step stamp */}
            <div
                className={`relative flex items-center px-3.5 h-7 border-b border-black/[0.05] rounded-t-[2px] ${palette.adhesive}`}
            >
                <span className="font-pixel text-xs font-semibold tracking-wider text-ink/75">
                    {step}
                </span>
            </div>

            {/* Ruled note paper body */}
            <div
                className="relative flex flex-1 flex-col px-4 pt-3.5 pb-4"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(180deg, transparent 0 23px, rgb(20 20 20 / 0.045) 23px 24px)",
                }}
            >
                {/* Pixel artwork set directly on the sticky paper with a soft chalk halo */}
                <div className="relative mx-auto mb-2.5 flex w-full items-center justify-center py-1">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-3 inset-y-0 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.72),rgb(255_255_255/0.35)_58%,transparent)]"
                    />
                    <div className="relative z-[1] w-full">{sticker}</div>
                </div>

                {/* Sketchbook divider line */}
                <div aria-hidden="true" className="mx-auto mb-3 w-12 h-[2px] rounded-full bg-ink/15" />

                <figcaption className="flex flex-1 flex-col">{children}</figcaption>
            </div>

            {/* Subtle curled bottom-right corner highlight */}
            <span
                aria-hidden="true"
                className={`pointer-events-none absolute bottom-0 right-0 w-3.5 h-2 rounded-tl-[6px] opacity-75 shadow-[-1px_-1px_2px_rgb(20_20_20/0.08)] ${palette.curl}`}
            />
        </figure>
    );
}
