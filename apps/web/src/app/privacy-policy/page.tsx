import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – Local For Vocal Startup",
  description: "Read our full Privacy Policy to understand how Local For Vocal Startup collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-display">
      <main className="w-full max-w-[900px] mx-auto px-4 md:px-8 py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-10 text-sm border-b border-slate-100 pb-5">
          <Link href="/" className="text-slate-500 hover:text-primary flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-base">home</span> Home
          </Link>
          <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
          <span className="text-slate-900 font-semibold">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="mb-12 pb-8 border-b border-slate-100">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold mb-4">
            <span className="material-symbols-outlined text-sm">shield</span>
            Legal Document
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-500 text-base">Last Updated: <strong>April 9, 2026</strong> · Effective: April 9, 2026</p>
          <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-slate-600 text-sm leading-relaxed m-0">
              This Privacy Policy describes how <strong>Local For Vocal Startup Private Limited</strong> ("we," "our," or "us") collects, uses, discloses, and safeguards your personal information when you use our website, mobile applications, seller portal, influencer dashboard, and related services (collectively, the "Platform"). Please read this policy carefully. By using our Platform, you agree to the practices described herein.
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <nav className="mb-12 p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-800 mb-4 uppercase tracking-wider">Table of Contents</h2>
          <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
            {[
              "Information We Collect",
              "How We Use Your Information",
              "Legal Bases for Processing",
              "Information Sharing and Disclosure",
              "Cookies and Tracking Technologies",
              "Data Security",
              "Data Retention",
              "International Data Transfers",
              "Your Privacy Rights",
              "Children's Privacy",
              "Third-Party Links",
              "Changes to This Policy",
              "Contact & Grievance Redressal",
            ].map((item, idx) => (
              <li key={idx}>
                <a href={`#section-${idx + 1}`} className="hover:text-primary transition-colors">{item}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-14 text-slate-700 leading-relaxed">

          {/* Section 1 */}
          <section id="section-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">1. Information We Collect</h2>

            <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">A. Information You Provide Directly</h3>
            <p className="mb-4">When you register, shop, apply as a seller, or interact with our platform, you voluntarily share information with us. This includes:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Account Details:</strong> Full name, email address, phone number, date of birth, profile photo, and password (stored as a one-way cryptographic hash).</li>
              <li><strong>Address Information:</strong> Shipping and billing addresses, including street, city, state, PIN code, and country.</li>
              <li><strong>Payment Information:</strong> Payment method details processed securely through PCI-DSS compliant gateways (Razorpay, Stripe). We never store full card numbers on our servers.</li>
              <li><strong>Communication Records:</strong> Messages sent to our support team, reviews, ratings, or any content you post on the Platform.</li>
              <li><strong>Business Information (Sellers):</strong> GSTIN, business registration documents, bank account details for payouts, store name, and product listings.</li>
              <li><strong>Influencer Profile (Creators):</strong> Social media handles, audience reach data (with your consent), tax forms, and payout banking details.</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">B. Information Collected Automatically</h3>
            <p className="mb-4">When you use our Platform, we automatically collect technical and behavioral data:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Device & Browser Data:</strong> Device model, operating system version, browser type, screen resolution, and unique device identifiers (e.g., advertising IDs on mobile).</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent, click patterns, search queries, and cart activity.</li>
              <li><strong>Log Data:</strong> IP address, HTTP request logs, error reports, and timestamps of all interactions with our servers.</li>
              <li><strong>Location Data:</strong> Approximate location derived from your IP address. Precise GPS location is accessed only with your explicit permission via device settings.</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">C. Information from Third Parties</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Social Sign-In:</strong> If you log in using Google or Apple, we receive your name, email, and profile photo from those providers, based on your consent to those platforms.</li>
              <li><strong>Fraud Prevention Partners:</strong> We receive risk signals and device reputation data from security services to detect and prevent fraudulent activity on our platform.</li>
              <li><strong>Analytics Providers:</strong> Aggregated behavioral metrics are enhanced with data from analytics integrations like Firebase.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="section-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">2. How We Use Your Information</h2>
            <p className="mb-4">We use your personal information only for legitimate purposes tied to delivering, improving, and protecting our Platform:</p>
            <div className="space-y-4">
              {[
                { icon: "shopping_cart", title: "Order Fulfillment", text: "To process your purchases, coordinate delivery through logistics partners, send order confirmations, and manage returns and refunds." },
                { icon: "person", title: "Account Management", text: "To create and maintain your user account, authenticate your identity, and manage your preferences, saved addresses, and purchase history." },
                { icon: "recommend", title: "Personalization", text: "To display relevant products, local sellers, and tailored promotions based on your location, browsing behavior, and past purchases." },
                { icon: "campaign", title: "Communications", text: "To send transactional notifications (order updates, OTPs, shipping alerts) and, with your consent, marketing messages about offers and new features." },
                { icon: "security", title: "Security & Fraud Prevention", text: "To monitor for suspicious account activity, detect fraudulent transactions, enforce our Terms of Service, and protect users and the platform." },
                { icon: "analytics", title: "Analytics & Improvement", text: "To understand how users interact with our Platform, identify usability issues, run A/B tests, and continuously improve our product." },
                { icon: "gavel", title: "Legal Compliance", text: "To meet our obligations under applicable laws, including tax reporting, KYC verification, responding to legal orders, and resolving disputes." },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-600 text-xl">{item.icon}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">{item.title}</p>
                    <p className="text-slate-600 text-sm m-0">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">3. Legal Bases for Processing</h2>
            <p className="mb-4">Where applicable under GDPR and similar regulations, we process your personal data under the following legal bases:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Contractual Necessity:</strong> Processing required to fulfill your order, manage your account, or perform any service you have requested from us.</li>
              <li><strong>Legitimate Interests:</strong> Fraud detection, platform security, product improvement, and internal business analytics, where these interests are not overridden by your rights.</li>
              <li><strong>Legal Obligation:</strong> Compliance with tax laws, financial regulations (KYC/AML), court orders, and statutory requirements.</li>
              <li><strong>Consent:</strong> Marketing communications, optional personalization features, and any processing you have explicitly opted into. You may withdraw consent at any time without affecting the lawfulness of prior processing.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="section-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">4. Information Sharing and Disclosure</h2>
            <p className="mb-4">We do not sell your personal data. We share your information only in the circumstances described below:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Sellers and Delivery Partners:</strong> When you place an order, your name, shipping address, and contact number are shared with the relevant seller and logistics partner to fulfill delivery.</li>
              <li><strong>Payment Processors:</strong> Billing information is transmitted to our PCI-DSS compliant payment gateways (Razorpay, Stripe) to process transactions. These processors handle payment data under their own privacy policies.</li>
              <li><strong>Cloud & Infrastructure Providers:</strong> Our Platform infrastructure is hosted on AWS and Google Cloud Platform. All data stored on these services is subject to strict contractual data processing agreements.</li>
              <li><strong>Analytics & Marketing Services:</strong> Aggregated or pseudonymized data may be shared with analytics tools (Firebase, Mixpanel) and advertising platforms to measure campaign performance and improve targeting.</li>
              <li><strong>Legal Authorities:</strong> We may disclose your information to government agencies, courts, or law enforcement if required by a valid legal order, subpoena, or applicable law.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of company assets, user data may be transferred as part of the transaction. We will notify you before your data is transferred and becomes subject to a different privacy policy.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="section-5">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">5. Cookies and Tracking Technologies</h2>
            <p className="mb-4">We use cookies and similar technologies to provide a seamless experience and gather analytics. The types of cookies we use:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-slate-200 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="text-left p-3 font-semibold border border-slate-200">Type</th>
                    <th className="text-left p-3 font-semibold border border-slate-200">Purpose</th>
                    <th className="text-left p-3 font-semibold border border-slate-200">Can Be Disabled?</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Essential", "Session management, authentication, shopping cart persistence, CSRF protection.", "No – Required for functionality"],
                    ["Performance", "Page load analytics, error tracking, A/B testing tools.", "Yes"],
                    ["Functional", "Remembering your language, location, and display preferences.", "Yes"],
                    ["Advertising", "Retargeting ads, frequency capping, cross-domain conversion tracking.", "Yes"],
                  ].map(([type, purpose, disable], idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="p-3 border border-slate-200 font-medium">{type}</td>
                      <td className="p-3 border border-slate-200 text-slate-600">{purpose}</td>
                      <td className="p-3 border border-slate-200 text-slate-600">{disable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-slate-500">You can manage cookie preferences via your browser settings or our cookie consent banner. Disabling non-essential cookies does not affect core shopping functionality.</p>
          </section>

          {/* Section 6 */}
          <section id="section-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">6. Data Security</h2>
            <p className="mb-4">We implement industry-standard technical and organizational security measures to protect your personal data against unauthorized access, disclosure, alteration, or destruction:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Encryption in Transit:</strong> All data exchanged between your device and our servers is encrypted using TLS 1.3.</li>
              <li><strong>Encryption at Rest:</strong> Sensitive database fields (including payment tokens and personal identifiers) are encrypted at rest using AES-256.</li>
              <li><strong>Access Control:</strong> Internal access to production data is governed by role-based access control (RBAC), and all access is logged and monitored.</li>
              <li><strong>Vulnerability Management:</strong> We conduct regular security audits, dependency vulnerability scans, and periodic penetration testing by accredited third-party firms.</li>
              <li><strong>Incident Response:</strong> In the event of a data breach affecting your rights, we will notify you and relevant authorities within 72 hours as required by applicable law.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="section-7">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">7. Data Retention</h2>
            <p className="mb-4">We retain your personal data only as long as necessary to fulfil the purposes outlined in this policy:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Active Accounts:</strong> Profile data, preferences, and order history are retained for the duration your account is active.</li>
              <li><strong>Deleted Accounts:</strong> Upon deletion, personal profile data is removed from live systems within 30 days. Encrypted backups are purged within 60 days.</li>
              <li><strong>Financial Records:</strong> Transaction records, GST invoices, and tax-related data are retained for a minimum of 7 years as required under the Income Tax Act and GST laws of India.</li>
              <li><strong>Support Records:</strong> Customer support conversation logs may be retained for up to 2 years to resolve disputes and improve service quality.</li>
              <li><strong>Anonymized Analytics:</strong> Behavioral analytics data, once anonymized, may be retained indefinitely for research and product improvement purposes.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section id="section-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">8. International Data Transfers</h2>
            <p className="mb-4">Our servers are primarily located in India. However, some of our third-party service providers (e.g., AWS, Google Cloud, Stripe) may store or process your data internationally. When such transfers occur:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>We ensure that data processors outside India provide an equivalent level of data protection through formal Data Processing Agreements (DPAs).</li>
              <li>For transfers to recipients in the EU/EEA, we rely on Standard Contractual Clauses (SCCs) as approved by the European Commission.</li>
              <li>All transfer mechanisms comply with applicable cross-border data transfer regulations, including the IT Act 2000, GDPR, and the Digital Personal Data Protection Act (DPDPA) 2023 of India.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section id="section-9">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">9. Your Privacy Rights</h2>
            <p className="mb-4">Depending on your location, you have the following rights regarding your personal data. To exercise any of these rights, contact us at <a href="mailto:privacy@localforvocalstartup.com" className="text-primary hover:underline">privacy@localforvocalstartup.com</a>.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Right to Access", desc: "Request a copy of all personal data we hold about you." },
                { title: "Right to Correction", desc: "Ask us to update or correct inaccurate information in your profile." },
                { title: "Right to Deletion", desc: "Request erasure of your account and personal data, subject to legal retention obligations." },
                { title: "Right to Portability", desc: "Receive your data in a structured, machine-readable format (e.g., JSON or CSV)." },
                { title: "Right to Object", desc: "Object to processing of your data for marketing, profiling, or research purposes." },
                { title: "Right to Withdraw Consent", desc: "Withdraw any consent you previously gave for optional processing at any time." },
                { title: "Right to Restrict Processing", desc: "Ask us to temporarily suspend processing while you contest the accuracy or lawfulness of our use." },
                { title: "Right to Lodge a Complaint", desc: "File a complaint with your national data protection authority if you believe your rights have been violated." },
              ].map((right, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-semibold text-slate-800 mb-1">{right.title}</p>
                  <p className="text-sm text-slate-600 m-0">{right.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500">We will respond to all verifiable requests within 30 days. In complex cases, this may be extended by an additional 30 days with notice.</p>
          </section>

          {/* Section 10 */}
          <section id="section-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">10. Children&apos;s Privacy</h2>
            <p>Our Platform is intended for users aged 18 and above. We do not knowingly collect personal data from individuals under the age of 13. If we become aware that a child under 13 has provided us with personal information without verifiable parental consent, we will take immediate steps to delete such data. Parents who believe their child has submitted data to our Platform should contact us at <a href="mailto:privacy@localforvocalstartup.com" className="text-primary hover:underline">privacy@localforvocalstartup.com</a>.</p>
          </section>

          {/* Section 11 */}
          <section id="section-11">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">11. Third-Party Links</h2>
            <p>Our Platform may contain links to third-party websites, social media platforms, or partner services. We are not responsible for the privacy practices of those entities. This Privacy Policy applies solely to data collected through our own Platform. We encourage you to review the privacy policies of any third-party sites you visit.</p>
          </section>

          {/* Section 12 */}
          <section id="section-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">12. Changes to This Policy</h2>
            <p className="mb-4">We may update this Privacy Policy periodically to reflect changes in our data practices, business operations, or legal requirements. When we make material changes, we will:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Update the "Last Updated" date at the top of this page.</li>
              <li>Display a prominent notice on the website or app for at least 14 days.</li>
              <li>Send an email notification to your registered email address for significant changes affecting your rights.</li>
            </ul>
            <p className="mt-4">Your continued use of the Platform after such notifications constitutes acceptance of the revised policy.</p>
          </section>

          {/* Section 13 */}
          <section id="section-13">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">13. Contact & Grievance Redressal</h2>
            <p className="mb-4">For any privacy-related questions, data subject requests, or complaints, please contact our Grievance Officer:</p>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">mail</span>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Email</p>
                  <a href="mailto:privacy@localforvocalstartup.com" className="font-semibold text-primary hover:underline">privacy@localforvocalstartup.com</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">phone</span>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                  <p className="font-semibold text-slate-800 m-0">+91 80 1234 5678 (Mon–Sat, 10am–6pm IST)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Postal Address</p>
                  <p className="font-semibold text-slate-800 m-0">Grievance Officer – Privacy, Local For Vocal Startup Pvt. Ltd., Tech Park, MG Road, Bengaluru, Karnataka 560001, India</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">If you are unsatisfied with our response, you may lodge a complaint with the relevant data protection authority in your jurisdiction.</p>
          </section>

        </div>

        {/* Footer Nav */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p className="m-0">© 2026 Local For Vocal Startup. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/account-deletion" className="hover:text-primary transition-colors">Account Deletion Policy</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
          </div>
        </div>

      </main>
    </div>
  );
}
