import Image from "next/image";
import { DashboardSpreadSection } from "@/components/pixel-divider";
import { SectionSubtitle, SectionTitle } from "./section-heading";

const FEATURES = [
    "Every minute you focus, tracked automatically.",
    "See how many sessions you've wrapped up.",
    "Your most-picked companion, revealed.",
    "Spot the days you focus best.",
];

export default function DashboardSection() {
    return (
        <DashboardSpreadSection id="progress">
            <SectionTitle>Dashboard</SectionTitle>
            <SectionSubtitle>
                Every session adds to the bigger picture. Watch your focus habit take
                shape over time.
            </SectionSubtitle>

            <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-8 mt-2">
                {/* Feature Checklist */}
                <div className="w-full lg:w-[440px] flex flex-col items-stretch gap-4">
                    <div className="w-full flex flex-col items-stretch gap-3.5">
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
                                <p className="flex-1 text-base md:text-lg text-ink text-left">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dashboard Preview Image */}
                <div className="w-full max-w-[600px] lg:flex-1 shrink-0 shadow-[0px_0px_30px_0px_rgba(0,0,0,0.15)] rounded-xl overflow-hidden bg-white">
                    <Image
                        src="/images/dashboard.png"
                        alt="PAWSE Dashboard showing focus time, completed pomodoros, favorite companion, and weekly flow"
                        width={600}
                        height={433}
                        className="w-full h-auto object-cover"
                    />
                </div>
            </div>
        </DashboardSpreadSection>
    );
}
