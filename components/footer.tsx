import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full flex py-10 px-10 justify-between items-center bg-accent-highlight dark:bg-black">
            {/* Left Group*/}
            <div className="flex flex-col justify-start gap-3">
                <Link href="/" className="flex items-center gap-2 group">                                                             
                    <Image
                        src="/pawse-temp-logo.png"
                        alt="Pawse Logo"
                        width={32}
                        height={32}
                        className="group-hover:scale-110 transition-transform duration-300 ease-in-out"
                    />                   
                    <span className="font-pixel text-2xl font-bold tracking-wider">                                                                         
                    PAWSE                                                             
                    </span>                                                                
                </Link>
                <p className="text-sm">© 2026 PAWSE App. All rights reserved.</p>
            </div>

            {/* Right Group*/}
            <div className="flex flex-col items-end gap-1">
                <Link href="/about" className="text-sm hover:underline">
                    About
                </Link>
                <Link href="/privacy" className="text-sm hover:underline">
                    Privacy Policy
                </Link>
                <Link href="/terms" className="text-sm hover:underline">
                    Terms of Service
                </Link>
            </div>
        </footer>
    );
}