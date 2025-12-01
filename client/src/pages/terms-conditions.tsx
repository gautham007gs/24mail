import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { useLocalizedLink } from "@/hooks/use-localized-link";

function getLocalizedLink(path: string): string {
  const { getLocalizedLink: useGetLink } = useLocalizedLink();
  return useGetLink(path);
}

export default function TermsConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Terms & Conditions - Burner Email | Legal Agreement for Temp Mail Service</title>
        <meta name="description" content="Burner Email Terms and Conditions. Legal agreement for burner email, temp mail, and temporary email service usage. Understand your rights and responsibilities." />
        <meta name="keywords" content="terms and conditions, burner email terms, temp mail legal, temporary email agreement, email service terms" />
        <meta name="robots" content="index, follow, noarchive" />
        <link rel="canonical" href="https://burneremail.email/terms" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://burneremail.email/terms" />
        <meta property="og:title" content="Terms & Conditions - Burner Email" />
        <meta property="og:description" content="Burner Email Terms and Conditions - Legal agreement for burner email service." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="border-b border-border/50">
          <div className="mx-auto max-w-4xl px-4 md:px-6 py-8">
            <Link href={getLocalizedLink("/")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>

        <article className="mx-auto max-w-4xl px-4 md:px-6 py-12">
          <h1 className="text-5xl font-bold text-foreground mb-2">Terms & Conditions</h1>
          <p className="text-muted-foreground mb-8">Last updated: November 2024</p>

          <div className="prose prose-invert max-w-none space-y-8 text-foreground/80 leading-relaxed">
            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">1. Agreement to Terms</h2>
              <p>By accessing and using TempMail ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">2. Use License</h2>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on TempMail for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile, reverse engineer, disassemble, or otherwise reverse engineer any software contained on TempMail</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                <li>Using the Service for any unlawful purpose or in violation of any laws</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Spamming, phishing, or harassing other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">3. Disclaimer</h2>
              <p>The materials on TempMail are provided on an 'as is' basis. TempMail makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">4. Limitations of Liability</h2>
              <p>In no event shall TempMail or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TempMail, even if TempMail or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">5. Accuracy of Materials</h2>
              <p>The materials appearing on TempMail could include technical, typographical, or photographic errors. TempMail does not warrant that any of the materials on its website are accurate, complete, or current. TempMail may make changes to the materials contained on its website at any time without notice.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">6. Materials on TempMail</h2>
              <p>TempMail has not reviewed all of the information available through its website and is not responsible for the accuracy, legality or appropriateness of external material. Additionally, TempMail has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by TempMail of the site. Use of any such linked website is at the user's own risk.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">7. Modifications to Terms</h2>
              <p>TempMail may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">8. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws of international jurisdiction, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">9. Temporary Email Service Features</h2>
              <p>TempMail provides temporary email addresses for legitimate purposes including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Privacy protection during online transactions</li>
                <li>Spam prevention when signing up for services</li>
                <li>Developer testing and quality assurance</li>
                <li>Anonymous account creation</li>
              </ul>
              <p className="mt-4">Users agree not to use TempMail for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Spamming or sending unsolicited emails</li>
                <li>Phishing or social engineering attacks</li>
                <li>Circumventing security measures of other services</li>
                <li>Illegal activities or violating applicable laws</li>
                <li>Fraud or deception</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">10. Email Data Retention</h2>
              <p>Emails received through TempMail are automatically deleted after your session expires. We do not store permanent records of emails. All data is cleared from our servers automatically. TempMail retains the right to delete any content that violates these terms.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">11. Termination of Service</h2>
              <p>TempMail reserves the right to terminate your access to the Service at any time, for any reason, without notice. This includes cases where you violate these terms or engage in prohibited activities.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">12. Third-Party Services</h2>
              <p>TempMail uses third-party email services to receive and manage emails. These services are subject to their own terms and privacy policies. TempMail is not responsible for the practices of third-party providers.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">13. Contact Information</h2>
              <p>For questions about these Terms & Conditions, please contact us at:</p>
              <p className="mt-4">Email: legal@tempmail.com<br />Website: https://tempmail.com</p>
            </section>
          </div>
        </article>

        <Footer />
      </div>
    </>
  );
}
