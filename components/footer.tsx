import Image from "next/image";
import Link from "next/link";
import { FooterSpreadSection } from "@/components/pixel-divider";

export default function Footer() {
    return (
        <FooterSpreadSection>
            {/* Left Group */}
            <div className="relative z-10 flex flex-col justify-center gap-4 max-w-[600px]">
                <Link href="/" className="flex items-center gap-3 group">
                    <Image
                        src="/images/logo.png"
                        alt="Pawse Logo"
                        width={56}
                        height={54}
                        className="group-hover:scale-110 transition-transform duration-300 ease-in-out"
                    />
                    <span className="font-pixel text-2xl md:text-3xl font-bold text-ink">
                        PAWSE
                    </span>
                </Link>
                <p className="text-xs md:text-sm tracking-[0.02em] text-ink">
                    © 2026 PAWSE App. All rights reserved.
                </p>
            </div>

            {/* Right Group */}
            <div className="relative z-10 flex flex-col items-start md:items-end gap-2">
                <Link
                    href="/about"
                    className="text-base text-ink hover:underline"
                >
                    About
                </Link>
                <Link
                    href="/privacy"
                    className="text-base text-ink hover:underline"
                >
                    Privacy Policy
                </Link>
                <Link
                    href="/terms"
                    className="text-base text-ink hover:underline"
                >
                    Terms of Service
                </Link>
            </div>
        </FooterSpreadSection>
    );
}
