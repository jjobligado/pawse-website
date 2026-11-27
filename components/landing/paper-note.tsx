import Image from "next/image";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { backClip, bendClip, hasBack, type Bend } from "./paper-bends";
import PixelStamp from "./pixel-stamp";
import type { StampFrame, StampName } from "./pixel-stamps";
import type { Ink, Paper } from "./how-it-works-tuning";

/**
 * The paper notes shared by the How It Works wall and Coming Soon: the bent
 * paper itself, the small background note, and the handwriting helpers.
 * Styles live in app/globals.css (search for .hiw-). Both sections rely on
 * <StampFilters /> and <PaperBends />, which How It Works renders once for the
 * whole page.
 */

export type Item = { text: ReactNode; size?: "list" | "dense" | "long" } | { stamp: StampName; caption?: string };

/** Renders one written note: "\n" breaks a line, ~~x~~ crosses out, **x** writes big. */
export function writing(text: string): ReactNode {
    return text.split("\n").map((line, i) => (
        <Fragment key={i}>
            {i > 0 && <br />}
            {line.split(/(~~[^~]+~~|\*\*[^*]+\*\*)/).map((part, j) =>
                part.startsWith("~~") ? (
                    <s key={j}>{part.slice(2, -2)}</s>
                ) : part.startsWith("**") ? (
                    <span key={j} className="hiw-big">
                        {part.slice(2, -2)}
                    </span>
                ) : (
                    part
                ),
            )}
        </Fragment>
    ));
}
/** 3+ lines: written small, like a list (6+: smaller still). A long line or two: a size down so it fits. */
export function T(text: string): Item {
    const lines = text.split("\n").length;
    const long = text.replace(/~~|\*\*/g, "").length > 24;
    // one span, so the lines flow as text inside the note's flex column
    return { text: <span>{writing(text)}</span>, size: lines >= 6 ? "dense" : lines >= 3 ? "list" : long ? "long" : undefined };
}
export const isList = (item: Item) => "size" in item && (item.size === "list" || item.size === "dense");
export const S = (stamp: StampName, caption?: string): Item => ({ stamp, caption });

export type SmallNoteData = {
    item: Item;
    paper: Paper;
    ink: Ink;
    rot: number;
    frame: StampFrame;
    stampRot: number;
    ghost: boolean;
    mark: StampName | null;
    markRot: number;
    press: number;
    taped: boolean;
    /** No writing, at most a small doodle: gives the eye somewhere to rest. */
    blank?: boolean;
    bend?: Bend;
    /** A taped printed photo instead of a sticky note. */
    photo?: { src: string; tilt?: number; tuck?: number };
};

export const vars = (v: Record<string, string>) => v as CSSProperties;

/**
 * The note's paper, bent: clipped to the bend's shape, with its light and
 * shade on top and, for a corner curl, the curled-over back of the paper.
 */
export function BentPaper({ bend = "flat", children }: { bend?: Bend; children: ReactNode }) {
    return (
        <>
            <div className="hiw-paper" style={{ clipPath: bendClip(bend) }}>
                {children}
                {bend !== "flat" && <i className="hiw-bend" data-bend={bend} />}
            </div>
            {hasBack(bend) && <i className="hiw-curl-back" data-bend={bend} style={{ clipPath: backClip(bend) }} />}
        </>
    );
}

export function SmallNote({ note, style, className = "" }: { note: SmallNoteData; style?: CSSProperties; className?: string }) {
    const { item } = note;
    let inner: ReactNode;
    if (note.blank) {
        inner = null;
    } else if ("stamp" in item) {
        const scale = note.frame === "none" ? (item.caption ? 78 : 86) : item.caption ? 92 : 100;
        inner = (
            <>
                <div className="hiw-art">
                    <div className="hiw-stamp-box" style={{ width: `${scale}%`, height: `${scale}%`, rotate: `${note.stampRot}deg` }}>
                        <PixelStamp name={item.stamp} frame={note.frame} press={note.press} ghost={note.ghost} />
                    </div>
                </div>
                {item.caption && <span>{item.caption}</span>}
            </>
        );
    } else {
        inner = item.text;
    }
    const textSize = !note.blank && "size" in item ? item.size : undefined; // list | dense | long
    if (note.photo) {
        return (
            <div className={`hiw-note hiw-print ${className}`} style={{ rotate: `${note.rot}deg`, ...style }}>
                <div className="hiw-print-img">
                    <Image src={note.photo.src} alt="" fill sizes="160px" />
                </div>
                <i className="hiw-tape" />
            </div>
        );
    }
    return (
        <div
            className={`hiw-note ${className}`}
            style={{ ...vars({ "--paper": `var(--hiw-${note.paper})`, "--ink-c": `var(--hiw-ink-${note.ink})` }), rotate: `${note.rot}deg`, ...style }}
        >
            <BentPaper bend={note.bend}>
                <div className={textSize ? `hiw-content hiw-${textSize}` : "hiw-content"}>{inner}</div>
                {note.mark && (
                    <div className="hiw-mark" style={{ rotate: `${note.markRot}deg` }}>
                        <PixelStamp name={note.mark} press={note.press} />
                    </div>
                )}
            </BentPaper>
            {note.taped && <i className="hiw-tape" />}
        </div>
    );
}
