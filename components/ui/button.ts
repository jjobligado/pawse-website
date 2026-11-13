/**
 * The one button style. Returns class names, so it works on every element a
 * button can be: `<a download>` for installers (never next/link, which would
 * prefetch the file as a page), next/link `<Link>` for routes, and `<button>`.
 *
 *   <a className={buttonClasses()}>…<span className={buttonLabelClasses()}>Download</span></a>
 *
 * Variants:
 * - `primary`: white semibold pixel label on accent-strong, glow, lifts on hover.
 *   `success` swaps it to green for the "Link copied" confirmation.
 * - `ink`: the compact charcoal header button. No glow, no lift.
 *
 * Label sizes:
 * - `md`: 18px (forms, 404)
 * - `lg`: 16 → 18 → 20px (hero and closing banner CTAs)
 * - `header`: 14 → 17px (header only)
 */

type ButtonVariant = "primary" | "ink";
type LabelSize = "md" | "lg" | "header";

const BASE =
    "inline-flex items-center justify-center gap-2 rounded-pill whitespace-nowrap select-none cursor-pointer " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:cursor-not-allowed disabled:opacity-70";

const VARIANTS: Record<ButtonVariant, string> = {
    primary:
        "py-2.5 px-5 sm:px-7 text-white shadow-glow focus-visible:ring-accent " +
        "transition-[background-color,box-shadow,translate,scale] duration-(--duration-short) ease-standard " +
        "not-disabled:hover:-translate-y-0.5 not-disabled:hover:shadow-glow-hover " +
        "not-disabled:active:translate-y-0 not-disabled:active:scale-[0.97] not-disabled:active:shadow-glow-active",
    ink:
        "h-[38px] sm:h-[40px] px-4 sm:px-6 shrink-0 text-white focus-visible:ring-ink " +
        "transition-colors duration-(--duration-micro)",
};

const PRIMARY_COLORS = {
    idle: "bg-accent-strong not-disabled:hover:bg-accent-strong-hover not-disabled:active:bg-accent-strong-active",
    success: "bg-success hover:bg-success-hover",
};

const INK_COLORS = {
    idle: "bg-ink hover:bg-ink-hover active:bg-ink-active",
    pressed: "bg-ink-active",
};

export function buttonClasses({
    variant = "primary",
    success = false,
    pressed = false,
    className = "",
}: {
    variant?: ButtonVariant;
    /** primary only: green confirmation state */
    success?: boolean;
    /** ink only: held state while the click handler runs */
    pressed?: boolean;
    className?: string;
} = {}): string {
    const colors =
        variant === "primary"
            ? success
                ? PRIMARY_COLORS.success
                : PRIMARY_COLORS.idle
            : pressed
              ? INK_COLORS.pressed
              : INK_COLORS.idle;
    return `${BASE} ${VARIANTS[variant]} ${colors} ${className}`.trim();
}

const LABEL_SIZES: Record<LabelSize, string> = {
    md: "text-lg",
    lg: "text-base min-[360px]:text-lg md:text-xl",
    header: "text-sm sm:text-label tracking-wide leading-none",
};

/** Pixel-font label inside a button: always semibold, never bold. */
export function buttonLabelClasses(size: LabelSize = "md"): string {
    return `font-pixel font-semibold ${LABEL_SIZES[size]}`;
}
