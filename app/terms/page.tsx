export default function TermsAndService() {
    return (
        <section className="bg-white px-6 py-20 sm:px-10 lg:px-40">
            <div className="mx-auto max-w-4xl text-black">
                
                {/* Header / Preamble */}
                <div className="mb-16 text-center">
                    <h1 className="mb-8 font-pixel text-5xl font-semibold text-accent sm:text-6xl">
                        Terms of Service
                    </h1>
                    <div className="mx-auto max-w-3xl space-y-4 font-sans text-base leading-relaxed text-[#141414]">
                        <p>
                            Welcome to PAWSE. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the PAWSE website and the PAWSE desktop application, together referred to as the &quot;Service,&quot; operated by meowskrrt, a team based in the Republic of the Philippines (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing our website, signing up for updates, or downloading and using the PAWSE application, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Service.
                        </p>
                        <p>
                            PAWSE is currently in active development. The current version does not offer user accounts, Google Sign-In, or cloud synchronization of application data. We will update these Terms as features or practices change.
                        </p>
                        <div className="font-sans text-[#141414] pt-4">
                            <p><strong className="text-[#141414]">Effective date: </strong>November 7, 2026</p> 
                            <p><strong className="text-[#141414]">Last updated: </strong>November 7, 2026</p>
                        </div>
                    </div>
                </div>

                {/* Policy Content */}
                <div className="space-y-12 font-sans text-base leading-relaxed text-[#141414]">
                    
                    {/* Section 1 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            1. Use of the Service
                        </h2>
                        <ul className="list-inside list-disc text-[#141414] space-y-2 pl-4">
                            <li>You must be at least 13 years old to use PAWSE. If you are below the age of majority where you live, you may use the Service only with the permission and supervision of a parent or legal guardian who agrees to these Terms.</li>
                            <li>You agree to use the Service only for lawful purposes and in accordance with these Terms.</li>
                            <li>You agree not to use the Service to distribute malicious software, interfere with or disrupt the Service, or impersonate another person when contacting us or submitting feedback.</li>
                            <li>PAWSE&apos;s timer, companion, and progress features work offline. Internet access is used for software update checks and downloads. Feature availability may vary by operating system and is subject to change in future updates.</li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            2. Local Application Data and Privacy
                        </h2>
                        <ul className="list-inside list-disc text-[#141414] space-y-2 pl-4">
                            <li>You may use PAWSE without creating an account. Application data, including session history, progress statistics, companion preferences, and settings, is stored locally on your device.</li>
                            <li>The timer, companion, and progress features work offline. The application connects to GitHub to check for software updates.</li>
                            <li>The current version does not provide cloud synchronization of application data across devices.</li>
                            <li>Local application data may be lost if it is deleted, your device fails, or the data becomes corrupted. Uninstalling PAWSE may not remove all locally stored data.</li>
                            <li>Information handling and your privacy choices are described in our Privacy Policy. Agreeing to these Terms does not automatically subscribe you to optional launch or beta communications.</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            3. Beta Program and Pre-Release Software
                        </h2>
                        <ul className="list-inside list-disc text-[#141414] space-y-2 pl-4">
                            <li>PAWSE may be made available to you as part of a beta testing program or in another pre-release capacity.</li>
                            <li>Beta or pre-release versions of PAWSE may contain bugs, errors, or incomplete features, and may not function as intended.</li>
                            <li>You may choose to submit feedback or bug reports to help us improve the Service. Personal information included in these submissions is handled as described in our Privacy Policy.</li>
                            <li>We may modify, suspend, or discontinue beta features. Where reasonably practicable, we will provide advance notice of changes that materially affect your use of the beta.</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            4. Intellectual Property
                        </h2>
                        <ul className="list-inside list-disc text-[#141414] space-y-2 pl-4">
                            <li>PAWSE, including its name, logo, pixel art, the Tux, Ginger, and Void companion designs, and associated branding, is owned by the respective rights holders within meowskrrt or their licensors and is protected by applicable intellectual property laws.</li>
                            <li>Your rights to use, copy, modify, and distribute PAWSE software are governed by the license accompanying the software. The PAWSE source code is made publicly available on GitHub under the MIT License, which governs your rights to the code it covers. These Terms do not limit rights granted under that open-source license.</li>
                            <li>Third-party components and assets remain subject to their respective licenses.</li>
                            <li>You may not copy, modify, distribute, sell, or lease materials that are not licensed for those activities, except as permitted by applicable law or with permission from the relevant rights holder.</li>
                            <li>These Terms do not grant permission to use PAWSE&apos;s name, logo, or branding in a way that falsely suggests an affiliation with or endorsement by us.</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            5. Feedback
                        </h2>
                        <p className="mb-4">
                            If you submit feedback, suggestions, or ideas about PAWSE, whether through the beta program or otherwise, you grant us the right to use that feedback to improve the Service without any obligation to compensate you or to attribute the feedback to you.
                        </p>
                        <p>
                            This permission does not authorize us to publish personal information included in your feedback. Personal information is handled as described in our Privacy Policy.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            6. Third-Party Services
                        </h2>
                        <ul className="list-inside list-disc text-[#141414] space-y-2 pl-4">
                            <li>PAWSE uses third-party services for certain functions, including Supabase to store website signup email addresses, GitHub to distribute application updates, and Google/Gmail to receive and store support messages and feedback. Information handled in connection with these services is described in our Privacy Policy.</li>
                            <li>When you independently access third-party websites or services through external links, your use of those websites or services is subject to their applicable terms and privacy policies.</li>
                            <li>We do not control the availability, content, or practices of independently operated third-party websites or services. This does not exclude responsibilities we may have under applicable law.</li>
                        </ul>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            7. Disclaimers
                        </h2>
                        <ul className="list-inside list-disc text-[#141414] space-y-2 pl-4">
                            <li>To the extent permitted by applicable law, the Service is provided &quot;as is&quot; and &quot;as available,&quot; without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement.</li>
                            <li>We do not guarantee that the Service will be uninterrupted, error-free, or secure, particularly during active development or beta testing.</li>
                            <li>Nothing in these Terms excludes warranties or rights that cannot lawfully be excluded.</li>
                        </ul>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            8. Limitation of Liability
                        </h2>
                        <ul className="list-inside list-disc text-[#141414] space-y-2 pl-4">
                            <li>To the fullest extent permitted by applicable law, the persons or entity operating PAWSE under the name meowskrrt shall not be liable for indirect, incidental, special, consequential, or punitive damages, or loss of data, arising out of or related to your use of the Service.</li>
                            <li>Nothing in these Terms excludes or limits liability that cannot lawfully be excluded or limited, including liability for fraud or any mandatory rights or remedies available under applicable law.</li>
                        </ul>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            9. Stopping Use and Access Restrictions
                        </h2>
                        <ul className="list-inside list-disc text-[#141414] space-y-2 pl-4">
                            <li>We may suspend or restrict access to online services we operate where reasonably necessary to address violations of these Terms, misuse, or security risks, subject to applicable law.</li>
                            <li>You may stop using the Service at any time. To remove locally stored application data, follow the instructions provided in our Privacy Policy or supporting documentation.</li>
                            <li>Restrictions on access to our online services do not override rights granted under applicable open-source licenses.</li>
                            <li>Sections of these Terms that by their nature should continue to apply after you stop using the Service, including Intellectual Property, Feedback, Disclaimers, and Limitation of Liability, will remain in effect, subject to applicable law and licenses.</li>
                        </ul>
                    </section>

                    {/* Section 10 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            10. Changes to the Service or These Terms
                        </h2>
                        <ul className="list-inside list-disc text-[#141414] space-y-2 pl-4">
                            <li>We may modify features or discontinue development, updates, support, or online services. Where reasonably practicable, we will provide notice of significant changes.</li>
                            <li>We may update these Terms as PAWSE evolves. We will update the &quot;Last updated&quot; date above and, for significant changes, provide reasonable notice and state when the changes take effect.</li>
                            <li>Where permitted by applicable law, your continued use of the Service after receiving notice of changes and after those changes take effect constitutes your acceptance of the updated Terms. Where applicable law requires express agreement, we will seek that agreement.</li>
                            <li>Changes to these Terms do not override rights already granted under applicable open-source licenses.</li>
                        </ul>
                    </section>

                    {/* Section 11 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            11. Governing Law
                        </h2>
                        <p className="mb-4">
                            These Terms are governed by the laws of the Republic of the Philippines, without regard to its conflict of law principles.
                        </p>
                        <p>
                            Nothing in these Terms deprives you of mandatory protections available under applicable law in your country of residence.
                        </p>
                    </section>

                    {/* Section 12 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            12. Contact Us
                        </h2>
                        <p>
                            If you have questions about these Terms or the Service, please contact us at <strong className="text-[#141414]">pawseapp.team@gmail.com</strong>.
                        </p>
                    </section>

                </div>
            </div>
        </section>
    );
}