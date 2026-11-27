/**
 * What testers say about PAWSE, for the Testimonials section.
 *
 * PLACEHOLDER: the names, roles and quotes below are samples (lorem ipsum)
 * until real closed-beta quotes come in. While SAMPLE is true the section only
 * renders in development, so these never reach the live site.
 *
 * Each real entry needs the person's written consent (keep it with `consent`),
 * their wording approved after any trims, and a "Beta tester" tag for anyone
 * who got the app early or knows the team. Re-read the quotes at each release:
 * one that names a feature can go out of date.
 */

export type Companion = "tux" | "ginger" | "void";

export interface Testimonial {
    quote: string;
    /** First name and last initial, e.g. "Maya R." */
    name: string;
    /** What they do, e.g. "CS Student". */
    role: string;
    /** The companion they focus with most. */
    companion: Companion;
    /** How they know the app (shown as a small tag). */
    tag: string;
    /** When they agreed to be quoted (YYYY-MM-DD). Empty for samples. */
    consent: string;
}

/** Flip to false once every entry below is a real, consented quote. */
export const SAMPLE = true;

/** Whether the section (and the nav links to it) show: always in development, and live only once the quotes are real. */
export const SHOW_TESTIMONIALS = !SAMPLE || process.env.NODE_ENV !== "production";

export const COMPANIONS: Record<Companion, { name: string; minutes: number; colour: string }> = {
    tux: { name: "Tux", minutes: 25, colour: "var(--color-companion-tux)" },
    ginger: { name: "Ginger", minutes: 15, colour: "var(--color-companion-ginger)" },
    void: { name: "Void", minutes: 50, colour: "var(--color-companion-void)" },
};

export const TESTIMONIALS: Testimonial[] = [
    {
        quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        name: "Maya R.",
        role: "Computer Science Student",
        companion: "tux",
        tag: "Beta tester",
        consent: "",
    },
    {
        quote: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        name: "Daniel K.",
        role: "Freelance Illustrator",
        companion: "ginger",
        tag: "Beta tester",
        consent: "",
    },
    {
        quote: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat.",
        name: "Aiko T.",
        role: "Remote Software Engineer",
        companion: "void",
        tag: "Beta tester",
        consent: "",
    },
];

/** Section copy (placeholder subtitle until the quotes are real). */
export const TESTIMONIALS_COPY = {
    title: "What Our Testers Say",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
};
