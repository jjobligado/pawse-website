import type { Metadata } from "next";
import { Inter, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Lets relative metadata URLs resolve to the real domain. Canonical + og:url are set per page
  // (a canonical here would be inherited by every page and point them all at the homepage).
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    // Other pages set e.g. `title: "Privacy Policy"` → "Privacy Policy · PAWSE"
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Pomodoro timer",
    "focus timer",
    "desktop productivity app",
    "virtual pet",
    "pixel cat",
    "study timer",
    "Windows",
    "macOS",
    "Linux",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    // images: add app/opengraph-image.png (1200×630) once design delivers it; Next.js picks it up automatically.
  },
  twitter: {
    // Switch to "summary_large_image" when the share image exists.
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning // This is to prevent hydration mismatch errors when using server-side rendering with Next.js
      className={`${inter.variable} ${pixelifySans.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        {/* Keyboard users can jump past the header; hidden until focused */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-full focus:bg-white focus:text-sm focus:font-medium focus:text-ink focus:shadow-elevated focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
