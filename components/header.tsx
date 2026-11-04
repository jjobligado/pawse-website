import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full flex py-6 px-6 md:px-10 justify-between items-center border-b-2 border-stroke bg-white">
            <Link href="/" className="flex items-center gap-4 group">
                <Image
                    src="/images/logo.png"
                    alt="Pawse Logo"
                    width={48}
                    height={46}
                    className="group-hover:scale-110 transition-transform duration-300 ease-in-out"
                />
                <span className="font-pixel text-3xl md:text-4xl font-bold text-[#232323]">
                    PAWSE
                </span>
            </Link>

            <Link
                href="#beta"
                className="flex items-center gap-2 py-2 rounded-full group transition-opacity hover:opacity-80"
            >
                <span className="font-pixel text-xl md:text-2xl font-medium text-accent">
                    Join the Beta
                </span>
                <Image
                    src="/images/arrow-right-blue.svg"
                    alt="Arrow right"
                    width={24}
                    height={24}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                />
            </Link>
        </header>
    );
}
