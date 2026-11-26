import CompanionCards from "./companion-cards";
import { SECTION_GAP, SECTION_SPACING } from "./section";
import { SectionHeader, SectionSubtitle, SectionTitle } from "./section-heading";

export default function CompanionsSection() {
    return (
        <section
            id="companions"
            className={`scroll-mt-20 relative w-full ${SECTION_SPACING} px-6 md:px-12 lg:px-20 flex flex-col items-center`}
        >
            <div className={`relative z-10 w-full max-w-[1140px] flex flex-col items-center ${SECTION_GAP}`}>
                <SectionHeader>
                    <SectionTitle>Meet Your Companions</SectionTitle>
                    <SectionSubtitle>Every session comes with company.</SectionSubtitle>
                </SectionHeader>

                <div className="w-full flex flex-col items-center gap-6 md:gap-8">
                    {/* The app's companion cards (a display) */}
                    <CompanionCards />

                    <SectionSubtitle className="text-center text-balance">
                        Three cats, three paces: 15, 25, or 50‑minute sessions. Pick the one
                        that matches how you actually focus.
                    </SectionSubtitle>
                </div>
            </div>
        </section>
    );
}
