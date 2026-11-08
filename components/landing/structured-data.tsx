import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-config";
import { FAQS } from "./faq-section";

/**
 * JSON-LD structured data for search engines and AI assistants: describes
 * PAWSE as a free desktop app and mirrors the on-page FAQ. Rendered as a
 * <script> per the Next.js JSON-LD guide ("<" escaped to prevent injection).
 */
const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "SoftwareApplication",
            name: SITE_NAME,
            description: SITE_DESCRIPTION,
            url: SITE_URL,
            applicationCategory: "ProductivityApplication",
            operatingSystem: "Windows, macOS, Linux",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        {
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.plain },
            })),
        },
    ],
};

export default function StructuredData() {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
            }}
        />
    );
}
