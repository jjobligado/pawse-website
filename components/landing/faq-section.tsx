import Section from "./section";
import { SectionSubtitle, SectionTitle } from "./section-heading";
import FaqList from "./faq-list";

export { FAQS } from "./faq-data";

/** Segmented, tactile FAQ accordion grounded above the closing download window. */
export default function FaqSection() {
    return (
        <Section id="faq" className="flex flex-col items-center gap-6">
            <SectionTitle>Frequently Asked Questions</SectionTitle>
            <SectionSubtitle className="text-center text-balance">
                Everything you need to know before you download.
            </SectionSubtitle>

            <FaqList />
        </Section>
    );
}
