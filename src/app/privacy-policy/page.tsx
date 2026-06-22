import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-extrabold font-headline tracking-tight text-primary">Privacy Policy</h2>
          </div>

          <div className="prose prose-slate max-w-none text-muted-foreground space-y-6">
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">1. Information Collection</h3>
              <p>
                My Apex Calc does not require user registration. We do not collect personally identifiable information from our users. Any data you input into our calculators is processed locally or temporarily and is not stored on our servers unless explicitly stated for specific tool functionality.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">2. Usage of Cookies</h3>
              <p>
                We use basic cookies to enhance your experience, such as remembering your last selected currency or theme settings. Third-party services, such as Google Analytics, may also use cookies to provide us with anonymous traffic data to help us improve the site.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">3. Third-Party Links</h3>
              <p>
                Our website may contain links to external sites. We are not responsible for the content or privacy practices of these third-party websites.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">4. Data Security</h3>
              <p>
                We implement a variety of security measures to maintain the safety of your information. We use SSL encryption to ensure that data transmitted between your browser and our site is secure.
              </p>
            </section>

            <p className="text-xs pt-8 border-t italic">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
