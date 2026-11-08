import type { ReactNode } from "react";

interface FeatureCardProps {
    children: ReactNode;
    /** Sizing, padding and gap for this card's context (no conflicting base utilities). */
    className?: string;
    /** Render as a link: the whole card becomes clickable, with a pointer cursor and focus ring. */
    href?: string;
}

const BASE =
    "group relative overflow-hidden w-full mx-auto h-full flex flex-col justify-center items-center rounded-2xl border-2 border-stroke surface-sky transition-all duration-500 ease-out hover:-translate-y-2 hover:border-accent hover:shadow-elevated";

/**
 * Sky-gradient card with a hover lift and a "liquid" fill that rises from the
 * bottom. Used by How It Works (as links) and Coming Soon. Children render above the fill.
 */
export default function FeatureCard({ children, className = "", href }: FeatureCardProps) {
    const fill = (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-0 bottom-0 h-[150%] surface-sky-fill translate-y-full group-hover:translate-y-0 transition-transform duration-600 ease-out"
        />
    );

    if (href) {
        return (
            <a
                href={href}
                className={`${BASE} cursor-pointer focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}
            >
                {fill}
                {children}
            </a>
        );
    }

    return (
        <div className={`${BASE} cursor-default ${className}`}>
            {fill}
            {children}
        </div>
    );
}
