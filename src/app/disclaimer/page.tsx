import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DisclaimerPage() {
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
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-extrabold font-headline tracking-tight text-primary">Disclaimer</h2>
          </div>

          <div className="prose prose-slate max-w-none text-muted-foreground space-y-8 leading-relaxed">
            <p className="font-bold text-foreground">Last updated: October 14, 2026</p>
            
            <p>
              Welcome to My Apex Calc (https://www.myapexcalc.com/). This Disclaimer explains the limitations of the information, calculations, estimates, and tools provided on our website. By accessing or using My Apex Calc, you acknowledge and agree to the terms outlined below.
            </p>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">1. General Information and Educational Purposes</h3>
              <p>
                My Apex Calc provides free online calculators and informational content designed to help users perform mathematical calculations, explore estimates, and better understand various topics.
              </p>
              <p>
                Our tools cover areas including finance, health, pregnancy, fitness, business, advertising revenue, education, time, dates, unit conversions, and other everyday calculations.
              </p>
              <p>
                All information and results provided on this website are for general informational and educational purposes only. Although we aim to provide useful, accurate, and reliable tools, we do not guarantee that all information, calculations, or results will be complete, current, error-free, or suitable for every user's circumstances.
              </p>
              <p>
                You are responsible for evaluating the results and determining whether they are appropriate for your intended use.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">2. Accuracy of Calculations and Results</h3>
              <p>
                We make reasonable efforts to ensure that our calculators use appropriate formulas, methods, and assumptions. However, results may vary depending on the information entered, the calculation method used, rounding conventions, data sources, and other assumptions.
              </p>
              <p>
                Some calculators provide estimates rather than exact results. Actual outcomes may differ from calculated results.
              </p>
              <p>
                Before relying on a result for an important decision, you should independently verify the calculation and any relevant assumptions.
              </p>
              <p>
                My Apex Calc is not responsible for errors arising from incorrect inputs, limitations in calculation methods, outdated information, or differences between estimated and actual outcomes, to the extent permitted by applicable law.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">3. No Medical Advice</h3>
              <p>
                Health, fitness, body mass index (BMI), body fat, calorie, basal metabolic rate (BMR), ideal weight, pregnancy, conception, and due-date calculators are provided for general informational and educational purposes only.
              </p>
              <p>
                These tools do not provide medical advice, diagnosis, treatment, or individualized healthcare recommendations. Their results are estimates and should not be used as a substitute for an assessment by a qualified healthcare professional.
              </p>
              <p>
                Health-related results may not account for individual medical conditions, medications, age, pregnancy circumstances, or other factors that can affect their interpretation.
              </p>
              <p>
                Pregnancy, conception, and due-date estimates cannot establish the exact date of conception or determine the precise course of a pregnancy. Actual dates and developmental milestones may vary.
              </p>
              <p>
                Always consult a qualified healthcare professional regarding medical concerns, pregnancy-related questions, dietary changes, or decisions affecting your health. Do not delay or disregard professional medical advice because of information obtained from this website.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">4. No Financial, Investment, Tax, or Legal Advice</h3>
              <p>
                Our mortgage, loan, interest, investment, retirement, savings, debt payoff, salary, tax, inflation, currency, return on investment (ROI), and other financial calculators provide estimates based on the inputs and assumptions supplied by users.
              </p>
              <p>
                These tools are not intended to provide personalized financial, investment, tax, accounting, or legal advice.
              </p>
              <p>
                Actual financial outcomes may differ because of interest rates, fees, taxes, inflation, market conditions, lender requirements, exchange-rate fluctuations, changes in applicable laws, and other factors.
              </p>
              <p>
                Investment projections are hypothetical and do not guarantee future returns. Loan and mortgage estimates may exclude fees, insurance, taxes, penalties, or other costs unless explicitly included in the calculator.
              </p>
              <p>
                Tax calculations may not reflect all applicable laws, deductions, credits, filing requirements, or changes in tax regulations. Currency conversions may differ from rates offered by banks, payment providers, or currency exchanges.
              </p>
              <p>
                Before making significant financial, investment, borrowing, retirement, or tax decisions, consider consulting an appropriately qualified professional and verifying the applicable terms, rates, and regulations.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">5. Advertising Revenue and Social Media Estimates</h3>
              <p>
                Our advertising revenue, YouTube revenue, TikTok revenue, and social media engagement calculators provide estimates based on user-provided inputs and the assumptions stated in each tool.
              </p>
              <p>
                Actual creator earnings, advertising revenue, and engagement rates can vary significantly depending on audience location, content type, platform eligibility, advertiser demand, monetization programs, platform policies, traffic quality, engagement, seasonality, and other factors.
              </p>
              <p>
                Revenue estimates are not guarantees of earnings. My Apex Calc does not guarantee that any website, creator, publisher, or social media account will qualify for monetization or achieve a particular level of revenue.
              </p>
              <p>
                Platform features, eligibility rules, monetization policies, and payment terms may change. Users should consult the relevant platform's official documentation for current requirements.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">6. Educational, Mathematical, and General-Purpose Calculators</h3>
              <p>
                Our scientific, percentage, fraction, triangle, standard deviation, GPA, grade, date, time, age, unit conversion, and other general-purpose calculators are intended to assist with calculations and learning.
              </p>
              <p>
                Results may depend on the selected formula, grading scale, measurement units, rounding rules, or other assumptions. Different institutions, jurisdictions, or technical standards may use different methods.
              </p>
              <p>
                You should verify important results independently, especially when using them for academic submissions, professional work, construction projects, payroll, or other applications where an error could have significant consequences.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">7. Password Generator and Security</h3>
              <p>
                If you use our password generator or other security-related tools, you are responsible for evaluating whether the generated output meets your security requirements.
              </p>
              <p>
                Do not assume that a password or other security-related output is secure unless the tool's implementation and limitations support that conclusion. Avoid sharing sensitive information through any website unless you understand how it is processed and protected.
              </p>
              <p>
                Users should follow appropriate security practices, including using unique passwords and enabling multifactor authentication where available.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">8. External Links and Third-Party Services</h3>
              <p>
                Our website may contain links to third-party websites, resources, services, or platforms for informational purposes.
              </p>
              <p>
                We do not control and are not responsible for the content, availability, accuracy, privacy practices, security, or policies of third-party websites. A link to an external website does not necessarily imply endorsement of that website or its services.
              </p>
              <p>
                When using third-party services, you should review their applicable terms, privacy policies, and other relevant information.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">9. Advertising and Third-Party Content</h3>
              <p>
                My Apex Calc may display advertisements provided by third-party advertising partners, including Google, where applicable.
              </p>
              <p>
                Third-party advertisements may be selected or delivered based on factors determined by the advertising provider, subject to its policies and applicable user privacy choices.
              </p>
              <p>
                We do not necessarily endorse the products, services, claims, or offers presented in third-party advertisements. Users should independently evaluate any advertised product or service before making a purchase or other commitment.
              </p>
              <p>
                Advertising availability and personalization may depend on applicable consent requirements, privacy settings, and advertising-provider policies.
              </p>
              <p>
                For more information about how information may be collected or used, please read our Privacy Policy.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">10. Availability and Changes to Our Website</h3>
              <p>
                We aim to keep My Apex Calc accessible and useful. However, we do not guarantee uninterrupted availability or that every calculator, feature, data source, or item of content will always function without errors.
              </p>
              <p>
                We may update, modify, suspend, or discontinue website features and content at any time, including to correct errors, improve functionality, or reflect changes in relevant methods and information.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">11. Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by applicable law, My Apex Calc and its operators disclaim liability for losses or damages arising from the use of, reliance on, or inability to use this website, its calculators, its content, or its estimates.
              </p>
              <p>
                This includes, where permitted by law, direct or indirect losses, financial losses, business interruption, data loss, and decisions made in reliance on calculated results.
              </p>
              <p>
                Nothing in this Disclaimer excludes or limits any liability or legal rights that cannot lawfully be excluded or limited under applicable law.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">12. Changes to This Disclaimer</h3>
              <p>
                We may update this Disclaimer from time to time to reflect changes to our website, calculators, services, or applicable requirements.
              </p>
              <p>
                Any revised version will be published on this page with an updated revision date. Your continued use of the website after an update constitutes use subject to the revised Disclaimer, to the extent permitted by applicable law.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">13. Contact Us</h3>
              <p>
                If you have questions about this Disclaimer or the information provided on My Apex Calc, please contact us through our website's Contact page.
              </p>
              <p className="font-bold">Website: https://www.myapexcalc.com/</p>
            </section>

            <Separator />
            
            <p className="italic text-sm">
              By using My Apex Calc, you acknowledge that its calculators and informational content are provided subject to the limitations described in this Disclaimer.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 px-6 bg-muted/20 text-center">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} My Apex Calc. Professional precision tools.</p>
      </footer>
    </div>
  );
}
