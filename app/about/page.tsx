"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const overviewStyle = {
    background:
        "linear-gradient(180deg, #FFFFFF 0%, #D3EDFF 80%, var(--color-accent-highlight) 100%)",
};

function IdleCat({
    src,
    frames,
}: {
    src: string;
    frames: number;
}) {
    const [playing, setPlaying] = useState(false);
    const duration = frames * 180;

    useEffect(() => {
        const motion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        let timer: ReturnType<typeof setTimeout>;

        function scheduleNext() {
            // Pick a fresh pause between 1 and 5 seconds.
            const pause = 3000 + Math.random() * 5000;

            timer = setTimeout(() => {
                setPlaying(true);

                timer = setTimeout(() => {
                    setPlaying(false);
                    scheduleNext();
                }, duration);
            }, pause);
        }

        function restart() {
            clearTimeout(timer);
            setPlaying(false);

            if (!motion.matches) {
                scheduleNext();
            }
        }

        restart();
        motion.addEventListener("change", restart);

        return () => {
            clearTimeout(timer);
            motion.removeEventListener("change", restart);
        };
    }, [duration]);

    return (
        <div
            aria-hidden="true"
            className="h-16 w-16 shrink-0 overflow-hidden sm:h-32 sm:w-32"
        >
            <div
                className="about-idle-strip h-full"
                style={{
                    width: `${frames * 100}%`,
                    backgroundImage: `url("${src}")`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    imageRendering: "pixelated",
                    animation: playing
                        ? `about-cat-idle ${duration}ms steps(${frames}) 1`
                        : "none",
                }}
            />
        </div>
    );
}

export default function AboutPage() {
    return (
        <div className="bg-white text-black">
            <style>{`
                @keyframes about-cat-idle {
                    from { transform: translateX(0); }
                    to { transform: translateX(-100%); }
                }

                .about-idle-strip {
                    transform: translateX(0);
                }

                @media (prefers-reduced-motion: reduce) {
                    .about-idle-strip {
                        animation: none !important;
                        transform: translateX(0);
                    }
                }
            `}</style>
            
            {/* About introduction */}
            <section
                aria-labelledby="about-title"
                className="px-6 pb-16 pt-16 sm:px-10"
            >
                <div className="mx-auto flex max-w-[1200px] flex-col items-center text-center">
                    <h1
                        id="about-title"
                        className="font-pixel text-[36px] font-semibold text-accent sm:text-[48px] lg:text-[64px]"
                    >
                        About PAWSE
                    </h1>

                    <p className="mt-3 font-sans text-base text-[#141414]">
                        The Coziest Way to Get Things Done
                    </p>

                    <div className="mt-8 flex w-full max-w-[448px] items-center justify-center gap-4 sm:gap-6">
                        <IdleCat
                            src="/sprites/ginger-body-idle-sheet.png"
                            frames={5}
                        />
                        <IdleCat
                            src="/sprites/tux-body-idle-sheet.png"
                            frames={4}
                        />
                        <IdleCat
                            src="/sprites/void-body-idle-sheet.png"
                            frames={5}
                        />
                    </div>
                </div>
            </section>

            {/* Overview */}
            <section
                aria-labelledby="overview-title"
                className="px-6 py-12 sm:px-10 lg:py-20"
            >
                <div className="mx-auto w-full max-w-[1120px]">
                    <h2
                        id="overview-title"
                        className="text-center font-pixel text-[28px] font-semibold text-[#232323] sm:text-[32px] lg:text-[40px]"
                    >
                        Overview
                    </h2>

                    <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <article
                            style={overviewStyle}
                            className="flex min-w-0 flex-col items-center justify-center gap-6 rounded-xl border border-stroke p-6 text-center text-[#141414] sm:p-8"
                        >
                            <Image
                                src="/images/check-account.png"
                                alt=""
                                width={48}
                                height={48}
                                aria-hidden="true"
                                className="h-18 w-18"
                            />

                            <p className="mt-3 font-sans text-base leading-relaxed sm:text-lg lg:text-xl">
                                PAWSE is a desktop productivity app that combines
                                a focus timer with a virtual pet. Built for
                                students, professionals, and fellow cat lovers,
                                PAWSE is designed to be a stress-free alternative
                                to rigid time management.
                            </p>
                        </article>

                        <div className="grid min-w-0 gap-4">
                            <article className="min-w-0 rounded-xl border border-stroke bg-linear-to-b from-white to-[#E8F6FF] p-6 text-center text-[#141414] sm:p-8">
                                <h3 className="font-sans text-lg font-semibold lg:text-xl">
                                    A Three-Person Indie Team
                                </h3>

                                <p className="mt-3 font-sans text-sm leading-relaxed">
                                    We are a passionate group of three wearing
                                    multiple hats. From coding the complex timer
                                    logic to animating every tiny pixel-art
                                    detail, PAWSE is a labor of love handcrafted
                                    with care.
                                </p>
                            </article>

                            <article className="min-w-0 rounded-xl border border-stroke bg-linear-to-b from-white to-[#E8F6FF] p-6 text-center text-[#141414] sm:p-8">
                                <h3 className="font-sans text-lg font-semibold lg:text-xl">
                                    Born from HackTheKitty
                                </h3>

                                <div className="relative mx-auto mt-4 aspect-[120/97] w-[120px] max-w-full">
                                    <Image
                                        src="/images/hackthekitty-logo.png"
                                        alt=""
                                        fill
                                        sizes="120px"
                                        aria-hidden="true"
                                        className="object-contain"
                                    />
                                </div>

                                <p className="mt-4 font-sans text-sm leading-relaxed">
                                    What began as a fun challenge for a
                                    cat-themed hackathon quickly evolved. We set
                                    out to cure “timer anxiety” and built the
                                    stress-free productivity tool we desperately
                                    wanted for our own desktops.
                                </p>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet the Team */}
            <section
                aria-labelledby="team-title"
                className="px-6 pb-20 pt-12 sm:px-10"
            >
                <div className="mx-auto w-full max-w-[1120px]">
                    <h2
                        id="team-title"
                        className="text-center font-pixel text-[28px] font-semibold text-[#232323] sm:text-[32px] lg:text-[40px]"
                    >
                        Meet the Team
                    </h2>

                    <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <article className="flex min-w-0 flex-col justify-between rounded-xl border border-stroke bg-white px-6 py-6 text-[#141414] sm:px-8">
                            <div>
                                <h3 className="font-sans text-lg font-semibold lg:text-xl">
                                    Jasmin Joyce Obligado
                                </h3>

                                <p className="mt-3 font-sans text-sm leading-relaxed sm:text-base">
                                    Co-Founder / Frontend Developer / UI/UX
                                    Designer / Technical Writer
                                </p>
                            </div>

                            <div className="mt-5 flex items-center gap-3">
                                <Link
                                    href="https://www.linkedin.com/in/jasmin-joyce-obligado/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Jasmin LinkedIn"
                                >
                                    <Image
                                        src="/images/linkedin-icon.svg"
                                        alt="LinkedIn"
                                        width={24}
                                        height={24}
                                        className="opacity-100 transition-opacity hover:opacity-70"
                                    />
                                </Link>

                                <Link
                                    href="https://github.com/jjobligado"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Jasmin GitHub"
                                >
                                    <Image
                                        src="/images/github-icon.svg"
                                        alt="GitHub"
                                        width={24}
                                        height={24}
                                        className="opacity-100 transition-opacity hover:opacity-70"
                                    />
                                </Link>
                            </div>
                        </article>

                        <article className="flex min-w-0 flex-col justify-between rounded-xl border border-stroke bg-white px-6 py-6 text-[#141414] sm:px-8">
                            <div>
                                <h3 className="font-sans text-lg font-semibold lg:text-xl">
                                    Jude Keith Escritor
                                </h3>

                                <p className="mt-3 font-sans text-sm leading-relaxed sm:text-base">
                                    Co-Founder / Full-stack Developer / Pixel
                                    Artist / QA Engineer
                                </p>
                            </div>

                            <div className="mt-5 flex items-center gap-3">
                                <Link
                                    href="https://www.linkedin.com/in/jude-keith-escritor/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Jude LinkedIn"
                                >
                                    <Image
                                        src="/images/linkedin-icon.svg"
                                        alt="LinkedIn"
                                        width={24}
                                        height={24}
                                        className="opacity-100 transition-opacity hover:opacity-70"
                                    />
                                </Link>

                                <Link
                                    href="https://github.com/educ-jkescritor"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Jude GitHub"
                                >
                                    <Image
                                        src="/images/github-icon.svg"
                                        alt="GitHub"
                                        width={24}
                                        height={24}
                                        className="opacity-100 transition-opacity hover:opacity-70"
                                    />
                                </Link>
                            </div>
                        </article>

                        <article className="flex min-w-0 flex-col justify-between rounded-xl border border-stroke bg-white px-6 py-6 text-[#141414] sm:px-8">
                            <div>
                                <h3 className="font-sans text-lg font-semibold lg:text-xl">
                                    Ysabel Delos Santos
                                </h3>

                                <p className="mt-3 font-sans text-sm leading-relaxed sm:text-base">
                                    Lead Front-end Developer / QA Tester
                                </p>
                            </div>

                            <div className="mt-5 flex items-center gap-3">
                                <Link
                                    href="https://www.linkedin.com/in/ysa-delos-santos/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Ysabel LinkedIn"
                                >
                                    <Image
                                        src="/images/linkedin-icon.svg"
                                        alt="LinkedIn"
                                        width={24}
                                        height={24}
                                        className="opacity-100 transition-opacity hover:opacity-70"
                                    />
                                </Link>

                                <Link
                                    href="https://github.com/ysa-ds"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Ysabel GitHub"
                                >
                                    <Image
                                        src="/images/github-icon.svg"
                                        alt="GitHub"
                                        width={24}
                                        height={24}
                                        className="opacity-100 transition-opacity hover:opacity-70"
                                    />
                                </Link>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </div>
    );
}