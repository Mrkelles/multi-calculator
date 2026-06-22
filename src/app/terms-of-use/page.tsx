import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-extrabold font-headline tracking-tight text-primary">Terms of Use</h2>
          </div>

          <div className="prose prose-slate max-w-none text-muted-foreground space-y-6 leading-relaxed">
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h3>
              <p>
                By accessing and using My Apex Calc, you agree to be bound by these Terms of Use. If you do not agree to all of these terms, please do not use this website.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">2. Disclaimer of Warranties</h3>
              <p className="bg-amber-50 p-4 border border-amber-100 rounded-lg text-amber-900 font-medium italic">
                The calculators on this site are provided for informational and educational purposes only. They are NOT intended to provide financial, legal, or medical advice.
              </p>
              <p>
                My Apex Calc does not guarantee the accuracy, completeness, or reliability of any results provided by our tools. You should always consult with a qualified professional before making significant decisions based on these results.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">3. Limitation of Liability</h3>
              <p>
                Under no circumstances shall My Apex Calc be liable for any direct, indirect, or consequential damages resulting from the use or inability to use our tools.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">4. Modifications</h3>
              <p>
                We reserve the right to modify these terms at any time. Your continued use of the site following any changes signifies your acceptance of the new terms.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
