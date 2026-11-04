import Image from "next/image";
import Link from "next/link";

const howItWorksSteps = [
    {
        number: "1",
        title: "Pick Your Companion",
        description: "Three cats, three paces. Pick who focuses with you.",
        connector: "/images/arrow-right-dark.svg",
        connectorAlt: "Next step",
    },
    {
        number: "2",
        title: "Focus with Your Companion",
        description: "Work alongside your cat's unique routine. Zero distractions.",
        connector: "/images/refresh-ccw.svg",
        connectorAlt: "Cycle between focus and break",
    },
    {
        number: "3",
        title: "Time to Play and Recharge",
        description: "Take a breather, play, and see what they have to say.",
        connector: "/images/arrow-right-dark.svg",
        connectorAlt: "Next step",
    },
    {
        number: "4",
        title: "Watch Your Progress Build",
        description: "Every session gets logged. Small sessions, big streaks. ",
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
        <div className="p-8 sm:py-10 sm:px-20 rounded-3xl border border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#D3EDFF_80%,#A8DCFF_100%)] flex items-center justify-center shrink-0">
            <div className="relative w-[292px] h-[430px] bg-[#F6F8F7] rounded-lg shadow-[0px_0px_30px_0px_rgba(0,0,0,0.15)]">
                {/* Timer Text */}
                <div className="absolute left-[61px] top-[34px] w-[171px] h-[77px] flex items-start justify-center">
                    <span className="font-pixel font-bold text-[64px] leading-none text-[#141414] text-center">
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
            <section className="w-full max-w-[1440px] mx-auto py-16 px-6 md:px-10 flex flex-col items-center gap-4 bg-white">
                <div className="w-full max-w-[840px] flex justify-center items-center">
                    <h1 className="font-pixel text-4xl sm:text-5xl md:text-[64px] font-semibold text-[#232323] text-center leading-[1.2]">
                        The Coziest Way to Get Things{" "}
                        <span className="text-accent underline">Done</span>
                    </h1>
                </div>

                {/* Cats Row */}
                <div className="w-full flex flex-wrap justify-center items-center">
                    <div className="w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] relative">
                        <Image
                            src="/images/orange-cat-56586a.png"
                            alt="Ginger Cat"
                            width={220}
                            height={220}
                            className="w-full h-full object-fill"
                            priority
                        />
                    </div>
                    <div className="w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] relative">
                        <Image
                            src="/images/tuxedo-cat.png"
                            alt="Tuxedo Cat"
                            width={220}
                            height={220}
                            className="w-full h-full object-cover"
                            priority
                        />
                    </div>
                    <div className="w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] relative">
                        <Image
                            src="/images/black-cat.png"
                            alt="Void Cat"
                            width={220}
                            height={220}
                            className="w-full h-full object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Subtitle */}
                <div className="w-full flex justify-center items-center px-4">
                    <p className="max-w-[792px] text-lg md:text-2xl text-black text-center tracking-[0.02em] leading-normal">
                        A desktop productivity app combining a focus timer with a virtual
                        companion. Built for students, professionals, and cat lovers.
                    </p>
                </div>

                {/* Download Options */}
                <div className="w-full py-6 flex flex-col justify-center items-center gap-4">
                    <Link
                        href="#download"
                        className="flex items-center justify-center gap-2 py-3 px-8 rounded-[50px] bg-accent shadow-[0px_0px_24px_0px_rgba(53,166,241,0.25)] hover:brightness-105 transition-all"
                    >
                        <Image
                            src="/images/download-icon.svg"
                            alt=""
                            width={24}
                            height={24}
                        />
                        <span className="font-pixel text-xl md:text-2xl font-semibold text-white">
                            Download for Windows
                        </span>
                    </Link>

                    <div className="flex items-center justify-center gap-2">
                        <Link
                            href="#download-options"
                            className="text-sm text-[#5F5F5F] tracking-[0.02em] underline hover:text-[#232323] transition-colors"
                        >
                            More Download Options
                        </Link>
                        <span className="w-1 h-1 rounded-full bg-[#5F5F5F]" aria-hidden="true" />
                        <Link
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#5F5F5F] tracking-[0.02em] underline hover:text-[#232323] transition-colors"
                        >
                            Github
                        </Link>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="w-full max-w-[1440px] mx-auto py-20 px-6 md:px-16 lg:px-[120px] flex flex-col items-stretch gap-8 bg-white">
                <div className="flex justify-center items-center">
                    <h2 className="font-pixel text-4xl md:text-5xl font-semibold text-[#232323] text-center">
                        How it Works
                    </h2>
                </div>
                <p className="text-xl md:text-2xl text-[#232323] text-center">
                    From choosing your companion to seeing your productivity grow.
                </p>

                <div className="w-full flex flex-col lg:flex-row justify-center items-stretch lg:items-center gap-4">
                    {howItWorksSteps.map((step) => (
                        <div
                            key={step.number}
                            className="contents"
                        >
                            <div className="flex-1 flex flex-col justify-between items-center py-10 px-8 rounded-2xl border-2 border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#D3EDFF_75%,#A8DCFF_100%)]">
                                <div className="w-full flex flex-col items-stretch gap-4">
                                    <div className="w-full flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center pt-[3px] pb-[2px] px-2">
                                            <span className="text-xl font-semibold text-white tracking-[0.02em]">
                                                {step.number}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-semibold text-[#141414] text-center tracking-[0.02em]">
                                            {step.title}
                                        </h3>
                                    </div>
                                    <p className="text-base text-[#141414] text-center tracking-[0.02em]">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                            {step.connector && (
                                <div className="flex justify-center items-center shrink-0 py-2 lg:py-0">
                                    <Image
                                        src={step.connector}
                                        alt={step.connectorAlt || ""}
                                        width={24}
                                        height={24}
                                        className="rotate-90 lg:rotate-0"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Meet your Companions */}
            <section className="w-full py-20 px-6 md:px-16 lg:px-[120px] flex flex-col items-center gap-8 bg-[radial-gradient(circle_at_50%_50%,#A8DCFF_0%,#D3EDFF_25%,#FFFFFF_100%)]">
                <div className="w-full max-w-[1200px] flex flex-col items-center gap-8">
                    <div className="flex justify-center items-center">
                        <h2 className="font-pixel text-4xl md:text-5xl font-semibold text-[#232323] text-center">
                            Meet your Companions
                        </h2>
                    </div>

                    <p className="text-xl md:text-2xl text-black text-center">
                        Every session comes with company.
                    </p>

                    {/* Stacked Cards Interactive Group */}
                    <div className="group relative w-full max-w-[1114px] min-h-[200px] flex flex-col md:flex-row justify-center items-center gap-4">
                        {/* Stacked view (default on desktop, fans out on hover) */}
                        <div className="relative w-[366px] h-[200px] md:group-hover:hidden">
                            <Image
                                src="/images/stacked-companions.png"
                                alt="Tux, Ginger, and Void companion cards"
                                width={459}
                                height={200}
                                className="w-full h-full object-contain scale-125"
                            />
                        </div>

                        {/* Expanded view on hover (desktop) */}
                        <div className="hidden md:group-hover:flex flex-row justify-center items-center gap-4 w-full min-h-[200px] animate-fade-in">
                            <Image
                                src="/images/card-tux.png"
                                alt="Tux - Classic 25-minute session"
                                width={366}
                                height={139}
                                className="w-[366px] h-auto object-contain transition-transform duration-300 hover:scale-105"
                            />
                            <Image
                                src="/images/card-ginger.png"
                                alt="Ginger - Sprint 15-minute session"
                                width={366}
                                height={139}
                                className="w-[366px] h-auto object-contain transition-transform duration-300 hover:scale-105"
                            />
                            <Image
                                src="/images/card-void.png"
                                alt="Void - Focused 50-minute session"
                                width={366}
                                height={139}
                                className="w-[366px] h-auto object-contain transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                    </div>

                    <p className="text-xl md:text-2xl text-black text-center">
                        Pick the pace that matches how you actually focus.
                    </p>
                </div>
            </section>

            {/* Work Section */}
            <section className="w-full max-w-[1440px] mx-auto py-20 px-6 md:px-16 lg:px-[120px] flex flex-col items-stretch gap-8 bg-white">
                <div className="w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    <div className="flex-1 flex flex-col justify-center items-stretch gap-8">
                        <h2 className="font-pixel text-4xl md:text-5xl font-semibold text-[#232323] text-left">
                            Your quiet co-working space
                        </h2>
                        <p className="text-xl md:text-2xl text-black text-left leading-normal">
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
            <section className="w-full max-w-[1440px] mx-auto py-20 px-6 md:px-16 lg:px-[120px] flex flex-col items-stretch gap-8 bg-white">
                <div className="w-full flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
                    <TimerMockup />

                    <div className="flex-1 flex flex-col justify-center items-stretch gap-8">
                        <h2 className="font-pixel text-4xl md:text-5xl font-semibold text-[#232323] text-left">
                            Time to play and recharge
                        </h2>
                        <p className="text-xl md:text-2xl text-black text-left leading-normal">
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
                <div className="w-full py-20 px-6 md:px-16 lg:px-[120px] flex flex-col items-center gap-8 bg-[linear-gradient(180deg,#FFFFFF_0%,#DCF1FF_80%,#A8DCFF_100%)]">
                    <div className="w-full max-w-[1200px] flex flex-col items-stretch gap-8">
                        <div className="flex justify-center items-center">
                            <h2 className="font-pixel text-4xl md:text-5xl font-semibold text-[#232323] text-center">
                                Dashboard
                            </h2>
                        </div>

                        <p className="text-xl md:text-2xl text-black text-center">
                            Every session adds to the bigger picture. Watch your focus habit
                            take shape over time.
                        </p>

                        <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-12">
                            {/* Feature Checklist */}
                            <div className="w-full lg:w-[640px] flex flex-col items-stretch gap-6">
                                <div className="w-full px-0 sm:px-6 flex flex-col items-stretch gap-3">
                                    {dashboardFeatures.map((item) => (
                                        <div
                                            key={item}
                                            className="w-full flex items-center gap-4"
                                        >
                                            <div className="w-8 h-8 shrink-0 relative">
                                                <Image
                                                    src="/images/check-account.png"
                                                    alt=""
                                                    width={32}
                                                    height={32}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <p className="flex-1 text-xl md:text-2xl text-black text-left">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dashboard Preview Image */}
                            <div className="w-full max-w-[500px] shrink-0 shadow-[0px_0px_30px_0px_rgba(0,0,0,0.15)] rounded-lg overflow-hidden">
                                <Image
                                    src="/images/dashboard.png"
                                    alt="PAWSE Dashboard showing focus time, completed pomodoros, favorite companion, and weekly flow"
                                    width={500}
                                    height={361}
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
                <div className="w-full h-20 bg-white" />
            </section>

            {/* Coming Soon */}
            <section className="w-full max-w-[1440px] mx-auto py-20 px-6 md:px-16 lg:px-[120px] flex flex-col items-stretch gap-8 bg-white">
                <div className="flex justify-center items-center">
                    <h2 className="font-pixel text-4xl md:text-5xl font-semibold text-[#232323] text-center">
                        Coming Soon...
                    </h2>
                </div>

                <div className="px-4 md:px-10 flex justify-center items-center">
                    <p className="text-xl md:text-2xl text-[#232323] text-center">
                        We&apos;re just getting started! Here’s a sneak peek at what’s next
                        for PAWSE.
                    </p>
                </div>

                <div className="w-full flex flex-col md:flex-row justify-center items-stretch gap-8">
                    {comingSoonItems.map((item) => (
                        <div
                            key={item.title}
                            className="flex-1 p-8 rounded-2xl border-2 border-stroke bg-[linear-gradient(180deg,#FFFFFF_0%,#D3EDFF_75%,#A8DCFF_100%)] flex flex-col items-stretch gap-4"
                        >
                            <div className="w-full flex flex-col justify-center items-center gap-1">
                                <div className="w-12 h-12 relative flex items-center justify-center">
                                    <Image
                                        src={item.icon}
                                        alt=""
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 object-contain"
                                    />
                                </div>
                                <h3 className="text-2xl font-semibold text-[#141414] text-center tracking-[0.02em]">
                                    {item.title}
                                </h3>
                            </div>
                            <p className="text-base text-[#141414] text-center tracking-[0.02em]">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Beta Tester Signup */}
            <section
                id="beta"
                className="w-full max-w-[1440px] mx-auto py-20 px-6 md:px-16 lg:px-[120px] flex flex-col items-stretch gap-8 bg-white"
            >
                <div className="flex justify-center items-center">
                    <h2 className="font-pixel text-4xl md:text-5xl font-semibold text-[#232323] text-center">
                        Help Us Shape the Future of PAWSE
                    </h2>
                </div>

                <div className="px-4 md:px-10 flex justify-center items-center">
                    <p className="text-xl md:text-2xl text-black text-center leading-normal">
                        PAWSE version 1 is now live! But we&apos;re not done yet. Join our
                        beta testers to help us hunt down bugs, tell us what&apos;s working
                        (and what&apos;s not), and get first dibs on new features as they
                        roll out.
                    </p>
                </div>

                <div className="w-full flex flex-col justify-center items-center">
                    <form
                        action="#beta"
                        className="w-full max-w-[400px] py-[3px] pr-[3px] pl-6 rounded-[50px] bg-white border border-accent flex justify-between items-center"
                    >
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            aria-label="Enter your email"
                            required
                            className="flex-1 bg-transparent text-base font-medium text-[#232323] placeholder:text-accent-highlight focus:outline-none pr-3"
                        />
                        <button
                            type="submit"
                            aria-label="Submit email"
                            className="w-[47px] h-[47px] shrink-0 rounded-full flex items-center justify-center hover:brightness-95 transition-all cursor-pointer"
                        >
                            <Image
                                src="/images/email-submit.svg"
                                alt=""
                                width={47}
                                height={47}
                            />
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
