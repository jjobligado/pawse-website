export default function PrivacyPolicy() {
    return (
        <section className="bg-white px-6 py-20 sm:px-10 lg:px-40">
            <div className="mx-auto max-w-4xl text-black">
                
                {/* Header / Preamble */}
                <div className="mb-16 text-center">
                    <h1 className="mb-8 font-pixel text-5xl font-semibold text-accent sm:text-6xl">
                        Privacy Policy
                    </h1>
                    <div className="mx-auto max-w-3xl space-y-4 font-sans text-base leading-relaxed text-[#141414]">
                        <p>
                            PAWSE (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is a desktop productivity application that combines a focus timer with a virtual cat companion. It is operated by meowskrrt, a team based in the Republic of the Philippines.
                        </p>
                        <p>
                            This Privacy Policy explains what information we collect, why we collect it, how we use it, and the choices available to you. It applies to the PAWSE website, including our beta and launch signup form, and to the PAWSE desktop application. It does not apply to third-party websites or services that you access through external links, such as our GitHub repository.
                        </p>
                        <p>
                            PAWSE is currently in active development. The current version does not offer user accounts, Google Sign-In, or cloud synchronization of application data. This policy will be updated as our features and information-handling practices change.
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
                            1. Information We Handle
                        </h2>
                        
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-[#141414]">a. Information you provide directly</h3>
                                <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
                                    <li>Your email address, if you sign up for launch updates or beta communications.</li>
                                    <li>Information you provide when contacting us for support or submitting feedback, including your contact details, message contents, and any screenshots, attachments, or bug reports you choose to share.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-[#141414]">b. Information stored locally on your device</h3>
                                <p className="mt-1">
                                    PAWSE stores application data locally using an unencrypted SQLite database (pawse.db) and local application storage. Locally stored information includes your focus session history, progress statistics, companion preferences, and application settings. Its timer, companion, and progress features work offline. The application does not automatically upload session data, focus history, or diagnostic reports to us or third-party services. It connects to GitHub for software update checks, as described below. You may also choose to share information with us when submitting a support request or bug report.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-[#141414]">c. Technical information</h3>
                                <p className="mt-1">
                                    The PAWSE desktop application connects to GitHub to check for software updates. This process may disclose your IP address and basic operating system details to GitHub&apos;s servers. The desktop app does not automatically send telemetry, crash logs, or analytics to our team. <br />
                                    [If applicable: Our landing website may collect basic web analytics such as IP addresses or request timestamps to help us monitor site traffic.]
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-[#141414]">d. Cookies and similar technologies</h3>
                                <p className="mt-1">
                                    The desktop application stores preferences, such as audio volume and toggle settings, locally on your device. These preferences are not automatically transmitted to us. <br />
                                    [If applicable: Our landing website may use cookies or similar tracking technologies for basic analytics. You can manage your cookie preferences through your browser settings.]
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            2. How We Use Your Information
                        </h2>
                        <p className="mb-2">The application uses locally stored information to operate its features, remember your preferences, and display your progress.</p>
                        <p className="mb-2">We use information we receive for the following purposes:</p>
                        <ul className="mb-4 list-inside list-disc space-y-1 pl-4">
                            <li>To send you updates that you have chosen to receive, such as launch announcements or beta program communications.</li>
                            <li>To respond to support requests or feedback.</li>
                            <li>To investigate reported bugs and improve PAWSE using feedback you choose to submit.</li>
                            <li>To monitor website performance and deliver software updates.</li>
                        </ul>
                        <p>
                            We rely on your consent to send optional launch and beta communications. You may withdraw your consent at any time by unsubscribing. We rely on our legitimate interest in maintaining and updating PAWSE where the processing is necessary for that purpose and does not override your rights and freedoms.
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            3. How We Share Your Information
                        </h2>
                        <p className="mb-2">We do not sell your personal information. We may disclose information to:</p>
                        <ul className="mb-4 list-inside list-disc space-y-2 pl-4">
                            <li><strong className="text-[#141414]">Service providers.</strong> Providers that help us operate the website, manage signup submissions, deliver requested emails, or handle support communications, where those services are used.</li>
                            <li><strong className="text-[#141414]">Supabase.</strong> We use Supabase to store and manage email addresses submitted through our website for beta testing and launch updates.</li>
                            <li><strong className="text-[#141414]">GitHub.</strong> We use GitHub to distribute application updates. GitHub receives technical information when your application checks for or downloads updates, as described in Section 1(c).</li>
                            <li><strong className="text-[#141414]">Authorities.</strong> Where disclosure is required to comply with an applicable legal obligation or valid legal process.</li>
                        </ul>
                        <p>
                            Permission to use feedback under our Terms and Conditions does not authorize us to publish personal information included in that feedback.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            4. International Data Transfers
                        </h2>
                        <p>
                            We are based in the Republic of the Philippines. Because we use international service providers for our landing website and update delivery, any information you submit online (such as email signups) or automatic update requests may be processed on servers located outside the Philippines.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            5. Data Storage and Security
                        </h2>
                        <ul className="mb-4 list-inside list-disc space-y-2 pl-4">
                            <li><strong className="text-[#141414]">Local storage.</strong> Application data is stored on your device in an unencrypted SQLite database (pawse.db) and other local application storage.</li>
                            <li><strong className="text-[#141414]">Information submitted to us.</strong> Beta and launch signup information is stored in Supabase. Support messages and feedback are stored through [email or support service provider].</li>
                        </ul>
                        <p>
                            We take reasonable measures to protect information under our control. However, no method of storage or transmission can be guaranteed to be completely secure, and we cannot guarantee the absolute security of local files if your device is compromised.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            6. Data Retention
                        </h2>
                        <ul className="list-inside list-disc space-y-2 pl-4">
                            <li><strong className="text-[#141414]">Local application data.</strong> Local data remains on your device until it is removed. Uninstalling PAWSE may not remove all application data. To delete locally stored data, fully close PAWSE and delete the PAWSE application data folder located in your operating system&apos;s standard user data directory. This permanently removes your saved progress and preferences. Reopening PAWSE may create new local data.</li>
                            <li><strong className="text-[#141414]">Launch and beta communications.</strong> Email addresses are retained for the duration of the beta program and initial launch phase. If you unsubscribe, we may retain a limited record of your email to prevent sending you future communications.</li>
                            <li><strong className="text-[#141414]">Support and feedback.</strong> Messages, bug reports, and attachments are retained for as long as necessary to address your inquiry or resolve the reported issue.</li>
                            <li><strong className="text-[#141414]">Technical information.</strong> Update request logs managed by GitHub are subject to GitHub&apos;s data retention policies.</li>
                        </ul>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            7. Your Privacy Rights and Choices
                        </h2>
                        <p className="mb-2">Depending on applicable law, you may have some or all of the following rights regarding your personal information:</p>
                        <ul className="mb-4 list-inside list-disc space-y-1 pl-4">
                            <li>Access the personal information we hold about you.</li>
                            <li>Correct inaccurate information.</li>
                            <li>Request deletion of your information.</li>
                            <li>Restrict or object to certain processing.</li>
                            <li>Request a portable copy of your information where applicable.</li>
                            <li>Withdraw your consent where processing is based on consent.</li>
                            <li>Lodge a complaint with the relevant data protection or privacy authority.</li>
                        </ul>
                        <p className="mb-4 font-bold text-[#141414]">
                            In the Philippines, the relevant authority is the National Privacy Commission.
                        </p>
                        <p className="mb-2">You may also:</p>
                        <ul className="mb-4 list-inside list-disc space-y-1 pl-4">
                            <li>Use the current PAWSE desktop application without creating an account.</li>
                            <li>Unsubscribe from optional emails through the unsubscribe link provided in our emails.</li>
                            <li>Remove locally stored application data by following the instructions in Section 6.</li>
                            <li>Contact us at [email address] to make a request concerning information we hold about you.</li>
                        </ul>
                        <p className="mb-4">
                            We cannot remotely access or delete application data that exists only on your device. If you choose to send us a copy through a support request, that copy is handled according to this policy.
                        </p>
                        <p>
                            We may request information reasonably necessary to verify your identity and respond to a privacy request.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            8. Do Not Track and Global Privacy Control
                        </h2>
                        <p>
                            The desktop application does not track your activity across other websites. Its network connections for software updates are described in Section 1(c).
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            9. Third-Party Links
                        </h2>
                        <p>
                            Our website and application may link to third-party sites, such as our GitHub repository or LinkedIn pages. This policy does not cover those sites. We encourage you to review their privacy practices separately.
                        </p>
                    </section>

                    {/* Section 10 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            10. Children&apos;s Privacy
                        </h2>
                        <p className="mb-4">
                            Consistent with our Terms and Conditions, PAWSE is intended for users aged 13 and older. Users below the age of majority where they live may use the Service only with the permission and supervision of a parent or legal guardian.
                        </p>
                        <p>
                            We do not knowingly collect personal information from children under 13. If you believe that a child under 13 has provided us with personal information, please contact us at [email address] so that we can investigate and take appropriate steps to delete it.
                        </p>
                    </section>

                    {/* Section 11 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            11. Changes to This Policy
                        </h2>
                        <p className="mb-4">
                            We may update this policy as PAWSE evolves or our information-handling practices change. We will update the &quot;Last updated&quot; date above whenever this policy is revised.
                        </p>
                        <p>
                            For significant changes, we will provide appropriate notice, such as through our website or an in-app notice. Where applicable law requires consent for a new use of personal information, we will obtain it before that processing begins.
                        </p>
                    </section>

                    {/* Section 12 */}
                    <section>
                        <h2 className="mb-4 font-pixel text-3xl font-semibold text-[#232323]">
                            12. Contact Us
                        </h2>
                        <p>
                            If you have questions about this policy or your personal information, please contact us at [email address].
                        </p>
                    </section>

                </div>
            </div>
        </section>
    );
}