export default function PrivacyPage() {
  return (
    <section className="bg-white px-6 py-20 sm:px-10 lg:px-40">
      <div className="mx-auto max-w-4xl text-black">
        
        {/* Header / Preamble */}
        <div className="mb-16 text-center">
          <h1 className="mb-8 font-pixel text-5xl font-semibold text-accent sm:text-6xl">
            Privacy Policy
          </h1>
          <div className="mx-auto max-w-3xl space-y-4 font-sans text-base leading-relaxed text-black/80">
            <p>
              PAWSE (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is a desktop productivity application that combines a focus timer with a virtual cat companion. This Privacy Policy explains what information we collect, why we collect it, how we use it, and the choices available to you. It applies to the PAWSE website, including our beta and launch signup form, and to the PAWSE desktop application. It does not apply to third-party websites or services that we may link to, such as our GitHub repository.
            </p>
            <p>
              PAWSE is currently in active development. As we introduce new features, including user accounts, Google Sign-In, and cloud synchronization, this policy will be updated to reflect those changes.
            </p>
            <p className="font-bold text-black">
              Effective from August 00, 2026
            </p>
            <p className="font-bold text-black">
              Last Updated: August 00, 2026
            </p>
          </div>
        </div>

        {/* Policy Content */}
        <div className="space-y-12 font-sans text-base leading-relaxed text-black/80">
          
          {/* Section 1 */}
          <section>
            <h2 className="mb-4 font-pixel text-3xl font-semibold text-black">
              1. Information We Collect
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-black">a. Information you provide directly</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
                  <li>Your email address, if you sign up for launch updates, beta communications, or create an account.</li>
                  <li>Account details, if you create one. This may be an email and password combination, or, if you choose to sign in with Google, basic profile information provided by Google, such as your name, email address, and profile picture.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-black">b. Information collected automatically (account holders only)</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
                  <li>Usage data, including your focus session history, total focus time, completed Pomodoros, favorite companion, and weekly activity patterns.</li>
                  <li>Technical data, such as your IP address and general device or operating system information. [Confirm before publishing whether this information is actually collected.]</li>
                </ul>
              </div>

              <p>
                <strong className="text-black">c. Cookies and similar technologies:</strong> Our website may use cookies or similar technologies to remember your preferences and, where applicable, to understand how the website is used. [Update this section once you confirm which tools, if any, are used, such as a basic analytics tool.] You may control cookies through your browser settings. Please note that disabling cookies may affect certain website functions.
              </p>
              <p>
                <strong className="text-black">d. Guest Mode:</strong> If you use PAWSE without creating an account, your data is stored locally on your device using SQLite and is not transmitted to our servers.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="mb-4 font-pixel text-3xl font-semibold text-black">
              2. How We Use Your Information
            </h2>
            <p className="mb-2">We use the information described above for the following purposes:</p>
            <ul className="mb-4 list-inside list-disc space-y-1 pl-4">
              <li>To operate and maintain the application, including synchronizing your focus data across devices if you have an account.</li>
              <li>To send you updates that you have chosen to receive, such as launch announcements or beta program communications.</li>
              <li>To understand aggregated usage patterns and improve PAWSE.</li>
              <li>To respond to support requests or feedback that you send to us.</li>
            </ul>
            <p className="mb-4">
              Where applicable law requires us to identify a legal basis for processing your personal data, we rely on your consent for optional communications, the performance of a contract to provide core account features such as data synchronization, and our legitimate interests in maintaining and improving PAWSE in a manner that does not override your privacy rights.
            </p>
            <p>
              We do not use your personal information for automated decision-making that produces legal or similarly significant effects on you.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="mb-4 font-pixel text-3xl font-semibold text-black">
              3. How We Share Your Information
            </h2>
            <p className="mb-2">We do not sell your personal information. We may share information with the following parties:</p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li><strong className="text-black">Google.</strong> If you choose to sign in with Google, subject to Google&apos;s own privacy policy.</li>
              <li><strong className="text-black">Supabase.</strong> Our cloud database provider, used to store and synchronize your account data. Supabase acts on our behalf and does not use your data for its own purposes.</li>
              <li><strong className="text-black">Analytics or crash reporting tools, if any.</strong> [Confirm before publishing.]</li>
              <li><strong className="text-black">Authorities.</strong> If required to comply with a legal obligation.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="mb-4 font-pixel text-3xl font-semibold text-black">
              4. International Data Transfers
            </h2>
            <p>
              Supabase may store data on servers located outside your country of residence. [Confirm the specific region once your Supabase project region is finalized.] Where your information is transferred internationally, we take steps to ensure it remains protected consistent with this policy and applicable law.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="mb-4 font-pixel text-3xl font-semibold text-black">
              5. Data Storage and Security
            </h2>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li><strong className="text-black">Local storage.</strong> Session data is stored on your device using SQLite.</li>
              <li><strong className="text-black">Cloud storage (account holders only).</strong> Synchronized data is stored using Supabase and linked to your account through a unique identifier.</li>
              <li>We take reasonable measures to protect your information. However, no method of storage or transmission can be guaranteed to be completely secure.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="mb-4 font-pixel text-3xl font-semibold text-black">
              6. Data Retention
            </h2>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>Local data remains on your device until you delete the application or clear its data.</li>
              <li>Cloud data is retained while your account is active and is deleted within [specify number] days of account deletion.</li>
              <li>Emails collected for launch or beta updates are retained until you unsubscribe.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="mb-4 font-pixel text-3xl font-semibold text-black">
              7. Your Privacy Rights
            </h2>
            <p className="mb-2">Depending on where you live, applicable law may give you some or all of the following rights regarding your personal data:</p>
            <ul className="mb-4 list-inside list-disc space-y-1 pl-4">
              <li>Access the personal data we hold about you.</li>
              <li>Correct inaccurate data.</li>
              <li>Request deletion of your data. This right is sometimes referred to as the right to be forgotten or the right to delete, depending on the applicable law.</li>
              <li>Restrict or object to certain processing of your data.</li>
              <li>Request a portable copy of your data.</li>
              <li>Opt out of the sale or sharing of personal information. Please note that we do not currently sell or share personal information.</li>
              <li>Limit the use of sensitive personal information.</li>
              <li>Withdraw your consent at any time, where processing is based on consent.</li>
              <li>Lodge a complaint with your local data protection or privacy authority.</li>
              <li>Not be discriminated against for exercising any of these rights.</li>
            </ul>
            <p className="mb-2">All users, regardless of location, may also:</p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li>Use Guest Mode to avoid providing any account-linked personal information.</li>
              <li>Unsubscribe from emails at any time using the link included in any email we send.</li>
              <li>Contact us at [support email] to exercise any of the rights described above.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="mb-4 font-pixel text-3xl font-semibold text-black">
              8. Do Not Track and Global Privacy Control
            </h2>
            <p>
              Some web browsers send &quot;Do Not Track&quot; or Global Privacy Control signals. [Confirm your actual handling before publishing. For example: &quot;We currently honor Global Privacy Control signals as an opt out of sale or sharing,&quot; or &quot;We do not currently respond to Do Not Track signals, as there is no accepted standard for how to interpret them.&quot;]
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="mb-4 font-pixel text-3xl font-semibold text-black">
              9. Third-Party Links
            </h2>
            <p>
              Our website may link to third-party sites, such as our Github repository or social media pages. This policy does not cover those sites. We encourage you to review their privacy practices separately.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="mb-4 font-pixel text-3xl font-semibold text-black">
              10. Children&apos;s Privacy
            </h2>
            <p>
              PAWSE is not directed to children under the age of 13, and we do not knowingly collect personal information from children in this age group. If you believe that a child has provided us with personal information, please contact us so that we can delete it.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="mb-4 font-pixel text-3xl font-semibold text-black">
              11. Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet is completely secure.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="mb-4 font-pixel text-3xl font-semibold text-black">
              12. Changes to This Policy
            </h2>
            <p>
              We may update this policy as PAWSE evolves. We will update the &quot;Last Updated&quot; date above, and for significant changes, we will provide reasonable notice, such as an in-app or email notice.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="mb-4 font-pixel text-3xl font-semibold text-black">
              13. Contact Us
            </h2>
            <p>
              If you have questions about this policy or your data, please contact us at [support email].
            </p>
          </section>

        </div>
      </div>
    </section>
  );
}