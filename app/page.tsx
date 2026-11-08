import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/site-config";
import HeroSection from "@/components/landing/hero-section";
import HowItWorksSection from "@/components/landing/how-it-works-section";
import CompanionsSection from "@/components/landing/companions-section";
import FocusSection from "@/components/landing/focus-section";
import BreakSection from "@/components/landing/break-section";
import DashboardSection from "@/components/landing/dashboard-section";
import ComingSoonSection from "@/components/landing/coming-soon-section";
import FaqSection from "@/components/landing/faq-section";
import DownloadBanner from "@/components/landing/download-banner";
import ContactSection from "@/components/landing/contact-section";
import StructuredData from "@/components/landing/structured-data";

// Homepage-only: canonical URL and og:url. openGraph is restated in full because page
// metadata replaces (not merges) the layout's openGraph object.
export const metadata: Metadata = {
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        url: "/",
        siteName: SITE_NAME,
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        locale: "en_US",
    },
};

export default function HomePage() {
    return (
        <div className="w-full flex flex-col bg-white overflow-x-hidden">
            <StructuredData />
            <HeroSection />
            <HowItWorksSection />
            <CompanionsSection />
            <FocusSection />
            <BreakSection />
            <DashboardSection />
            <ComingSoonSection />
            <FaqSection />
            <DownloadBanner />
            <ContactSection />
        </div>
    );
}
