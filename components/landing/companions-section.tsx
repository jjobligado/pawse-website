import CompanionCards from "./companion-cards";
import { SectionSubtitle, SectionTitle } from "./section-heading";

export default function CompanionsSection() {
    return (
        <section
            id="companions"
            className="scroll-mt-20 relative w-full py-12 md:py-24 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-6"
        >
            <div className="relative z-10 w-full max-w-[1140px] flex flex-col items-center gap-6">
                <SectionTitle>Meet Your Companions</SectionTitle>
                <SectionSubtitle>Every session comes with company.</SectionSubtitle>

                {/* The app's companion cards (a display) */}
                <CompanionCards />

                <SectionSubtitle className="text-center text-balance">
                    Three cats, three paces: 15, 25, or 50‑minute sessions. Pick the one
                    that matches how you actually focus.
                </SectionSubtitle>
            </div>
        </section>
    );
}
