import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonClasses, buttonLabelClasses } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Page Not Found",
    robots: { index: false, follow: true },
};

/** Branded 404: shown for any URL that doesn't exist (inside the normal header/footer). */
export default function NotFound() {
    return (
        <section className="w-full max-w-content mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 flex flex-col items-center text-center">
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

            <h1 className="mt-4 font-pixel text-display-md font-semibold text-ink text-balance">
                This Page Took a Pawse
            </h1>
            <p className="mt-4 max-w-[460px] text-base md:text-lg text-muted leading-relaxed text-balance">
                We couldn&apos;t find the page you&apos;re looking for. It may have moved, or the
                link might be broken.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4">
                <Link
                    href="/"
                    className={buttonClasses()}
                >
                    <span className={buttonLabelClasses("md")}>Back to Home</span>
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
