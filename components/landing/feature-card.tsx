import type { ReactNode } from "react";

interface FeatureCardProps {
    children: ReactNode;
    /** Sizing, padding and gap for this card's context (no conflicting base utilities). */
    className?: string;
    /** Render as a link: the whole card becomes clickable, with a pointer cursor and focus ring. */
    href?: string;
}

const BASE =
    "group relative overflow-hidden w-full mx-auto h-full flex flex-col justify-center items-center rounded-2xl border-2 border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#D3EDFF_75%,#A8DCFF_100%)] transition-all duration-500 ease-out hover:-translate-y-2 hover:border-accent hover:shadow-[0_20px_35px_-4px_rgba(20,20,20,0.14),0_8px_16px_-4px_rgba(20,20,20,0.08)]";

/**
 * Sky-gradient card with a hover lift and a "liquid" fill that rises from the
 * bottom. Used by How It Works (as links) and Coming Soon. Children render above the fill.
 */
export default function FeatureCard({ children, className = "", href }: FeatureCardProps) {
    const fill = (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-0 bottom-0 h-[150%] bg-[linear-gradient(to_top,#C8E8FF_0%,#C8E8FF_70%,transparent_100%)] translate-y-full group-hover:translate-y-0 transition-transform duration-600 ease-out"
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
