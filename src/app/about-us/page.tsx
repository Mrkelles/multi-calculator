import Link from 'next/link';
import { ArrowLeft, Info, Target, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutUsPage() {
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
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-extrabold font-headline tracking-tight text-primary">About My Apex Calc</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Our mission is to provide the world with a comprehensive suite of free, accurate, and easy-to-use online calculators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-sm bg-primary/5">
              <CardHeader>
                <Target className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Our Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">To become the go-to resource for any calculation, from complex financial planning to simple health metrics.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-accent/5">
              <CardHeader>
                <Users className="w-8 h-8 text-accent mb-2" />
                <CardTitle className="text-lg">Our Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">We build for students, professionals, and anyone who needs a quick, reliable answer without the friction.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-primary/5">
              <CardHeader>
                <Info className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Open & Free</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Accessibility is our priority. All our tools are free to use and designed for maximum clarity.</p>
              </CardContent>
            </Card>
          </div>

          <section className="space-y-6 bg-white p-8 rounded-3xl border shadow-sm">
            <h3 className="text-2xl font-bold text-primary">Why Choose Us?</h3>
            <p className="text-muted-foreground leading-relaxed">
              At My Apex Calc, we understand that accuracy matters. Every calculator on our platform is developed through rigorous modeling and testing. Whether you are calculating your mortgage interest, estimating your YouTube revenue, or tracking your health, you can trust our data to be consistent and precise.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We started with a simple idea: the web deserves better tools. No clutter, no complex sign-ups—just the math you need to make smarter decisions.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t py-8 px-6 bg-muted/20 text-center">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} My Apex Calc. Professional precision tools.</p>
      </footer>
    </div>
  );
}
