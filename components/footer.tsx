import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <div className="w-full flex flex-col bg-white">
            {/* Extra Padding */}
            <div className="w-full h-20 bg-white" />

            {/* Pixel Divider */}
            <Image
                src="/images/pixels-footer.svg"
                alt=""
                width={1440}
                height={38}
                aria-hidden="true"
                className="w-full h-auto block select-none"
            />

            {/* Footer Content */}
            <footer className="w-full flex flex-col md:flex-row py-16 md:py-20 px-6 md:px-16 lg:px-[120px] justify-between items-start md:items-end gap-10 bg-accent-highlight">
                {/* Left Group*/}
                <div className="flex flex-col justify-center gap-6 max-w-[600px]">
                    <Link href="/" className="flex items-center gap-2 group h-[77px]">
                        <Image
                            src="/images/logo.png"
                            alt="Pawse Logo"
                            width={80}
                            height={77}
                            className="group-hover:scale-110 transition-transform duration-300 ease-in-out"
                        />
                        <span className="font-pixel text-4xl font-bold text-[#232323]">
                            PAWSE
                        </span>
                    </Link>
                    <p className="text-sm tracking-[0.02em] text-[#232323]">
                        © 2026 PAWSE App. All rights reserved.
                    </p>
                </div>

                {/* Right Group*/}
                <div className="flex flex-col items-start md:items-end gap-2">
                    <Link
                        href="/about"
                        className="text-2xl text-[#232323] hover:underline"
                    >
                        About
                    </Link>
                    <Link
                        href="/privacy"
                        className="text-2xl text-[#232323] hover:underline"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href="/terms"
                        className="text-2xl text-[#232323] hover:underline"
                    >
                        Terms of Service
                    </Link>
                </div>
            </footer>
        </div>
    );
}
