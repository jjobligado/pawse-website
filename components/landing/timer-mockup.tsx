import Image from "next/image";

/**
 * Static illustration of the PAWSE focus timer window. It is exposed to assistive
 * tech as a single labelled image; the controls are drawn, not interactive.
 */
export default function TimerMockup({
    label = "PAWSE focus timer at 24:49 with two of four cycles complete and the Tuxedo companion",
}: {
    label?: string;
}) {
    return (
        <div className="w-full lg:w-[56%] p-8 sm:py-12 sm:px-20 rounded-3xl border border-stroke surface-sky flex items-center justify-center shrink-0">
            <div role="img" aria-label={label} className="relative w-[292px] h-[430px] bg-mockup-surface rounded-lg shadow-screenshot">
                {/* Timer Text */}
                <div className="absolute left-[61px] top-[34px] w-[171px] h-[77px] flex items-start justify-center">
                    <span className="font-pixel font-bold text-[56px] leading-none text-ink-strong text-center">
                        24:49
                    </span>
                </div>

                {/* Cycles (Fish Icons) */}
                <div className="absolute left-[90px] top-[111px] h-4 flex items-center gap-1">
                    <Image src="/images/fish.svg" alt="" width={25} height={25} />
                    <Image src="/images/fish.svg" alt="" width={25} height={25} />
                    <Image
                        src="/images/fish.svg"
                        alt=""
                        width={25}
                        height={25}
                        className="grayscale opacity-50"
                    />
                    <Image
                        src="/images/fish.svg"
                        alt=""
                        width={25}
                        height={25}
                        className="grayscale opacity-50"
                    />
                </div>

                {/* Companion Sprite */}
                <div className="absolute left-[36px] top-[150px] w-[220px] h-[220px]">
                    <Image
                        src="/images/tuxedo-cat.png"
                        alt=""
                        width={220}
                        height={220}
                        unoptimized
                        className="w-full h-full object-cover [image-rendering:pixelated]"
                    />
                </div>

                {/* Drawn controls (audio, pause, skip): illustration only, not focusable */}
                <div className="absolute left-[76px] top-[358px] w-8 h-[31px] rounded-full bg-white border-[0.5px] border-mockup-stroke flex items-center justify-center">
                    <Image src="/images/timer-icon-left.svg" alt="" width={16} height={16} />
                </div>

                <div className="absolute left-[124px] top-[351px] w-[44px] h-[45px] rounded-full bg-accent shadow-[0px_0px_4px_0px_rgba(255,255,255,0.25)] flex items-center justify-center">
                    <Image src="/images/timer-icon-center.svg" alt="" width={44} height={45} />
                </div>

                <div className="absolute left-[184px] top-[358px] w-8 h-[31px] rounded-full bg-white border-[0.5px] border-mockup-stroke flex items-center justify-center">
                    <Image src="/images/timer-icon-right.svg" alt="" width={16} height={16} />
                </div>
            </div>
        </div>
    );
}
