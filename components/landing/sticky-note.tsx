import type { ReactNode } from "react";

/**
 * A plain, matte pastel sticky note inspired by digital whiteboard boards.
 *
 * No tape, pins, ruled lines, or embedded media — just crisp square paper,
 * a soft bottom-heavy drop shadow, left-aligned note copy, and an optional
 * bottom action link.
 */

export type StickyNoteColor = "yellow" | "sky" | "mint" | "lavender";

const NOTE_PALETTE: Record<StickyNoteColor, { fill: string; border: string }> = {
    yellow: {
        fill: "bg-[#FFEFA1]",
        border: "border-[#EEDB7A]/70",
    },
    sky: {
        fill: "bg-[#CBE8FF]",
        border: "border-[#AFD6F7]/70",
    },
    mint: {
        fill: "bg-[#CEF5C8]",
        border: "border-[#B0E4A8]/70",
    },
    lavender: {
        fill: "bg-[#E6D1FF]",
        border: "border-[#D0B4F7]/70",
    },
};

export default function StickyNote({
    step,
    color,
    className = "",
    children,
}: {
    /** Step stamp printed at the top-left of the note (e.g. "01"). */
    step: string;
    color: StickyNoteColor;
    className?: string;
    children: ReactNode;
}) {
    const palette = NOTE_PALETTE[color];

    return (
        <article
            className={`group/note relative z-10 flex flex-col justify-between aspect-square p-5 rounded-[3px] border ${palette.border} ${palette.fill} text-left shadow-[0_1px_2px_rgb(20_20_20/0.05),0_10px_18px_-6px_rgb(20_20_20/0.16),0_18px_28px_-14px_rgb(20_20_20/0.2)] transition-[translate,rotate,scale,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:z-20 motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-[1.02] hover:shadow-[0_3px_6px_rgb(20_20_20/0.06),0_18px_30px_-8px_rgb(20_20_20/0.22),0_28px_44px_-18px_rgb(20_20_20/0.24)] ${className}`}
        >
            <div className="flex items-center justify-between">
                <span className="font-pixel text-xs font-semibold tracking-wider text-ink/60">
                    {step}
                </span>
            </div>

            <div className="flex flex-1 flex-col pt-3">{children}</div>
        </article>
    );
}
