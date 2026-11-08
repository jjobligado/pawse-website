import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Page Not Found",
    robots: { index: false, follow: true },
};

/** Branded 404: shown for any URL that doesn't exist (inside the normal header/footer). */
export default function NotFound() {
    return (
        <section className="w-full max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 flex flex-col items-center text-center">
            {/* Void, napping on the job */}
            <div aria-hidden="true" className="relative mb-2">
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 bg-white border-2 border-ink shadow-pixel whitespace-nowrap">
                    <span className="font-pixel text-xs font-semibold text-ink">Nothing to see here... 🌙</span>
                    <span className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r-2 border-b-2 border-ink rotate-45" />
                </div>
                <Image
                    src="/images/black-cat.png"
                    alt=""
                    width={160}
                    height={160}
                    unoptimized
                    priority
                    className="w-32 h-32 md:w-40 md:h-40 [image-rendering:pixelated]"
                />
            </div>

            <p className="font-pixel text-5xl md:text-6xl font-semibold text-accent-strong leading-none">404</p>

            <h1 className="mt-4 font-pixel text-[clamp(1.75rem,1.4rem+1.5vw,2.75rem)] font-semibold text-ink leading-[1.1] text-balance">
                This Page Took a Pawse
            </h1>
            <p className="mt-4 max-w-[460px] text-base md:text-lg text-muted leading-relaxed text-balance">
                We couldn&apos;t find the page you&apos;re looking for. It may have moved, or the
                link might be broken.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 py-2.5 px-7 rounded-full bg-accent-strong hover:bg-accent-strong-hover active:bg-accent-strong-active text-white shadow-glow transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                    <span className="font-pixel text-lg font-semibold">Back to Home</span>
                </Link>
                <p className="text-sm text-muted">
                    Think something&apos;s broken?{" "}
                    <Link href="/#contact" className="font-medium text-ink link-underline">
                        Let us know
                    </Link>
                    .
                </p>
            </div>
        </section>
    );
}
