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

export default function HomePage() {
    return (
        <div className="w-full flex flex-col bg-white overflow-x-hidden">
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
