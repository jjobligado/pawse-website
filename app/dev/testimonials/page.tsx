import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TestimonialsSection, { type TestimonialsVariant } from "@/components/landing/testimonials-section";

/**
 * Dev-only: the four Testimonials directions stacked, to compare them in the
 * site's own type, colour and spacing. 404s in production.
 */

export const metadata: Metadata = {
    title: "Testimonials directions (dev)",
    robots: { index: false, follow: false },
};

const DIRECTIONS: { variant: TestimonialsVariant; label: string; note: string }[] = [
    {
        variant: "postcards",
        label: "A · Postcards on a Line",
        note: "Three postcards pegged to twine. The stamp is the tester's companion and its session length; quotes are handwritten in the wall's Gaegu.",
    },
    {
        variant: "guestbook",
        label: "B · The Guestbook",
        note: "An open guestbook in the window frame's walnut. Each entry is signed and pressed with the tester's companion like a paw stamp.",
    },
    {
        variant: "cards",
        label: "C · Quiet Cards",
        note: "Plain white cards in the FAQ and contact style. The calmest option; the companion avatar is the only playful touch.",
    },
    {
        variant: "log",
        label: "D · Session Notes",
        note: "Entries in an app-style window, each tagged with the companion and a completed session, like the Progress screen.",
    },
];

export default function TestimonialsDirections() {
    if (process.env.NODE_ENV === "production") notFound();

    return (
        <main className="w-full bg-white">
            <nav className="sticky top-0 z-50 flex flex-wrap justify-center gap-2 border-b border-stroke bg-white/90 px-4 py-3 backdrop-blur">
                {DIRECTIONS.map((d) => (
                    <a
                        key={d.variant}
                        href={`#t-${d.variant}`}
                        className="rounded-pill border border-stroke px-3 py-1.5 text-sm text-ink-soft hover:bg-sky-50"
                    >
                        {d.label}
                    </a>
                ))}
            </nav>
            {DIRECTIONS.map((d) => (
                <div key={d.variant} className="border-b-4 border-dashed border-stroke">
                    <div className="mx-auto max-w-content px-6 pt-10 md:px-12 lg:px-20">
                        <p className="font-pixel text-sm text-accent-strong">{d.label}</p>
                        <p className="mt-1 max-w-2xl text-sm text-muted">{d.note}</p>
                    </div>
                    <TestimonialsSection variant={d.variant} id={`t-${d.variant}`} />
                </div>
            ))}
        </main>
    );
}
