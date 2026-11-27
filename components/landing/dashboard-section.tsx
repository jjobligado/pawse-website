import Image from "next/image";
import Parallax from "@/components/parallax";
import DashboardCards from "@/components/app-ui/dashboard-cards";
import Section, { SECTION_GAP } from "./section";
import { SectionHeader, SectionSubtitle, SectionTitle } from "./section-heading";

const FEATURES = [
    "Every minute you focus, tracked automatically.",
    "See how many sessions you've wrapped up.",
    "Your most-picked companion, revealed.",
    "Spot the days you focus best.",
];

export default function DashboardSection() {
    return (
        <Section id="progress" className={`flex flex-col items-center ${SECTION_GAP}`}>
            <SectionHeader>
                <SectionTitle>Watch Your Focus Habit Grow</SectionTitle>
                <SectionSubtitle className="text-center text-balance">
                    Every session adds to the bigger picture, tracked automatically and
                    kept right on your device.
                </SectionSubtitle>
            </SectionHeader>

            {/* Side by side from lg; stacked (checklist first) below */}
            <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-16">
                {/* Feature Checklist */}
                <div className="w-fit max-w-full lg:w-[400px] lg:shrink-0 flex flex-col items-stretch gap-3.5">
                    {FEATURES.map((item) => (
                        <div key={item} className="w-full flex items-center gap-3.5">
                            <div className="w-6 h-6 shrink-0 relative">
                                <Image
                                    src="/images/check-account.png"
                                    alt=""
                                    width={24}
                                    height={24}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <p className="flex-1 text-base md:text-lg text-ink text-left">{item}</p>
                        </div>
                    ))}
                </div>

                {/* The app's Dashboard cards (a display), scaled as one piece; at most 1.25x the app's size */}
                <Parallax depth={0.05} className="w-full max-w-[616px] lg:flex-1">
                    <DashboardCards />
                </Parallax>
            </div>
        </Section>
    );
}
