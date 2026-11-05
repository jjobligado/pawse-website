import Image from "next/image";
import Link from "next/link";

const overviewStyle = {
    background:
        "linear-gradient(180deg, #FFFFFF 0%, #D3EDFF 80%, var(--color-accent-highlight) 100%)",
};

export default function AboutPage() {
    return (
        <div className="bg-white text-black">
            {/* About introduction */}
            <section aria-labelledby="about-title" className="px-6 pb-16 pt-16 sm:px-10">
                <div className="mx-auto flex max-w-[1200px] flex-col items-center text-center">
                    <h1 id="about-title" className="font-pixel text-5xl font-semibold text-accent sm:text-[80px]">
                        About PAWSE
                    </h1>
                    <p className="mt-3 font-sans text-xl text-[#141414] sm:text-base">
                        The Coziest Way to Get Things Done
                    </p>
                    <div className="mt-8 flex w-full max-w-[448px] items-center justify-center gap-4 sm:gap-6">
                        <Image src="/images/orange-cat-56586a.png" alt="" width={120} height={120} aria-hidden="true" className="h-auto w-24 min-w-0 object-contain [image-rendering:pixelated] sm:w-[120px]" />
						<Image src="/images/tuxedo-cat.png" alt="" width={120} height={120} aria-hidden="true" className="h-auto w-24 min-w-0 object-contain [image-rendering:pixelated] sm:w-[120px]" />
						<Image src="/images/black-cat.png" alt="" width={120} height={120} aria-hidden="true" className="h-auto w-24 min-w-0 object-contain [image-rendering:pixelated] sm:w-[120px]" />
                    </div>
                </div>
            </section>

            {/* Overview */}
            <section aria-labelledby="overview-title" className="px-40 py-20 sm:px-10">
                <div className="mx-auto max-w-[1120px]">
                    <h2 id="overview-title" className="text-center font-pixel text-4xl font-semibold text-[#232323] sm:text-[56px]">
                        Overview
                    </h2>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <article style={overviewStyle} className="flex flex-col items-center justify-center gap-6 rounded-xl border border-stroke p-20 text-center text-[#141414] sm:p-10">
                            <Image
                                src="/images/check-account.png"
                                alt=""
                                width={48}
                                height={48}
                                aria-hidden="true"
                                className="h-18 w-18"
                            />
                            <p className="max-w-[400px] font-sans text-xl leading-relaxed">
                                PAWSE is a desktop productivity app that combines a focus timer
                                with a virtual pet. Built for students, professionals, and fellow
                                cat lovers, PAWSE is designed to be a stress-free alternative to
                                rigid time management.
                            </p>
                        </article>

                        <div className="grid gap-4">
                            <article className="rounded-xl border border-stroke bg-linear-to-b from-white to-[#E8F6FF] p-10 text-center text-[#141414] sm:p-8">
                                <h3 className="font-sans text-2xl font-semibold">A Three-Person Indie Team</h3>
                                <p className="mt-3 font-sans text-sm leading-relaxed">
                                    We are a passionate group of three wearing multiple hats. From coding the
                                    complex timer logic to animating every tiny pixel-art detail,
                                    PAWSE is a labor of love handcrafted with care.
                                </p>
                            </article>

                            <article className="rounded-xl border border-stroke bg-linear-to-b from-white to-[#E8F6FF] p-10 text-center text-[#141414] sm:p-8">
                                <h3 className="font-sans text-2xl font-semibold">Born from HackTheKitty</h3>
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
                                    What began as a fun challenge for a cat-themed hackathon quickly
                                    evolved. We set out to cure “timer anxiety” and built the
                                    stress-free productivity tool we desperately wanted for our own
                                    desktops.
                                </p>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet the Team*/}
            <section aria-labelledby="team-title" className="px-6 pb-20 pt-12 sm:px-10">
                <div className="mx-auto max-w-[1120px]">
                    <h2 id="team-title" className="text-center font-pixel text-4xl font-semibold text-[#232323] sm:text-[56px]">
                        Meet the Team
                    </h2>
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <article className="flex flex-col justify-between rounded-xl border border-stroke bg-white text-[#141414] px-10 py-8">
                            <div>
								<h3 className="font-sans text-2xl font-semibold">Jasmin Joyce Obligado</h3>
                                <p className="mt-3 font-sans text-xl leading-relaxed">
                                    Co-Founder / Frontend Developer / UI/UX Designer / Technical Writer
                                </p>
                            </div>
                            <div className="mt-5 flex items-center gap-3">
                                <Link href="https://www.linkedin.com/in/jasmin-joyce-obligado/" target="_blank" rel="noopener noreferrer" aria-label="Jasmin LinkedIn">
                                    <Image 
                                        src="/images/linkedin-icon.svg"
                                        alt="LinkedIn"
                                        width={24}
                                        height={24}
                                        className="opacity-100 transition-opacity hover:opacity-70"
                                    />
                                </Link>
                                <Link href="https://github.com/jjobligado" target="_blank" rel="noopener noreferrer" aria-label="Jasmin GitHub">
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
                        <article className="flex flex-col justify-between rounded-xl border border-stroke bg-white text-[#141414] px-10 py-8">
                            <div>
                                <h3 className="font-sans text-2xl font-semibold">Jude Keith Escritor</h3>
                                <p className="mt-3 font-sans text-xl leading-relaxed">
                                    Co-Founder / Full-stack Developer / Pixel Artist / QA Engineer
                                </p>
                            </div>
                            <div className="mt-5 flex items-center gap-3">
                                <Link href="https://www.linkedin.com/in/jude-keith-escritor/" target="_blank" rel="noopener noreferrer" aria-label="Jude LinkedIn">
                                    <Image 
                                        src="/images/linkedin-icon.svg"
                                        alt="LinkedIn"
                                        width={24}
                                        height={24}
                                        className="opacity-100 transition-opacity hover:opacity-70"
                                    />
                                </Link>
                                <Link href="https://github.com/educ-jkescritor" target="_blank" rel="noopener noreferrer" aria-label="Jude GitHub">
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
                        <article className="flex flex-col justify-between rounded-xl border border-stroke bg-white text-[#141414] px-10 py-8">
                            <div>
                                <h3 className="font-sans text-2xl font-semibold">Ysabel Delos Santos</h3>
                                <p className="mt-3 font-sans text-xl leading-relaxed">
                                    Lead Front-end Developer / QA Tester
                                </p>
                            </div>
                            <div className="mt-5 flex items-center gap-3">
                                <Link href="https://www.linkedin.com/in/ysa-delos-santos/" target="_blank" rel="noopener noreferrer" aria-label="Ysabel LinkedIn">
                                    <Image 
                                        src="/images/linkedin-icon.svg"
                                        alt="LinkedIn"
                                        width={24}
                                        height={24}
                                        className="opacity-100 transition-opacity hover:opacity-70"
                                    />
                                </Link>
                                <Link href="https://github.com/ysa-ds" target="_blank" rel="noopener noreferrer" aria-label="Ysabel GitHub">
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