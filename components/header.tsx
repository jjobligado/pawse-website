"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 w-full flex py-2.5 px-6 sm:px-12 md:px-20 lg:px-[120px] justify-between items-center bg-white/95 backdrop-blur-sm border-b-2 transition-colors duration-200 ${
                scrolled ? "border-stroke" : "border-transparent"
            }`}
        >
            <Link href="/" className="flex items-center gap-3 group">
                <Image
                    src="/images/logo.png"
                    alt="Pawse Logo"
                    width={36}
                    height={35}
                    className="group-hover:scale-110 transition-transform duration-300 ease-in-out"
                />
                <span className="font-pixel text-3xl font-bold text-[#232323]">
                    PAWSE
                </span>
            </Link>

            <Link
                href="#beta"
                className="flex items-center gap-2 py-1 rounded-full group transition-opacity hover:opacity-80"
            >
                <span className="font-pixel text-lg font-medium text-accent">
                    Join the Beta
                </span>
                <Image
                    src="/images/arrow-right-blue.svg"
                    alt="Arrow right"
                    width={20}
                    height={20}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                />
            </Link>
        </header>
    );
}
