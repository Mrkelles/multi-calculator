import Link from 'next/link';
import { ArrowLeft, FileText, ShieldAlert, Scale, Info, Mail, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';

export default function TermsOfUsePage() {
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
            <FileText className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-extrabold font-headline tracking-tight text-primary">Terms of Use</h2>
          </div>

          <div className="prose prose-slate max-w-none text-muted-foreground space-y-12 leading-relaxed">
            <div className="space-y-4">
              <p className="font-bold text-foreground">Last Updated: October 31, 2026</p>
              <p>
                Welcome to My Apex Calc (<Link href="https://www.myapexcalc.com/" className="text-primary hover:underline">https://www.myapexcalc.com/</Link>).
              </p>
              <p>
                These Terms of Use govern your access to and use of the My Apex Calc website, calculators, content and related features.
              </p>
              <p>
                By accessing or using this website, you agree to these terms. If you do not agree, please discontinue use of the website.
              </p>
            </div>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">1.</span> About My Apex Calc
              </h3>
              <p>
                My Apex Calc provides online calculators and informational resources covering mathematics, education, finance, health, fitness, time calculations, digital revenue estimates and other practical topics.
              </p>
              <p>
                Our tools are intended to assist with general calculations, learning, planning and estimation.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">2.</span> Permitted Use
              </h3>
              <p>
                You may use My Apex Calc for lawful personal, educational and professional purposes.
              </p>
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                <p className="font-bold text-foreground mb-4">When using the website, you agree not to:</p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Use the website for unlawful or fraudulent activities.</li>
                  <li>Attempt to interfere with the website's operation, security or availability.</li>
                  <li>Introduce malicious software, harmful code or automated activity intended to disrupt the service.</li>
                  <li>Attempt unauthorized access to our systems, servers or data.</li>
                  <li>Copy, reproduce, distribute or commercially exploit website content in ways that violate applicable intellectual property laws.</li>
                  <li>Misuse the website in a manner that could harm other users or our services.</li>
                </ul>
              </div>
              <p>We reserve the right to restrict access where we reasonably believe these terms have been violated.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">3.</span> Calculator Results and Accuracy
              </h3>
              <p>
                Our calculators are designed to provide useful numerical results based on the information entered and the calculation methods implemented.
              </p>
              <div className="space-y-4 ml-4 border-l-2 border-primary/10 pl-6">
                <p className="font-bold text-foreground">However, results may be affected by:</p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Incorrect or incomplete input values.</li>
                  <li>Assumptions used by a particular calculator.</li>
                  <li>Rounding methods and calculation precision.</li>
                  <li>Changes in tax rates, financial rates, regulations or other external information.</li>
                  <li>Differences between the calculator's methodology and the methods used by institutions, professionals or service providers.</li>
                </ul>
              </div>
              <p>
                We make reasonable efforts to improve the clarity and reliability of our tools, but we do not guarantee that every result will be accurate, complete, current or suitable for every individual situation.
              </p>
              <p className="font-bold text-foreground">You are responsible for checking important results before relying on them.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">4.</span> No Professional Advice
              </h3>
              <p>
                The information and results provided by My Apex Calc are for general informational and educational purposes only. They do not constitute professional advice, including:
              </p>
              
              <div className="grid gap-6 mt-6">
                <div className="p-4 rounded-xl bg-muted/30 border space-y-2">
                  <h4 className="font-bold text-foreground flex items-center gap-2">
                    <Scale className="w-4 h-4 text-primary" />
                    Financial and Investment Advice
                  </h4>
                  <p className="text-sm">Loan, mortgage, savings, investment, interest, retirement, tax and debt calculations are estimates. They do not account for every financial circumstance, fee, regulation or market condition.</p>
                </div>
                
                <div className="p-4 rounded-xl bg-muted/30 border space-y-2">
                  <h4 className="font-bold text-foreground flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-primary" />
                    Medical and Health Advice
                  </h4>
                  <p className="text-sm">BMI, calorie, body-fat, pregnancy, conception and other health-related calculations are general estimates. They do not diagnose, treat or prevent medical conditions and should not replace advice from a qualified healthcare professional.</p>
                </div>
                
                <div className="p-4 rounded-xl bg-muted/30 border space-y-2">
                  <h4 className="font-bold text-foreground flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    Legal and Tax Advice
                  </h4>
                  <p className="text-sm">Tax and other legal-related calculations may depend on your jurisdiction, applicable laws, personal circumstances and the relevant tax year. Consult a qualified professional or appropriate authority when necessary.</p>
                </div>
                
                <div className="p-4 rounded-xl bg-muted/30 border space-y-2">
                  <h4 className="font-bold text-foreground flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Educational Guidance
                  </h4>
                  <p className="text-sm">Grade and GPA calculations depend on the grading scale and policies selected or assumed. Your school or institution may use different requirements.</p>
                </div>
              </div>
              <p className="pt-4">
                You should consult an appropriately qualified professional before making significant financial, medical, legal, tax or other specialist decisions.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">5.</span> Changes to Calculators and Website Content
              </h3>
              <p>
                We may add, update, improve, suspend or remove calculators, features, explanations and other website content at any time. We may also correct calculation errors or change calculation methods where necessary.
              </p>
              <p>We are not obligated to maintain any particular calculator or feature indefinitely.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">6.</span> Intellectual Property
              </h3>
              <p>
                Unless otherwise stated, the content published on My Apex Calc, including original written explanations, website design, branding, graphics and calculator interface elements, is owned by or licensed to My Apex Calc.
              </p>
              <p>
                You may access and use the website for its intended purposes. You may not reproduce, republish, distribute, modify or commercially exploit substantial portions of our original website content without prior permission, except where permitted by applicable law.
              </p>
              <p>Third-party names, trademarks and materials remain the property of their respective owners.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">7.</span> Third-Party Services and Links
              </h3>
              <p>
                My Apex Calc may use or link to third-party websites, tools, advertising services and other external resources. These services may operate under separate terms and privacy policies.
              </p>
              <p>
                We do not control or guarantee the availability, accuracy, security or practices of third-party services. Your use of those services is subject to their applicable terms.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">8.</span> Website Availability
              </h3>
              <p>
                We aim to keep My Apex Calc accessible and functional. However, we do not guarantee uninterrupted availability or error-free operation.
              </p>
              <p>
                Access may occasionally be affected by maintenance, technical problems, hosting issues, network interruptions or circumstances beyond our control.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">9.</span> Limitation of Liability
              </h3>
              <p>To the extent permitted by applicable law, My Apex Calc and its operators shall not be liable for losses or damages arising from:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Reliance on calculator results or website information without independent verification.</li>
                <li>Errors, omissions or outdated information.</li>
                <li>Temporary website interruptions or unavailability.</li>
                <li>Use of or inability to use our calculators or other features.</li>
                <li>The actions, services or content of third-party websites and providers.</li>
              </ul>
              <p>Nothing in these terms excludes liability where doing so would be prohibited by applicable law.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">10.</span> Indemnity
              </h3>
              <p>
                To the extent permitted by applicable law, you agree to be responsible for claims, losses or expenses arising from your unlawful use of the website or your violation of these Terms of Use.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">11.</span> Changes to These Terms
              </h3>
              <p>
                We may revise these Terms of Use from time to time. Updated terms will be published on this page with a revised "Last Updated" date.
              </p>
              <p>Your continued use of the website after changes are published constitutes acceptance of the revised terms, to the extent permitted by applicable law.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">12.</span> Governing Law
              </h3>
              <p>
                These Terms of Use shall be interpreted in accordance with applicable laws and regulations. Any disputes relating to the use of this website shall be handled by the appropriate courts or authorities with jurisdiction, subject to applicable legal requirements.
              </p>
            </section>

            <section className="space-y-6 bg-slate-50 p-8 rounded-[2.5rem] border border-dashed">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">13.</span> Contact Information
              </h3>
              <p>If you have questions about these Terms of Use, please contact us:</p>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-foreground">
                  <span className="font-bold w-20 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email:</span>
                  <a href="mailto:myapexcalc@gmail.com" className="text-primary hover:underline font-medium">myapexcalc@gmail.com</a>
                </p>
                <p className="flex items-center gap-2 text-foreground">
                  <span className="font-bold w-20 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Website:</span>
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
