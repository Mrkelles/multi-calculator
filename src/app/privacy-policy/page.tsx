import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Mail, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4 md:px-8 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-xl font-bold font-headline text-primary">My Apex Calc</h1>
      </header>

      <main className="flex-1 p-6 md:p-12 lg:p-20">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-extrabold font-headline tracking-tight text-primary">Privacy Policy</h2>
          </div>

          <div className="prose prose-slate max-w-none text-muted-foreground space-y-12 leading-relaxed">
            <div className="space-y-4">
              <p className="font-bold text-foreground">Last Updated: October 31, 2026</p>
              <p>
                My Apex Calc ("we", "our" or "us") respects your privacy. This Privacy Policy explains how information may be collected, used, stored and shared when you visit or use <Link href="https://www.myapexcalc.com/" className="text-primary hover:underline">https://www.myapexcalc.com/</Link>.
              </p>
              <p>
                By using our website, you acknowledge that you have read this Privacy Policy.
              </p>
            </div>

            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">1.</span> Information We May Collect
              </h3>
              <p>
                The information we handle depends on how you use the website and which features you access.
              </p>
              
              <div className="space-y-4 ml-4 border-l-2 border-primary/10 pl-6">
                <h4 className="font-bold text-foreground">Information You Provide</h4>
                <p>
                  If you contact us through our contact form or email, we may receive information such as:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Your name.</li>
                  <li>Your email address.</li>
                  <li>The subject and contents of your message.</li>
                  <li>Any other information you choose to include in your enquiry.</li>
                </ul>
                <p className="italic text-sm">Please avoid sending sensitive personal information unless it is necessary for us to respond to your request.</p>
              </div>

              <div className="space-y-4 ml-4 border-l-2 border-primary/10 pl-6">
                <h4 className="font-bold text-foreground">Calculator Information</h4>
                <p>
                  You may enter values into our calculators, including financial amounts, percentages, dates, measurements and other figures.
                </p>
                <p>
                  Some calculator operations may be performed directly in your browser. Other website features or technical services may process information through our servers or third-party providers.
                </p>
                <p>
                  We do not ask users to submit sensitive personal information to use ordinary calculators. Do not enter confidential information, passwords, payment details or personal identifiers into calculator fields.
                </p>
              </div>

              <div className="space-y-4 ml-4 border-l-2 border-primary/10 pl-6">
                <h4 className="font-bold text-foreground">Technical and Usage Information</h4>
                <p>
                  When you visit the website, certain information may be received automatically by our hosting provider, security services, analytics tools or other technologies. Depending on the services in use, this may include:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>IP address.</li>
                  <li>Browser type and version.</li>
                  <li>Device and operating system information.</li>
                  <li>Pages visited and referring pages.</li>
                  <li>Approximate location derived from network information.</li>
                  <li>Date, time and duration of visits.</li>
                  <li>General website usage and interaction information.</li>
                </ul>
                <p>This information may be used for website operation, security, troubleshooting, performance measurement and improvement.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">2.</span> Cookies and Similar Technologies
              </h3>
              <p>
                My Apex Calc and certain third-party services may use cookies, pixels, local storage or similar technologies. These technologies may be used to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Remember website preferences.</li>
                <li>Support website functionality.</li>
                <li>Understand how visitors use the website.</li>
                <li>Measure website performance.</li>
                <li>Support advertising and advertising measurement.</li>
              </ul>
              <p>
                You can manage or delete cookies through your browser settings. Disabling certain cookies may affect some website features.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">3.</span> Analytics and Website Performance
              </h3>
              <p>
                We may use analytics or performance-measurement services to understand how visitors use My Apex Calc and to improve the website. These services may collect information such as page views, device information, approximate location, referral sources and interactions with website content.
              </p>
              <p>
                Where third-party analytics services are used, their collection and processing of information are also governed by their own privacy policies.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">4.</span> Advertising and Third-Party Advertising Partners
              </h3>
              <p>
                My Apex Calc may display advertisements provided by third-party advertising partners, including Google AdSense. Third-party vendors, including Google, may use cookies or similar technologies to serve advertisements based on a user's previous visits to this website or other websites.
              </p>
              <p>
                Google's use of advertising cookies enables Google and its partners to serve advertisements to users based on their visits to this website and/or other websites on the internet.
              </p>
              <p>
                Advertising technologies may process information such as IP addresses, browser information, device identifiers, cookie identifiers, page URLs and advertising interactions for purposes such as ad delivery, frequency control, measurement, fraud prevention and, where permitted by the user's settings and applicable requirements, personalized advertising.
              </p>
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-4">
                <p className="text-sm font-bold text-foreground">Manage your choices:</p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="https://policies.google.com/technologies/partner-sites" className="text-primary hover:underline flex items-center gap-2">
                      <Globe className="w-4 h-4" /> How Google uses information from sites
                    </Link>
                  </li>
                  <li>
                    <Link href="https://adssettings.google.com/" className="text-primary hover:underline flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Manage personalized advertising settings
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.aboutads.info/choices/" className="text-primary hover:underline flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Industry advertising choices
                    </Link>
                  </li>
                </ul>
              </div>
              <p className="text-sm italic">The presence of third-party advertisements or links does not mean that My Apex Calc controls the privacy practices of the companies providing them.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">5.</span> How We Use Information
              </h3>
              <p>Information handled through the website may be used to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Operate and maintain My Apex Calc.</li>
                <li>Respond to questions, feedback and support requests.</li>
                <li>Identify and resolve technical problems.</li>
                <li>Protect the website against spam, fraud, misuse and security threats.</li>
                <li>Understand website usage and improve our calculators and content.</li>
                <li>Support advertising and measure website performance.</li>
                <li>Comply with applicable legal obligations.</li>
              </ul>
              <p>We do not intend to use contact information for unrelated marketing communications without an appropriate basis or permission.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">6.</span> How Information May Be Shared
              </h3>
              <p>We may share or allow access to relevant information with service providers that help us operate the website, such as:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Website hosting and infrastructure providers.</li>
                <li>Website security and performance providers.</li>
                <li>Analytics providers, where used.</li>
                <li>Advertising partners, where advertising is enabled.</li>
                <li>Email or contact-form service providers.</li>
                <li>Legal or regulatory authorities where disclosure is required by law.</li>
              </ul>
              <p>Service providers may process information according to their own terms and privacy policies. We do not sell personal information submitted through our contact form as a standalone mailing list.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">7.</span> Data Retention and Security
              </h3>
              <p>
                We retain information for only as long as reasonably necessary for the purposes described in this policy, subject to applicable legal, operational and security requirements.
              </p>
              <p>
                We take reasonable steps to protect information handled through our website. However, no method of internet transmission or electronic storage can be guaranteed to be completely secure.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">8.</span> Third-Party Websites and Services
              </h3>
              <p>
                Our website may contain links to external websites or use third-party services. We do not control the content, security or privacy practices of external websites. We encourage you to read the privacy policies of any third-party services you visit or use.
              </p>
            </section>

            <section className="space-y-4 text-foreground">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-primary">9.</span> Your Privacy Choices and Rights
              </h3>
              <p className="text-muted-foreground">
                Depending on your location and applicable privacy laws, you may have rights relating to your personal information. These may include the right to request access, correction or deletion, object to certain processing, or withdraw consent where processing is based on consent.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Mail className="w-5 h-5 text-primary" />
                <p className="font-bold">support@myapexcalc.com</p>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">10.</span> Children's Privacy
              </h3>
              <p>
                My Apex Calc is a general-purpose calculator website and is not intentionally designed to collect personal information from children. If you believe a child has submitted personal information to us, please contact us so that we can review the matter and take appropriate action.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">11.</span> Changes to This Privacy Policy
              </h3>
              <p>
                We may update this Privacy Policy from time to time to reflect changes to our website, services, technology or legal obligations. When we make changes, we will update the "Last Updated" date on this page.
              </p>
            </section>

            <section className="space-y-6 bg-slate-50 p-8 rounded-[2rem] border border-dashed">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">12.</span> Contact Us
              </h3>
              <p className="text-muted-foreground">If you have questions about this Privacy Policy or how information is handled on My Apex Calc, contact:</p>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-foreground">
                  <span className="font-bold w-20">Email:</span>
                  <a href="mailto:myapexcalc@gmail.com" className="text-primary hover:underline font-medium">myapexcalc@gmail.com</a>
                </p>
                <p className="flex items-center gap-2 text-foreground">
                  <span className="font-bold w-20">Website:</span>
                  <Link href="https://www.myapexcalc.com/" className="text-primary hover:underline font-medium">https://www.myapexcalc.com/</Link>
                </p>
              </div>
              <div className="pt-4">
                <p className="text-xl font-bold text-primary font-headline">My Apex Calc</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
