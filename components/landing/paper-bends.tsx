/**
 * Paper bends: real sticky notes never lie flat, especially stacked on a
 * board. The loose bottom corners curl up, the bottom edge lifts and bows,
 * and the sides cup a little. Each bend is a clip shape for the paper (in
 * objectBoundingBox units, so one shape fits every note size), plus, for the
 * corner curls, the curled-over back of the paper. Light and shade for each
 * bend live in globals.css (search for .hiw-bend).
 */

export type Bend = "flat" | "curl-r" | "curl-l" | "curl-r-sm" | "curl-l-sm" | "bow" | "cup";

/** Corner curls: how far up the side / along the bottom the curl reaches (0 to 1). */
const CURLS = { "curl-r": 0.17, "curl-l": 0.17, "curl-r-sm": 0.1, "curl-l-sm": 0.1 } as const;

const n = (v: number) => +v.toFixed(4);

/** Bottom-right curl of size s; `flip` mirrors it to the bottom-left. */
function curl(s: number, flip: boolean) {
    const X = (d: number) => n(flip ? d : 1 - d); // d = distance in from the curled side
    const Y = (d: number) => n(1 - d); // d = distance up from the bottom
    const paper = flip
        ? `M1,0 H0 V${Y(s)} Q${X(0.325 * s)},${Y(0.325 * s)} ${X(1.3 * s)},1 H1 Z`
        : `M0,0 H1 V${Y(s)} Q${X(0.325 * s)},${Y(0.325 * s)} ${X(1.3 * s)},1 H0 Z`;
    const back =
        `M${X(0)},${Y(s)} Q${X(0.325 * s)},${Y(0.325 * s)} ${X(1.3 * s)},1 ` +
        `C${X(1.15 * s)},${Y(0.325 * s)} ${X(0.975 * s)},${Y(0.675 * s)} ${X(0.75 * s)},${Y(0.925 * s)} ` +
        `Q${X(0.35 * s)},${Y(1.1 * s)} ${X(0)},${Y(s)} Z`;
    return { paper, back };
}

const SHAPES: Partial<Record<Bend, { paper: string; back?: string }>> = {
    ...Object.fromEntries(Object.entries(CURLS).map(([k, s]) => [k, curl(s, k.startsWith("curl-l"))])),
    // the lifted bottom edge, seen from the front, sags a touch in the middle
    bow: { paper: "M0,0 H1 V0.992 Q0.5,0.972 0,0.992 Z" },
    // cupped sides pull in slightly at the middle
    cup: { paper: "M0,0 H1 Q0.988,0.5 1,1 H0 Q0.012,0.5 0,0 Z" },
};

export const hasBack = (b: Bend) => !!SHAPES[b]?.back;

export const bendClip = (b: Bend) => (SHAPES[b] ? `url(#hiw-bend-${b})` : undefined);
export const backClip = (b: Bend) => (SHAPES[b]?.back ? `url(#hiw-bend-${b}-back)` : undefined);

/** The clip shapes, rendered once per page. */
export function PaperBends() {
    return (
        <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
            <defs>
                {Object.entries(SHAPES).map(([k, s]) => (
                    <g key={k}>
                        <clipPath id={`hiw-bend-${k}`} clipPathUnits="objectBoundingBox">
                            <path d={s.paper} />
                        </clipPath>
                        {s.back && (
                            <clipPath id={`hiw-bend-${k}-back`} clipPathUnits="objectBoundingBox">
                                <path d={s.back} />
                            </clipPath>
                        )}
                    </g>
                ))}
            </defs>
        </svg>
    );
}
