import Image from "next/image";
import Link from "next/link";

export default function Header() {                                            
    return (                                                                    
    <header className="w-full flex py-4 px-10 justify-start items-center border-b border-stoke bg-white dark:bg-black">                                                                                                                           
        <Link href="/" className="flex items-center gap-4 group">                                                             
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
    </header>                                                                 
    );                                                                          
}