import Image from "next/image";
import Link from "next/link";

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
            <section className="relative w-full max-w-[1440px] mx-auto pt-16 pb-16 md:pt-24 md:pb-28 px-6 md:px-10 flex flex-col items-center bg-white">
                {/* Scattered Cats on Left & Right Sides */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none hidden md:block absolute inset-0 max-w-[1320px] mx-auto"
                >
                    {/* Left Top Cat (Ginger) */}
                    <div className="absolute left-2 lg:left-8 top-10 lg:top-12 w-[130px] h-[130px] lg:w-[165px] lg:h-[165px] -rotate-6">
                        <Image
                            src="/images/orange-cat-56586a.png"
                            alt=""
                            width={165}
                            height={165}
                            className="w-full h-full object-contain"
                            priority
                        />
                    </div>

                    {/* Left Bottom Cat (Void) */}
                    <div className="absolute left-8 lg:left-24 top-[250px] lg:top-[280px] w-[125px] h-[125px] lg:w-[155px] lg:h-[155px] rotate-6">
                        <Image
                            src="/images/black-cat.png"
                            alt=""
                            width={155}
                            height={155}
                            className="w-full h-full object-contain"
                            priority
                        />
                    </div>

                    {/* Right Center Cat (Tuxedo) */}
                    <div className="absolute right-4 lg:right-14 top-[130px] lg:top-[150px] w-[140px] h-[140px] lg:w-[175px] lg:h-[175px] rotate-6">
                        <Image
                            src="/images/tuxedo-cat.png"
                            alt=""
                            width={175}
                            height={175}
                            className="w-full h-full object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Centered Hero Copy & Actions */}
                <div className="relative z-10 w-full flex flex-col items-center gap-6">
                    <div className="w-full flex justify-center items-center">
                        <h1 className="font-pixel text-[clamp(1.75rem,6vw,4.25rem)] font-semibold text-[#232323] text-center leading-[1.15]">
                            <span className="block whitespace-nowrap">The Coziest Way</span>
                            <span className="block whitespace-nowrap">
                                to Get Things <span className="text-accent underline">Done</span>
                            </span>
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <div className="w-full flex justify-center items-center px-4">
                        <p className="max-w-[620px] text-base md:text-lg text-[#5F5F5F] text-center tracking-[0.01em] leading-relaxed">
                            A desktop productivity app combining a focus timer with a virtual
                            companion. Built for students, professionals, and cat lovers.
                        </p>
                    </div>

                    {/* Download Options */}
                    <div className="w-full pt-2 flex flex-col justify-center items-center gap-3.5">
                        <Link
                            href="#download"
                            className="flex items-center justify-center gap-2 py-2.5 px-7 rounded-[50px] bg-accent shadow-[0px_0px_24px_0px_rgba(53,166,241,0.25)] hover:brightness-105 transition-all"
                        >
                            <Image
                                src="/images/download-icon.svg"
                                alt=""
                                width={20}
                                height={20}
                            />
                            <span className="font-pixel text-lg md:text-xl font-semibold text-white">
                                Download for Windows
                            </span>
                        </Link>

                        <div className="flex items-center justify-center">
                            <Link
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs md:text-sm text-[#5F5F5F] hover:text-[#232323] tracking-[0.02em] transition-colors group"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="w-4 h-4"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    />
                                </svg>
                                <span className="underline underline-offset-4">
                                    View on GitHub
                                </span>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                                >
                                    <path
                                        d="M5 12H19"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12 5L19 12L12 19"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* App Visuals Showcase Container (Peeking at the bottom of the Hero) */}
                <div className="relative z-10 w-full max-w-[1040px] mt-12 md:mt-16">
                    <div className="w-full h-[340px] sm:h-[460px] md:h-[540px] rounded-3xl border-2 border-stroke bg-[linear-gradient(180deg,#F8FAFC_0%,#EBF6FF_100%)] shadow-[0px_12px_40px_0px_rgba(0,0,0,0.08)] flex items-center justify-center p-6">
                        <span className="font-pixel text-lg md:text-xl text-[#5F5F5F]/60 select-none">
                            App Visuals Preview
                        </span>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="w-full max-w-[1280px] mx-auto py-24 md:py-32 px-6 md:px-12 lg:px-20 flex flex-col items-stretch gap-6 bg-white">
                <div className="flex justify-center items-center">
                    <h2 className="font-pixel text-3xl md:text-4xl font-semibold text-[#232323] text-center">
                        How it Works
                    </h2>
                </div>
                <p className="text-base md:text-lg text-[#5F5F5F] text-center">
                    From choosing your companion to seeing your productivity grow.
                </p>

                <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] auto-rows-[1fr] lg:auto-rows-auto items-stretch gap-3 mt-2">
                    {howItWorksSteps.map((step) => (
                        <div key={step.number} className="contents">
                            <div className="w-full h-full min-h-[230px] flex flex-col justify-center items-center py-8 px-6 rounded-2xl border-2 border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#D3EDFF_75%,#A8DCFF_100%)]">
                                <div className="w-full flex flex-col items-center gap-3">
                                    <div className="w-full flex flex-col items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0">
                                            <span className="text-sm font-semibold text-white">
                                                {step.number}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-[#141414] text-center tracking-[0.01em] leading-snug">
                                            <span className="block whitespace-nowrap">
                                                {step.titleLines[0]}
                                            </span>
                                            <span className="block whitespace-nowrap">
                                                {step.titleLines[1]}
                                            </span>
                                        </h3>
                                    </div>
                                    <p className="max-w-[200px] text-base text-[#4B5563] text-center leading-relaxed">
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
                {/* Circular Soft Radial Glow that stays contained and doesn't reach the edges */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] sm:w-[540px] sm:h-[540px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,220,255,0.85)_0%,rgba(211,237,255,0.45)_40%,rgba(255,255,255,0)_70%)]"
                />

                <div className="relative z-10 w-full max-w-[1140px] flex flex-col items-center gap-6">
                    <div className="flex justify-center items-center">
                        <h2 className="font-pixel text-3xl md:text-4xl font-semibold text-[#232323] text-center">
                            Meet your Companions
                        </h2>
                    </div>

                    <p className="text-base md:text-lg text-[#5F5F5F] text-center">
                        Every session comes with company.
                    </p>

                    {/* Stacked Cards Interactive Group */}
                    <div className="group relative w-full max-w-[1050px] min-h-[190px] flex flex-col md:flex-row justify-center items-center gap-4">
                        {/* Stacked view (default on desktop, fans out on hover) */}
                        <div className="relative w-[340px] h-[190px] md:group-hover:hidden">
                            <Image
                                src="/images/stacked-companions.png"
                                alt="Tux, Ginger, and Void companion cards"
                                width={459}
                                height={200}
                                className="w-full h-full object-contain scale-120"
                            />
                        </div>

                        {/* Expanded view on hover (desktop) */}
                        <div className="hidden md:group-hover:flex flex-row justify-center items-center gap-4 w-full min-h-[190px]">
                            <Image
                                src="/images/card-tux.png"
                                alt="Tux - Classic 25-minute session"
                                width={330}
                                height={125}
                                className="w-[330px] h-auto object-contain transition-transform duration-300 hover:scale-105"
                            />
                            <Image
                                src="/images/card-ginger.png"
                                alt="Ginger - Sprint 15-minute session"
                                width={330}
                                height={125}
                                className="w-[330px] h-auto object-contain transition-transform duration-300 hover:scale-105"
                            />
                            <Image
                                src="/images/card-void.png"
                                alt="Void - Focused 50-minute session"
                                width={330}
                                height={125}
                                className="w-[330px] h-auto object-contain transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                    </div>

                    <p className="text-base md:text-lg text-[#5F5F5F] text-center">
                        Pick the pace that matches how you actually focus.
                    </p>
                </div>
            </section>

            {/* Work Section */}
            <section className="w-full max-w-[1280px] mx-auto py-12 md:py-16 px-6 md:px-12 lg:px-20 flex flex-col items-stretch gap-8 bg-white">
                <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
                    <div className="w-full lg:w-[40%] flex flex-col justify-center items-stretch gap-4">
                        <h2 className="font-pixel text-3xl md:text-4xl font-semibold text-[#232323] text-left">
                            Your quiet co-working space
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
                        <h2 className="font-pixel text-3xl md:text-4xl font-semibold text-[#232323] text-left">
                            Time to play and recharge
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
                            <h2 className="font-pixel text-3xl md:text-4xl font-semibold text-[#232323] text-center">
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
                    <h2 className="font-pixel text-3xl md:text-4xl font-semibold text-[#232323] text-center">
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
                            className="w-full h-full min-h-[230px] p-7 rounded-2xl border-2 border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#D3EDFF_75%,#A8DCFF_100%)] flex flex-col justify-center items-center gap-3"
                        >
                            <div className="w-full flex flex-col justify-center items-center gap-1.5">
                                <div className="w-10 h-10 relative flex items-center justify-center shrink-0">
                                    <Image
                                        src={item.icon}
                                        alt=""
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 object-contain"
                                    />
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold text-[#141414] text-center tracking-[0.01em]">
                                    {item.title}
                                </h3>
                            </div>
                            <p className="max-w-[260px] text-base text-[#4B5563] text-center leading-relaxed">
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
                    <h2 className="font-pixel text-3xl md:text-4xl font-semibold text-[#232323] text-center">
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
