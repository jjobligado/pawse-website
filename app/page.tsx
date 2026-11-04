import Image from "next/image";
import HeroSection from "@/components/hero-section";
import CompanionCards from "@/components/companion-cards";

const howItWorksSteps = [
    {
        number: "1",
        titleLines: ["Pick Your", "Companion"],
        description: "Three cats, three paces. Pick who focuses with you.",
        connector: "/images/arrow-right-dark.svg",
        connectorAlt: "Next step",
    },
    {
        number: "2",
        titleLines: ["Focus with Your", "Companion"],
        description: "Work alongside your cat's unique routine. Zero distractions.",
        connector: "/images/refresh-ccw.svg",
        connectorAlt: "Cycle between focus and break",
    },
    {
        number: "3",
        titleLines: ["Time to Play", "and Recharge"],
        description: "Take a breather, play, and see what they have to say.",
        connector: "/images/arrow-right-dark.svg",
        connectorAlt: "Next step",
    },
    {
        number: "4",
        titleLines: ["Watch Your", "Progress Build"],
        description: "Every session gets logged. Small sessions, big streaks.",
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
        description:
            "Create a profile to safely back up your streaks and history to the cloud.",
    },
    {
        icon: "/images/stopwatch.png",
        title: "Custom Sessions",
        description:
            "Set your own focus and break durations to match your personal workflow.",
    },
    {
        icon: "/images/audio-icon.svg",
        title: "Expanded Audio",
        description:
            "A richer library of ambient purrs, lo-fi tracks, and low-stimulation alarms.",
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
            <section className="w-full max-w-[1280px] mx-auto py-24 md:py-32 px-6 md:px-12 lg:px-20 flex flex-col items-stretch gap-6 bg-white">
                <div className="flex justify-center items-center">
                    <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl font-semibold text-[#232323] text-center leading-[1.1]">
                        How it Works
                    </h2>
                </div>
                <p className="text-base md:text-lg text-[#5F5F5F] text-center">
                    From choosing your companion to seeing your productivity grow.
                </p>

                <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] auto-rows-[1fr] lg:auto-rows-auto items-stretch gap-3 mt-2">
                    {howItWorksSteps.map((step) => (
                        <div key={step.number} className="contents">
                            <div className="group relative overflow-hidden w-full h-full min-h-[230px] flex flex-col justify-center items-center py-8 px-6 rounded-2xl border-2 border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#D3EDFF_75%,#A8DCFF_100%)] transition-all duration-500 ease-out hover:-translate-y-2 hover:border-accent hover:shadow-[0_20px_35px_-4px_rgba(20,20,20,0.14),0_8px_16px_-4px_rgba(20,20,20,0.08)] cursor-default">
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
                                    <p className="max-w-[200px] text-base text-[#4B5563] group-hover:text-[#232323] transition-colors duration-300 text-center leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                            {step.connector && (
                                <div className="flex justify-center items-center shrink-0 py-1 lg:py-0">
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
            <section className="relative w-full pt-24 pb-12 md:pt-32 md:pb-16 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-6 bg-white overflow-hidden">
                {/* Soft Oval Ambient Glow */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                >
                    <div className="w-[580px] h-[290px] sm:w-[780px] sm:h-[350px] md:w-[1000px] md:h-[420px] lg:w-[1240px] lg:h-[480px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(142,204,255,0.92)_0%,rgba(168,220,255,0.65)_35%,rgba(211,237,255,0.35)_58%,rgba(255,255,255,0)_75%)] animate-ambient-glow will-change-transform" />
                </div>

                <div className="relative z-10 w-full max-w-[1140px] flex flex-col items-center gap-6">
                    <div className="flex justify-center items-center">
                        <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl font-semibold text-[#232323] text-center leading-[1.1]">
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
                        <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl font-semibold text-[#232323] text-left leading-[1.1]">
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
                        <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl font-semibold text-[#232323] text-left leading-[1.1]">
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
            <section className="w-full flex flex-col">
                <div className="w-full pt-12 pb-24 md:pt-16 md:pb-32 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-6 bg-[linear-gradient(180deg,#FFFFFF_0%,#DCF1FF_80%,#A8DCFF_100%)]">
                    <div className="w-full max-w-[1140px] flex flex-col items-stretch gap-6">
                        <div className="flex justify-center items-center">
                            <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl font-semibold text-[#232323] text-center leading-[1.1]">
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
                    </div>
                </div>

                {/* Pixels Divider */}
                <Image
                    src="/images/pixels-analytics.svg"
                    alt=""
                    width={1440}
                    height={38}
                    aria-hidden="true"
                    className="w-full h-auto block select-none rotate-180 -scale-x-100"
                />

                {/* Extra Padding */}
                <div className="w-full h-16 md:h-24 bg-white" />
            </section>

            {/* Coming Soon */}
            <section className="w-full max-w-[1280px] mx-auto py-24 md:py-32 px-6 md:px-12 lg:px-20 flex flex-col items-stretch gap-6 bg-white">
                <div className="flex justify-center items-center">
                    <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl font-semibold text-[#232323] text-center leading-[1.1]">
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
                            className="group relative overflow-hidden w-full h-full min-h-[230px] p-7 rounded-2xl border-2 border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#D3EDFF_75%,#A8DCFF_100%)] transition-all duration-500 ease-out hover:-translate-y-2 hover:border-accent hover:shadow-[0_20px_35px_-4px_rgba(20,20,20,0.14),0_8px_16px_-4px_rgba(20,20,20,0.08)] cursor-default flex flex-col justify-center items-center gap-3"
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
                            <p className="relative z-10 max-w-[260px] text-base text-[#4B5563] group-hover:text-[#232323] transition-colors duration-300 text-center leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Beta Tester Signup */}
            <section
                id="beta"
                className="w-full max-w-[1280px] mx-auto py-24 md:py-32 px-6 md:px-12 lg:px-20 flex flex-col items-stretch gap-6 bg-white"
            >
                <div className="flex justify-center items-center">
                    <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl font-semibold text-[#232323] text-center leading-[1.1]">
                        Help Us Shape the Future of PAWSE
                    </h2>
                </div>

                <div className="px-4 md:px-10 flex justify-center items-center">
                    <p className="max-w-[760px] text-base md:text-lg text-[#5F5F5F] text-center leading-relaxed">
                        PAWSE version 1 is now live! But we&apos;re not done yet. Join our
                        beta testers to help us hunt down bugs, tell us what&apos;s working
                        (and what&apos;s not), and get first dibs on new features as they
                        roll out.
                    </p>
                </div>

                <div className="w-full flex flex-col justify-center items-center mt-2">
                    <form
                        action="#beta"
                        className="w-full max-w-[380px] py-[3px] pr-[3px] pl-5 rounded-[50px] bg-white border border-accent flex justify-between items-center"
                    >
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            aria-label="Enter your email"
                            required
                            className="flex-1 bg-transparent text-sm md:text-base font-medium text-[#232323] placeholder:text-accent-highlight focus:outline-none pr-3"
                        />
                        <button
                            type="submit"
                            aria-label="Submit email"
                            className="w-[42px] h-[42px] shrink-0 rounded-full flex items-center justify-center hover:brightness-95 transition-all cursor-pointer"
                        >
                            <Image
                                src="/images/email-submit.svg"
                                alt=""
                                width={42}
                                height={42}
                            />
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
