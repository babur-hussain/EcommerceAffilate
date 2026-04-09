import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Deletion Policy – Local For Vocal Startup",
  description: "Learn how to permanently delete your Local For Vocal Startup account and understand what happens to your data after deletion.",
};

export default function AccountDeletionPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-display">
      <main className="w-full max-w-[900px] mx-auto px-4 md:px-8 py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-10 text-sm border-b border-slate-100 pb-5">
          <Link href="/" className="text-slate-500 hover:text-primary flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-base">home</span> Home
          </Link>
          <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
          <span className="text-slate-900 font-semibold">Account Deletion Policy</span>
        </div>

        {/* Header */}
        <div className="mb-12 pb-8 border-b border-slate-100">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-semibold mb-4">
            <span className="material-symbols-outlined text-sm">delete_forever</span>
            Account & Data Management
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Account Deletion Policy</h1>
          <p className="text-slate-500 text-base">Last Updated: <strong>April 9, 2026</strong> · Effective: April 9, 2026</p>
          <div className="mt-6 p-5 bg-rose-50 rounded-xl border border-rose-200">
            <p className="text-rose-800 text-sm leading-relaxed m-0">
              <strong>⚠ Important:</strong> Account deletion is a permanent and irreversible action. Deleted accounts cannot be recovered, restored, or reactivated. Please read this policy in full before submitting a deletion request.
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <nav className="mb-12 p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-800 mb-4 uppercase tracking-wider">Contents</h2>
          <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
            {[
              "Overview and Purpose",
              "Who Can Request Account Deletion",
              "How to Delete Your Account",
              "Pre-Deletion Checklist",
              "What Happens After Deletion",
              "Data We Retain After Deletion",
              "Special Considerations for Sellers",
              "Special Considerations for Influencers",
              "Effect on Active Orders and Subscriptions",
              "Reactivation and Recovery",
              "Deletion via Support Request",
              "Contact Us",
            ].map((item, idx) => (
              <li key={idx}>
                <a href={`#del-section-${idx + 1}`} className="hover:text-primary transition-colors">{item}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-14 text-slate-700 leading-relaxed">

          {/* Section 1 */}
          <section id="del-section-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">1. Overview and Purpose</h2>
            <p className="mb-4">
              At Local For Vocal Startup, we respect your right to control your personal data, including your right to have your account and associated information permanently removed from our Platform. This Account Deletion Policy explains the process, timeline, and consequences of deleting your account — whether you are a buyer, seller, influencer, or delivery partner.
            </p>
            <p>
              This policy is part of our broader commitment to data privacy under the Digital Personal Data Protection Act (DPDPA) 2023 of India, the General Data Protection Regulation (GDPR), and other applicable privacy regulations. It should be read alongside our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          {/* Section 2 */}
          <section id="del-section-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">2. Who Can Request Account Deletion</h2>
            <p className="mb-4">Any verified account holder on the Local For Vocal Startup Platform may request deletion of their account. This includes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Consumer Accounts:</strong> Registered buyers with a verified email or phone number.</li>
              <li><strong>Seller/Business Accounts:</strong> Merchants and business owners registered on our Seller Portal.</li>
              <li><strong>Influencer/Creator Accounts:</strong> Members of our Creator and Affiliate Network.</li>
              <li><strong>Delivery Partner Accounts:</strong> Registered delivery executives on our logistics platform.</li>
            </ul>
            <p className="mt-4">
              Deletion requests must be submitted by the authenticated account owner. We are unable to process deletion requests from unauthorized third parties without a valid legal instrument (e.g., a court order or power of attorney in the case of deceased users).
            </p>
          </section>

          {/* Section 3 */}
          <section id="del-section-3">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">3. How to Delete Your Account</h2>
            <p className="mb-6">There are two ways to request account deletion:</p>
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 m-0">Through the App or Website (Self-Service)</h3>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600">
                  <li>Log in to your account on the website or mobile app.</li>
                  <li>Navigate to <strong>Account → Privacy Center</strong>.</li>
                  <li>Tap or click <strong>"Delete Account"</strong>.</li>
                  <li>Read the detailed warning about permanent data loss.</li>
                  <li>Enter your account password to confirm your identity.</li>
                  <li>Click <strong>"Permanently Delete My Account"</strong> to confirm.</li>
                  <li>You will receive a confirmation email within 5 minutes.</li>
                </ol>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 m-0">Via Email Request (Support Channel)</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3">If you cannot access your account, send a deletion request to:</p>
                <a href="mailto:delete@localforvocalstartup.com" className="text-primary font-semibold hover:underline">delete@localforvocalstartup.com</a>
                <p className="text-sm text-slate-600 mt-3">Include your registered email/phone number and a government-issued ID for identity verification. We will process your request within 7 business days.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="del-section-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">4. Pre-Deletion Checklist</h2>
            <p className="mb-4">Before requesting deletion, we recommend you complete the following steps to avoid disruption:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Resolve Open Orders:</strong> Ensure all active purchases have been delivered and any pending returns or refunds are completed. Deletion requests submitted while orders are in transit will be queued until resolution.</li>
              <li><strong>Withdraw Wallet Balance:</strong> Transfer any remaining balance in your Local For Vocal Wallet to your linked bank account. Wallet balances cannot be recovered post-deletion.</li>
              <li><strong>Cancel Active Subscriptions:</strong> Cancel any premium seller plans or promotional subscriptions to avoid further billing cycles.</li>
              <li><strong>Download Your Data:</strong> Use the "Request My Data" option in your Privacy Center to download an archive of your account history, orders, and profile information before deletion.</li>
              <li><strong>Close Seller Listings (Sellers Only):</strong> Mark all product listings as inactive and resolve any pending seller payments or chargebacks.</li>
              <li><strong>Settle Influencer Earnings (Creators Only):</strong> Ensure any outstanding commissions above the minimum payout threshold are disbursed before deletion.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="del-section-5">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">5. What Happens After Deletion</h2>
            <p className="mb-4">Once you submit a confirmed deletion request, the following process occurs:</p>
            <div className="relative pl-8 border-l-2 border-slate-200 space-y-8">
              {[
                { time: "Immediately", title: "Account Deactivated", desc: "Your account is logged out across all devices and marked for deletion. Login is disabled. Your public profile, reviews, and seller listings are no longer visible to other users." },
                { time: "Within 24 Hours", title: "Session Tokens Revoked", desc: "All active authentication tokens, OAuth sessions (Google, Apple), and API keys associated with your account are permanently invalidated." },
                { time: "Within 30 Days", title: "Profile Data Erased", desc: "Your name, contact information, saved addresses, chat history, browsing data, and profile details are permanently deleted from our live production systems." },
                { time: "Within 60 Days", title: "Backup Purge", desc: "All encrypted off-site database backups containing your personal data are overwritten as part of our regular backup rotation cycle." },
                { time: "Up to 7 Years", title: "Legal Records Retained", desc: "Financial records, tax invoices, and compliance data required under Indian law (GST, Income Tax) are retained in a restricted, encrypted archive. This data is inaccessible for any commercial use." },
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[2.35rem] top-1 w-4 h-4 rounded-full bg-primary border-2 border-white shadow-sm"></div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{step.time}</span>
                  <h4 className="font-semibold text-slate-800 mt-1 mb-1">{step.title}</h4>
                  <p className="text-sm text-slate-600 m-0">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6 */}
          <section id="del-section-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">6. Data We Retain After Deletion</h2>
            <p className="mb-4">
              Even after account deletion, certain data must be retained by law. We retain only the minimum data necessary and store it in restricted, encrypted archives inaccessible for marketing or profiling purposes.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-slate-200 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="text-left p-3 font-semibold border border-slate-200">Data Type</th>
                    <th className="text-left p-3 font-semibold border border-slate-200">Retention Period</th>
                    <th className="text-left p-3 font-semibold border border-slate-200">Legal Basis</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Transaction Invoices & GST Records", "7 years", "GST Act 2017, Income Tax Act 1961"],
                    ["Dispute & Chargeback Records", "3 years", "Consumer Protection Rules 2020"],
                    ["Fraud/Security Incident Logs", "3 years", "IT Act 2000, cybercrime compliance"],
                    ["Legal Hold Data (Court Orders)", "Duration of proceeding", "CrPC, Civil Procedure Code"],
                    ["Aggregated & Anonymized Analytics", "Indefinite (anonymous)", "No PII; used for product research"],
                  ].map(([type, period, basis], idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="p-3 border border-slate-200 font-medium">{type}</td>
                      <td className="p-3 border border-slate-200 text-slate-600">{period}</td>
                      <td className="p-3 border border-slate-200 text-slate-500">{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7 */}
          <section id="del-section-7">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">7. Special Considerations for Sellers</h2>
            <p className="mb-4">Seller accounts have additional obligations before deletion can be fully processed:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Outstanding Payments:</strong> Any pending payouts owed to you will be processed and disbursed to your registered bank account before deletion is finalized. This may take up to 5–10 business days beyond your standard payment cycle.</li>
              <li><strong>Buyer Protection:</strong> Your product listings, store page, and seller identity will be removed promptly. However, orders placed before the deletion date will continue to be fulfilled to protect buyer interests. You are legally obligated to complete these.</li>
              <li><strong>GST Compliance:</strong> Your business identity, GSTIN records, and sales invoices are retained for the legally mandated period (7 years) even after account deletion, as required by Indian GST law.</li>
              <li><strong>Negative Balance:</strong> If your account holds a negative balance (e.g., due to excess refunds or chargebacks), you must settle this before deletion can proceed. We will contact you with payment instructions.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section id="del-section-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">8. Special Considerations for Influencers</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Pending Commission Payouts:</strong> Any earned but unpaid commissions above our minimum payout threshold (₹500) will be disbursed to your linked bank account before your account is closed. Amounts below the threshold may be forfeited upon deletion.</li>
              <li><strong>Active Campaign Links:</strong> Your unique referral and affiliate tracking links will be deactivated immediately. Traffic or purchases through these links after deletion will not generate commissions and will not be attributed to you.</li>
              <li><strong>Tax Form Retention:</strong> Tax declaration forms (e.g., Form 16A) and earning statements will be retained in our encrypted compliance archive for 7 years as required by the Income Tax Act.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section id="del-section-9">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">9. Effect on Active Orders and Subscriptions</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Active Orders (As a Buyer):</strong> If you have orders in "Processing," "Shipped," or "Out for Delivery" status, your deletion request will be queued. Your account will not be deleted until these orders are either delivered, cancelled, or result in a resolved refund.</li>
              <li><strong>Returns and Refunds:</strong> Any pending return requests or approved refunds will be processed to your original payment method before account closure. Refunds cannot be redirected post-deletion.</li>
              <li><strong>Subscriptions:</strong> All active paid subscriptions or premium plans will be cancelled immediately upon deletion. No pro-rated refunds are issued for partially used subscription periods unless required by applicable consumer law.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section id="del-section-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">10. Reactivation and Recovery</h2>
            <p className="mb-4">Account deletion is permanent and irreversible. Specifically:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You will <strong>not</strong> be able to log back in, recover your purchase history, or restore your wishlist, reviews, or store settings after deletion is confirmed.</li>
              <li>Your username, store name, and email address will be released and may become available to new users in the future.</li>
              <li>If you wish to use the Platform again after deletion, you must create an entirely new account from scratch.</li>
            </ul>
            <div className="mt-6 p-5 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-amber-800 text-sm m-0">
                <strong>Tip:</strong> If you are deleting your account due to a negative experience, consider <strong>deactivating your account</strong> temporarily instead. Deactivation hides your profile and pauses activity but preserves all your data if you decide to return. You can deactivate from <strong>Account → Privacy Center → Deactivate Account</strong>.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="del-section-11">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">11. Deletion via Support Request</h2>
            <p className="mb-4">If you cannot access the self-service deletion option (e.g., due to forgotten credentials or a locked account), you may request deletion through our support team:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Email your request to <a href="mailto:delete@localforvocalstartup.com" className="text-primary hover:underline">delete@localforvocalstartup.com</a> with the subject line "Account Deletion Request."</li>
              <li>Include: your registered email address or phone number; a brief explanation of why you cannot access self-service deletion; and a scanned/photographed copy of a government-issued ID for identity verification.</li>
              <li>Our team will process your request within 7 business days and send a final confirmation email upon completion.</li>
            </ul>
            <p className="text-sm text-slate-500">We do not accept deletion requests via social media, live chat, or anonymous channels for security reasons.</p>
          </section>

          {/* Section 12 */}
          <section id="del-section-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">12. Contact Us</h2>
            <p className="mb-4">For questions or concerns related to account deletion, data erasure, or this policy, contact our Data Privacy Team:</p>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">mail</span>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Deletion Requests</p>
                  <a href="mailto:delete@localforvocalstartup.com" className="font-semibold text-primary hover:underline">delete@localforvocalstartup.com</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">privacy_tip</span>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">General Privacy Inquiries</p>
                  <a href="mailto:privacy@localforvocalstartup.com" className="font-semibold text-primary hover:underline">privacy@localforvocalstartup.com</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Grievance Officer</p>
                  <p className="font-semibold text-slate-800 m-0">Data Privacy Officer, Local For Vocal Startup Pvt. Ltd., Tech Park, MG Road, Bengaluru, Karnataka 560001, India</p>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Nav */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p className="m-0">© 2026 Local For Vocal Startup. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
          </div>
        </div>

      </main>
    </div>
  );
}
