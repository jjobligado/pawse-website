import Link from "next/link";

export default function Header() {                                            
    return (                                                                    
    <header className="w-full border-b bg-white dark:bg-black py-4 px-6">     
        <div className="max-w-6xl mx-auto flex items-center justify-between">                                                                                                                       
        <Link href="/" className="flex items-center gap-2 group">                                                             
            {/* Logo Placeholder*/}                        
            <span className="font-pixel text-2xl font-bold tracking-wider">                                                                         
            PAWSE                                                             
            </span>                                                                
        </Link>                                                             
        </div>                                                                  
    </header>                                                                 
    );                                                                          
}