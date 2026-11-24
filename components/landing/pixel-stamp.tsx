import { stampRuns, type StampFrame, type StampName } from "./pixel-stamps";

/** Number of distinct presses (ink noise patterns); stamps cycle through them. */
export const STAMP_PRESSES = 4;

/**
 * The ink for every stamp, rendered once per page. Each press measures its
 * noise in grid cells: a slight wobble on the pixel edges, a fine rubber
 * grain, and broad patches where the press was light.
 */
export function StampFilters() {
    return (
        <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
            <defs>
                {Array.from({ length: STAMP_PRESSES }, (_, i) => (
                    <filter key={i} id={`stamp-press-${i}`} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
                        <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves={2} seed={3 + i * 11} result="wob" />
                        <feDisplacementMap in="SourceGraphic" in2="wob" scale="0.14" xChannelSelector="R" yChannelSelector="G" result="d" />
                        <feComponentTransfer in="d" result="ink">
                            <feFuncA type="linear" slope="0.9" />
                        </feComponentTransfer>
                        <feTurbulence type="fractalNoise" baseFrequency="1.7" numOctaves={1} seed={5 + i * 7} result="g" />
                        <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3 0 0 0 2.55" result="gm" />
                        <feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves={2} seed={9 + i * 5} result="p" />
                        <feColorMatrix in="p" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.2 0 0 0 2.75" result="pm" />
                        <feComposite in="ink" in2="gm" operator="in" result="grained" />
                        <feComposite in="grained" in2="pm" operator="in" />
                    </filter>
                ))}
            </defs>
        </svg>
    );
}

/**
 * A pixel drawing pressed as a rubber stamp. Prints in `currentColor`
 * (the note sets `--ink-c`) and multiplies into the paper underneath.
 * `ghost` adds a faint second press, slightly off.
 */
export default function PixelStamp({
    name,
    frame = "none",
    press = 0,
    ghost = false,
}: {
    name: StampName;
    frame?: StampFrame;
    press?: number;
    ghost?: boolean;
}) {
    const { W, H, runs } = stampRuns(name, frame);
    const body = runs.map(([x, y, len]) => <rect key={`${x}-${y}`} x={x} y={y} width={len} height={1} />);
    return (
        <svg
            className="hiw-stamp"
            viewBox={`-0.5 -0.5 ${W + 1} ${H + 1}`}
            shapeRendering="crispEdges"
            aria-hidden="true"
            focusable="false"
        >
            <g filter={`url(#stamp-press-${press % STAMP_PRESSES})`} fill="currentColor">
                {ghost && (
                    <g opacity={0.22} transform="translate(0.7 0.45)">
                        {runs.map(([x, y, len]) => (
                            <rect key={`${x}-${y}`} x={x} y={y} width={len} height={1} />
                        ))}
                    </g>
                )}
                {body}
            </g>
        </svg>
    );
}
