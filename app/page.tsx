import Image from "next/image";
import HeroSection from "@/components/hero-section";
import CompanionCards from "@/components/companion-cards";
import { DashboardSpreadSection } from "@/components/pixel-divider";
import ContactSection from "@/components/contact-section";

const howItWorksSteps = [
    {
        number: "1",
        titleLines: ["Pick Your", "Companion"],
        stacked: [
            "Three cats, three paces.",
            "Pick who focuses with you.",
        ],
        desktop: [
            "Three cats, three paces.",
            "Pick who focuses",
            "with you.",
        ],
        connector: "/images/arrow-right-dark.svg",
        connectorAlt: "Next step",
    },
    {
        number: "2",
        titleLines: ["Focus with Your", "Companion"],
        stacked: [
            "Work alongside your cat's routine.",
            "Zero distractions.",
        ],
        desktop: [
            "Work alongside your",
            "cat's routine. Zero",
            "distractions.",
        ],
        connector: "/images/refresh-ccw.svg",
        connectorAlt: "Cycle between focus and break",
    },
    {
        number: "3",
        titleLines: ["Time to Play", "and Recharge"],
        stacked: [
            "Take a breather, play, and",
            "see what they have to say.",
        ],
        desktop: [
            "Take a breather, play,",
            "and see what they",
            "have to say.",
        ],
        connector: "/images/arrow-right-dark.svg",
        connectorAlt: "Next step",
    },
    {
        number: "4",
        titleLines: ["Watch Your", "Progress Build"],
        stacked: [
            "Every session gets logged.",
            "Small sessions, big streaks.",
        ],
        desktop: [
            "Every session gets",
            "logged. Small sessions,",
            "big streaks.",
        ],
    },
];

const dashboardFeatures = [
    "Every minute you focus, tracked automatically.",
    "See how many sessions you've wrapped up.",
    "Your most-picked companion, revealed.",
    "Spot the days you focus best.",
];

const comingSoonItems = [
    {
        icon: "/images/check-account.png",
        title: "Save Your Progress",
        lines2: [
            "Create a profile to safely back up",
            "your streaks and history to the cloud.",
        ],
        lines3: [
            "Create a profile to safely",
            "back up your streaks and",
            "history to the cloud.",
        ],
    },
    {
        icon: "/images/stopwatch.png",
        title: "Custom Sessions",
        lines2: [
            "Set your own focus and break durations",
            "to fit into your personal workflow.",
        ],
        lines3: [
            "Set your own focus and",
            "break durations to fit into",
            "your personal workflow.",
        ],
    },
    {
        icon: "/images/audio-icon.svg",
        title: "Expanded Audio",
        lines2: [
            "A richer library of ambient purrs, lo-fi",
            "tracks, and low-stimulation alarms.",
        ],
        lines3: [
            "A richer library of ambient",
            "purrs, lo-fi tracks, and",
            "low-stimulation alarms.",
        ],
    },
];

function TimerMockup() {
    return (
        <div className="w-full lg:w-[56%] p-8 sm:py-12 sm:px-20 rounded-3xl border border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#D3EDFF_80%,#A8DCFF_100%)] flex items-center justify-center shrink-0">
            <div className="relative w-[292px] h-[430px] bg-[#F6F8F7] rounded-lg shadow-[0px_0px_30px_0px_rgba(0,0,0,0.15)]">
                {/* Timer Text */}
                <div className="absolute left-[61px] top-[34px] w-[171px] h-[77px] flex items-start justify-center">
                    <span className="font-pixel font-bold text-[56px] leading-none text-[#141414] text-center">
                        24:49
                    </span>
                </div>

                {/* Cycles (Fish Icons) */}
                <div className="absolute left-[90px] top-[111px] h-4 flex items-center gap-1">
                    <Image src="/images/fish.svg" alt="Completed cycle" width={25} height={25} />
                    <Image src="/images/fish.svg" alt="Completed cycle" width={25} height={25} />
                    <Image
                        src="/images/fish.svg"
                        alt="Remaining cycle"
                        width={25}
                        height={25}
                        className="grayscale opacity-50"
                    />
                    <Image
                        src="/images/fish.svg"
                        alt="Remaining cycle"
                        width={25}
                        height={25}
                        className="grayscale opacity-50"
                    />
                </div>

                {/* Companion Sprite */}
                <div className="absolute left-[36px] top-[150px] w-[220px] h-[220px]">
                    <Image
                        src="/images/tuxedo-cat.png"
                        alt="Tuxedo Cat Companion"
                        width={220}
                        height={220}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Left Control Button (Audio) */}
                <button
                    type="button"
                    aria-label="Toggle audio"
                    className="absolute left-[76px] top-[358px] w-8 h-[31px] rounded-full bg-white border-[0.5px] border-[#DDDDDD] flex items-center justify-center"
                >
                    <Image src="/images/timer-icon-left.svg" alt="" width={16} height={16} />
                </button>

                {/* Center Control Button (Pause) */}
                <button
                    type="button"
                    aria-label="Pause timer"
                    className="absolute left-[124px] top-[351px] w-[44px] h-[45px] rounded-full bg-accent shadow-[0px_0px_4px_0px_rgba(255,255,255,0.25)] flex items-center justify-center"
                >
                    <Image src="/images/timer-icon-center.svg" alt="" width={44} height={45} />
                </button>

                {/* Right Control Button (Skip) */}
                <button
                    type="button"
                    aria-label="Skip session"
                    className="absolute left-[184px] top-[358px] w-8 h-[31px] rounded-full bg-white border-[0.5px] border-[#DDDDDD] flex items-center justify-center"
                >
                    <Image src="/images/timer-icon-right.svg" alt="" width={16} height={16} />
                </button>
            </div>
        </div>
    );
}

export default function HomePage() {
    return (
        <div className="w-full flex flex-col bg-white overflow-x-hidden">
            {/* Hero Section */}
            <HeroSection />

            {/* How it Works */}
            <section
                id="how-it-works"
                className="scroll-mt-20 w-full max-w-[1280px] mx-auto py-24 md:py-32 px-6 md:px-12 lg:px-20 flex flex-col items-stretch gap-6 bg-white"
            >
                <div className="flex justify-center items-center">
                    <h2 className="font-pixel text-[clamp(2rem,1.6rem+1.5vw,3rem)] font-semibold text-[#232323] text-center leading-[1.1]">
                        How it Works
                    </h2>
                </div>
                <p className="text-base md:text-lg text-[#5F5F5F] text-center">
                    From choosing your companion to seeing your productivity grow.
                </p>

                <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] auto-rows-auto items-stretch gap-4 mt-2">
                    {howItWorksSteps.map((step) => (
                        <div key={step.number} className="contents">
                            <div className="group relative overflow-hidden w-full max-w-[420px] lg:max-w-none mx-auto h-full min-h-[230px] flex flex-col justify-center items-center py-8 px-5 rounded-2xl border-2 border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#D3EDFF_75%,#A8DCFF_100%)] transition-all duration-500 ease-out hover:-translate-y-2 hover:border-accent hover:shadow-[0_20px_35px_-4px_rgba(20,20,20,0.14),0_8px_16px_-4px_rgba(20,20,20,0.08)] cursor-default">
                                {/* Liquid rising fill underlay */}
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -inset-x-0 bottom-0 h-[150%] bg-[linear-gradient(to_top,#C8E8FF_0%,#C8E8FF_70%,transparent_100%)] translate-y-full group-hover:translate-y-0 transition-transform duration-600 ease-out"
                                />

                                <div className="relative z-10 w-full flex flex-col items-center gap-3">
                                    <div className="w-full flex flex-col items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">
                                            <span className="text-sm font-semibold text-white">
                                                {step.number}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-[#141414] group-hover:text-black transition-colors duration-300 text-center tracking-[0.01em] leading-snug">
                                            <span className="block whitespace-nowrap">
                                                {step.titleLines[0]}
                                            </span>
                                            <span className="block whitespace-nowrap">
                                                {step.titleLines[1]}
                                            </span>
                                        </h3>
                                    </div>
                                    <p className="w-full text-sm sm:text-base lg:text-sm xl:text-base text-[#4B5563] group-hover:text-[#232323] transition-colors duration-300 text-center leading-relaxed">
                                        {/* Stacked arrangement (<lg): 2 lines across all cards */}
                                        <span className="block lg:hidden">
                                            {step.stacked.map((line, idx) => (
                                                <span key={idx} className="block">
                                                    {line}
                                                </span>
                                            ))}
                                        </span>

                                        {/* 4-column desktop layout (lg:): 3 lines across all cards */}
                                        <span className="hidden lg:block">
                                            {step.desktop.map((line, idx) => (
                                                <span key={idx} className="block">
                                                    {line}
                                                </span>
                                            ))}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            {step.connector && (
                                <div className="flex justify-center items-center shrink-0 py-0">
                                    <Image
                                        src={step.connector}
                                        alt={step.connectorAlt || ""}
                                        width={20}
                                        height={20}
                                        className="rotate-90 lg:rotate-0"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Meet your Companions */}
            <section
                id="companions"
                className="scroll-mt-20 relative w-full pt-24 pb-12 md:pt-32 md:pb-16 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-6 bg-white overflow-hidden"
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
                    <div className="flex justify-center items-center">
                        <h2 className="font-pixel text-[clamp(2rem,1.6rem+1.5vw,3rem)] font-semibold text-[#232323] text-center leading-[1.1]">
                            Meet your Companions
                        </h2>
                    </div>

                    <p className="text-base md:text-lg text-[#5F5F5F] text-center">
                        Every session comes with company.
                    </p>

                    {/* Stacked Cards Interactive Group */}
                    <CompanionCards />

                    <p className="text-base md:text-lg text-[#5F5F5F] text-center">
                        Pick the pace that matches how you actually focus.
                    </p>
                </div>
            </section>

            {/* Work Section */}
            <section className="w-full max-w-[1280px] mx-auto py-12 md:py-16 px-6 md:px-12 lg:px-20 flex flex-col items-stretch gap-8 bg-white">
                <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
                    <div className="w-full lg:w-[40%] flex flex-col justify-center items-stretch gap-4">
                        <h2 className="font-pixel text-[clamp(2rem,1.6rem+1.5vw,3rem)] font-semibold text-[#232323] text-left leading-[1.1]">
                            <span className="block whitespace-nowrap">Your quiet</span>
                            <span className="block whitespace-nowrap">co-working space</span>
                        </h2>
                        <p className="text-base md:text-lg text-[#5F5F5F] text-left leading-relaxed">
                            No jarring alarms. No visual clutter. While your timer counts
                            down, your companion settles into their own low-stimulation
                            routine—whether that&apos;s reading a book, napping, or making
                            biscuits. Just quiet, uninterrupted focus.
                        </p>
                    </div>

                    <TimerMockup />
                </div>
            </section>

            {/* Break Section */}
            <section className="w-full max-w-[1280px] mx-auto py-12 md:py-16 px-6 md:px-12 lg:px-20 flex flex-col items-stretch gap-8 bg-white">
                <div className="w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-14">
                    <TimerMockup />

                    <div className="w-full lg:w-[40%] flex flex-col justify-center items-stretch gap-4">
                        <h2 className="font-pixel text-[clamp(2rem,1.6rem+1.5vw,3rem)] font-semibold text-[#232323] text-left leading-[1.1]">
                            <span className="block whitespace-nowrap">Time to play</span>
                            <span className="block whitespace-nowrap">and recharge</span>
                        </h2>
                        <p className="text-base md:text-lg text-[#5F5F5F] text-left leading-relaxed">
                            When the interval ends, the quiet time is over. Your companion
                            wakes up ready for energetic playtime. Trigger unique animations,
                            read their random thoughts, and give your brain a mindful break
                            before the next session.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pomodoro Analytics / Dashboard */}
            <DashboardSpreadSection>
                <div className="flex justify-center items-center">
                    <h2 className="font-pixel text-[clamp(2rem,1.6rem+1.5vw,3rem)] font-semibold text-[#232323] text-center leading-[1.1]">
                        Dashboard
                    </h2>
                </div>

                <p className="text-base md:text-lg text-[#5F5F5F] text-center">
                    Every session adds to the bigger picture. Watch your focus habit
                    take shape over time.
                </p>

                <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-8 mt-2">
                    {/* Feature Checklist */}
                    <div className="w-full lg:w-[440px] flex flex-col items-stretch gap-4">
                        <div className="w-full flex flex-col items-stretch gap-3.5">
                            {dashboardFeatures.map((item) => (
                                <div
                                    key={item}
                                    className="w-full flex items-center gap-3.5"
                                >
                                    <div className="w-6 h-6 shrink-0 relative">
                                        <Image
                                            src="/images/check-account.png"
                                            alt=""
                                            width={24}
                                            height={24}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <p className="flex-1 text-base md:text-lg text-[#232323] text-left">
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

            {/* Coming Soon */}
            <section
                id="coming-soon"
                className="scroll-mt-20 w-full max-w-[1280px] mx-auto py-24 md:py-32 px-6 md:px-12 lg:px-12 xl:px-16 2xl:px-20 flex flex-col items-stretch gap-6 bg-white"
            >
                <div className="flex justify-center items-center">
                    <h2 className="font-pixel text-[clamp(2rem,1.6rem+1.5vw,3rem)] font-semibold text-[#232323] text-center leading-[1.1]">
                        Coming Soon...
                    </h2>
                </div>

                <div className="px-4 md:px-10 flex justify-center items-center">
                    <p className="text-base md:text-lg text-[#5F5F5F] text-center">
                        We&apos;re just getting started! Here’s a sneak peek at what’s next
                        for PAWSE.
                    </p>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-6 mt-2">
                    {comingSoonItems.map((item) => (
                        <div
                            key={item.title}
                            className="group relative overflow-hidden w-full max-w-[420px] md:max-w-none mx-auto h-full min-h-[220px] p-6 sm:p-6 lg:px-5 lg:py-6 xl:px-5 xl:py-7 rounded-2xl border-2 border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#D3EDFF_75%,#A8DCFF_100%)] transition-all duration-500 ease-out hover:-translate-y-2 hover:border-accent hover:shadow-[0_20px_35px_-4px_rgba(20,20,20,0.14),0_8px_16px_-4px_rgba(20,20,20,0.08)] cursor-default flex flex-col justify-center items-center gap-3"
                        >
                            {/* Liquid rising fill underlay */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-x-0 bottom-0 h-[150%] bg-[linear-gradient(to_top,#C8E8FF_0%,#C8E8FF_70%,transparent_100%)] translate-y-full group-hover:translate-y-0 transition-transform duration-600 ease-out"
                            />

                            <div className="relative z-10 w-full flex flex-col justify-center items-center gap-1.5">
                                <div className="w-10 h-10 relative flex items-center justify-center shrink-0 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">
                                    <Image
                                        src={item.icon}
                                        alt=""
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 object-contain"
                                    />
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold text-[#141414] group-hover:text-black transition-colors duration-300 text-center tracking-[0.01em]">
                                    {item.title}
                                </h3>
                            </div>
                            <p className="relative z-10 w-full text-sm sm:text-base lg:text-sm xl:text-[15px] 2xl:text-base text-[#4B5563] group-hover:text-[#232323] transition-colors duration-300 text-center leading-relaxed">
                                {/* 2-line layout: stacked (<md) and wide desktop (lg:) */}
                                <span className="block md:hidden lg:block">
                                    {item.lines2.map((line, idx) => (
                                        <span key={idx} className="block">
                                            {line}
                                        </span>
                                    ))}
                                </span>

                                {/* 3-line layout: compact 3-column tablet (md to lg) */}
                                <span className="hidden md:block lg:hidden">
                                    {item.lines3.map((line, idx) => (
                                        <span key={idx} className="block">
                                            {line}
                                        </span>
                                    ))}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Us */}
            <ContactSection />
        </div>
    );
}
