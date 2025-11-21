import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet";
import { useEffect } from "react";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Privacy Policy - TempMail</title>
        <meta name="description" content="TempMail Privacy Policy. Learn how we collect, use, and protect your personal information." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="border-b border-border/50">
          <div className="mx-auto max-w-4xl px-4 md:px-6 py-8">
            <Link href="/">
              <a className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </a>
            </Link>
          </div>
        </div>

        <article className="mx-auto max-w-4xl px-4 md:px-6 py-12">
          <h1 className="text-5xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: November 2024</p>

          <div className="prose prose-invert max-w-none space-y-8 text-foreground/80 leading-relaxed">
            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">1. Introduction</h2>
              <p>TempMail ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains our data practices and your privacy rights. This policy applies to all users of TempMail's website and services.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-2xl font-semibold text-foreground mt-6 mb-3">2.1 Automatically Collected Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>IP Address:</strong> We collect your IP address for security, fraud prevention, and analytics purposes</li>
                <li><strong>Browser Information:</strong> Browser type, version, and operating system</li>
                <li><strong>Cookies & Tracking:</strong> Session cookies for functionality (theme preference, session management)</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, and interactions with the service</li>
                <li><strong>Device Information:</strong> Device type, screen resolution, and device identifiers</li>
                <li><strong>Referring URLs:</strong> Where you came from when visiting our site</li>
              </ul>

              <h3 className="text-2xl font-semibold text-foreground mt-6 mb-3">2.2 User-Provided Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Generated Email Addresses:</strong> The temporary email addresses you create (not stored permanently)</li>
                <li><strong>Emails Received:</strong> Email content received to temporary addresses (auto-deleted after session)</li>
                <li><strong>QR Code Data:</strong> QR codes generated for email sharing (session-based, not stored permanently)</li>
                <li><strong>Service Preferences:</strong> Theme selection (light/dark mode), language preferences</li>
              </ul>

              <h3 className="text-2xl font-semibold text-foreground mt-6 mb-3">2.3 Third-Party Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Analytics data from Google Analytics and similar services</li>
                <li>Data from third-party email providers we use for email functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use collected information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Providing and improving the TempMail service</li>
                <li>Personalizing your experience (theme preference, UI language)</li>
                <li>Analytics and understanding user behavior</li>
                <li>Security and fraud prevention</li>
                <li>Compliance with legal obligations</li>
                <li>Communicating service updates or security notices</li>
                <li>Troubleshooting technical issues</li>
                <li>Optimizing performance and reliability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">4. Data Storage & Retention</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Email Data:</strong> Automatically deleted after your session ends (typically within 24 hours of last activity)</li>
                <li><strong>Temporary Addresses:</strong> Not permanently stored; associated data is purged</li>
                <li><strong>IP Address:</strong> Retained for up to 90 days for security and analytics purposes</li>
                <li><strong>Cookies:</strong> Theme preference stored locally on your device indefinitely until cleared</li>
                <li><strong>Analytics Data:</strong> Retained for 26 months before automatic deletion</li>
                <li><strong>Server Logs:</strong> Maintained for 30 days for security and debugging</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">5. Cookies & Tracking Technologies</h2>
              <p>We use the following types of cookies:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Session Cookies:</strong> Required for the service to function (session management)</li>
                <li><strong>Preference Cookies:</strong> Store your theme selection (light/dark mode) and language preferences</li>
                <li><strong>Analytics Cookies:</strong> Track usage patterns and service performance via Google Analytics</li>
              </ul>
              <p className="mt-4">Most browsers allow you to refuse cookies or alert you when cookies are being sent. You can manage cookies through your browser settings. Note that refusing cookies may limit service functionality.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">6. Caching Implementation</h2>
              <p>We implement caching at multiple levels to improve performance and user experience:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Local Storage Cache:</strong> Your theme preference (light/dark mode) is cached on your device to recognize your settings on future visits</li>
                <li><strong>Browser Cache:</strong> Static assets (CSS, JavaScript, images) are cached to reduce load times</li>
                <li><strong>Server-Side Cache:</strong> API responses are cached for 10 seconds to optimize performance during high traffic</li>
                <li><strong>CDN Cache:</strong> Content is cached globally for faster delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">7. Data Security</h2>
              <p>We implement industry-standard security measures to protect your information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>HTTPS encryption for all data transmission</li>
                <li>Automatic deletion of temporary email data after session expiration</li>
                <li>No permanent storage of sensitive email content</li>
                <li>Regular security audits and updates</li>
                <li>Secure server infrastructure with access controls</li>
                <li>Data backups with encryption</li>
              </ul>
              <p className="mt-4">While we implement strong security measures, no system is completely secure. We cannot guarantee absolute security of your data.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">8. Third-Party Data Sharing</h2>
              <p>We do NOT sell your personal data. We may share information with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Providers:</strong> Email providers, analytics services, hosting providers (under data processing agreements)</li>
                <li><strong>Legal Compliance:</strong> When required by law enforcement or court orders</li>
                <li><strong>Security:</strong> To detect and prevent fraud or security threats</li>
              </ul>
              <p className="mt-4">We do not share your data with third parties for marketing or advertising purposes.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">9. Your Privacy Rights</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Right to Access:</strong> Request what personal data we hold about you</li>
                <li><strong>Right to Deletion:</strong> Request erasure of your data ("Right to be Forgotten")</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate personal data</li>
                <li><strong>Right to Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>
              <p className="mt-4">To exercise these rights, contact us at privacy@tempmail.com</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">10. Children's Privacy</h2>
              <p>TempMail does not knowingly collect information from children under 13 years old. If we become aware that a child under 13 has provided us with personal information, we will delete such information and terminate the child's account immediately. Parents or guardians who believe their child has provided information to TempMail should contact us immediately.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">11. Geographic Considerations</h2>
              <p><strong>GDPR Compliance (EU Users):</strong> If you are in the EU, GDPR provides additional rights regarding your personal data. We comply with GDPR requirements for lawful basis, data protection impact assessments, and data subject rights.</p>
              <p className="mt-4"><strong>CCPA Compliance (California Users):</strong> California residents have specific rights under the California Consumer Privacy Act (CCPA). We comply with CCPA requirements including disclosure of data practices and consumer rights.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">12. Automated Decision-Making & Profiling</h2>
              <p>We do not use automated decision-making or profiling that could significantly affect you. All decisions are made by human review when necessary.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">13. International Data Transfers</h2>
              <p>Your information may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have data protection laws that differ from your home country. When we transfer data internationally, we implement appropriate safeguards including standard contractual clauses.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">14. Changes to This Privacy Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through a prominent notice on our website. Your continued use of TempMail after such modifications constitutes your acknowledgment of the modified Privacy Policy.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">15. Contact Us</h2>
              <p>If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
              <p className="mt-4">
                <strong>Email:</strong> privacy@tempmail.com<br />
                <strong>Mailing Address:</strong> TempMail Privacy Team<br />
                <strong>Website:</strong> https://tempmail.com<br />
                <strong>Response Time:</strong> We typically respond to privacy inquiries within 30 days
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">16. Data Protection Officer</h2>
              <p>We have appointed a Data Protection Officer (DPO) to oversee our privacy compliance. For data protection concerns, you can contact our DPO at: dpo@tempmail.com</p>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}
