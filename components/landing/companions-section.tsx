import CompanionCards from "./companion-cards";
import { SectionSubtitle, SectionTitle } from "./section-heading";

export default function CompanionsSection() {
    return (
        <section
            id="companions"
            className="scroll-mt-20 relative w-full py-16 md:py-24 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-6 bg-white overflow-hidden"
        >
            {/* Dynamic Multi-Core Liquid Blue Current (Stretches Full Section Height & Bleeds Horizontally) */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 w-full h-full flex items-center justify-center select-none overflow-hidden"
                style={{
                    maskImage:
                        "radial-gradient(ellipse 100% 88% at 50% 50%, black 42%, transparent 100%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 100% 88% at 50% 50%, black 42%, transparent 100%)",
                }}
            >
                {/* Ambient Base Body (Light airy sky mist stretching full section height) */}
                <div className="w-[130%] h-full bg-[radial-gradient(ellipse_at_center,rgba(195,232,255,0.4)_0%,rgba(215,242,255,0.22)_40%,rgba(235,248,255,0.08)_70%,transparent_95%)] filter blur-[50px] sm:blur-[70px] md:blur-[90px]" />

                {/* Fluid Core 1 (West Current - Left Area / Behind Ginger) */}
                <div className="absolute left-[2%] sm:left-[5%] top-[12%] sm:top-[16%] w-[42%] md:w-[35%] h-[52%] md:h-[58%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(105,195,255,0.68)_0%,rgba(155,220,255,0.42)_40%,rgba(205,238,255,0.15)_70%,transparent_88%)] animate-fluid-left will-change-transform filter blur-[32px] sm:blur-[44px] md:blur-[56px]" />

                {/* Fluid Core 2 (East Current - Right Area / Behind Tux) */}
                <div className="absolute right-[2%] sm:right-[5%] top-[20%] sm:top-[24%] w-[40%] md:w-[34%] h-[50%] md:h-[56%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(90,188,252,0.64)_0%,rgba(145,216,255,0.38)_40%,rgba(200,236,255,0.14)_70%,transparent_88%)] animate-fluid-right will-change-transform filter blur-[32px] sm:blur-[44px] md:blur-[56px]" />

                {/* Fluid Core 3 (South Current - Surging Upward & Centered Beneath Cards) */}
                <div className="absolute left-[28%] sm:left-[32%] bottom-[2%] sm:bottom-[6%] w-[45%] md:w-[38%] h-[48%] md:h-[54%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(125,208,255,0.66)_0%,rgba(170,226,255,0.4)_42%,rgba(215,242,255,0.15)_70%,transparent_88%)] animate-fluid-bottom will-change-transform filter blur-[30px] sm:blur-[42px] md:blur-[54px]" />
            </div>

            <div className="relative z-10 w-full max-w-[1140px] flex flex-col items-center gap-6">
                <SectionTitle>Meet Your Companions</SectionTitle>
                <SectionSubtitle>Every session comes with company.</SectionSubtitle>

                {/* Stacked Cards Interactive Group */}
                <CompanionCards />

                <SectionSubtitle className="text-center text-balance">
                    Three cats, three paces: 15, 25, or 50‑minute sessions. Pick the one
                    that matches how you actually focus.
                </SectionSubtitle>
            </div>
        </section>
    );
}
