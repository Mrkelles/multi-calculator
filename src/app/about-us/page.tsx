import Link from 'next/link';
import { ArrowLeft, Target, BookOpen, Wallet, Activity, Clock, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';

export default function AboutUsPage() {
  const offerings = [
    {
      title: "Math and Education",
      description: "Tools for percentages, fractions, scientific calculations, grades, GPA and other mathematical tasks.",
      icon: BookOpen
    },
    {
      title: "Finance",
      description: "Calculators for loans, mortgages, savings, investments, interest, taxes, debt repayment and related financial estimates.",
      icon: Wallet
    },
    {
      title: "Health and Fitness",
      description: "Tools for estimating metrics such as BMI, calorie requirements, body fat and other general wellness measurements.",
      icon: Activity
    },
    {
      title: "Time and Everyday Use",
      description: "Calculators for dates, time, hours, conversions and other practical tasks.",
      icon: Clock
    },
    {
      title: "Digital and Creator Tools",
      description: "Calculators for estimating advertising revenue, YouTube revenue, TikTok revenue and engagement metrics.",
      icon: MousePointer2
    }
  ];

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
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-primary">About My Apex Calc</h1>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Making Everyday Calculations Easier</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                My Apex Calc is an online calculator platform designed to make everyday and specialized calculations easier to understand and perform.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you are working through a financial estimate, checking a mathematical problem, planning a project, reviewing a health-related metric or exploring content revenue, our goal is to provide accessible tools that help you get useful answers without unnecessary complexity.
              </p>
            </div>
          </div>

          {/* What We Offer */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">What We Offer</h2>
              <p className="text-muted-foreground">My Apex Calc brings together calculators across several categories, including:</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offerings.map((item, i) => (
                <Card key={i} className="border-none shadow-sm bg-primary/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary text-white">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-muted-foreground">We aim to make these tools straightforward to use, with clear inputs and results that are easy to interpret.</p>
          </section>

          {/* Our Approach */}
          <section className="space-y-6 bg-white p-8 md:p-12 rounded-[2.5rem] border shadow-sm">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Target className="w-6 h-6" />
              Our Approach
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We believe a useful calculator should do more than display a number. Users should be able to understand what information is required, how a result is produced and what assumptions may affect it.
              </p>
              <p>
                For that reason, we aim to provide relevant formulas, explanations, examples and limitations alongside our calculators wherever appropriate.
              </p>
              <p>
                Calculations can depend on the information entered, the formula selected, rounding methods, applicable rates and other assumptions. We encourage users to review the explanations provided on each calculator page before relying on a result.
              </p>
            </div>
          </section>

          {/* Who We Serve & Accessibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Who We Serve</h2>
              <p className="text-muted-foreground leading-relaxed">
                My Apex Calc is designed for students, educators, professionals, business owners, creators and anyone who needs help with a calculation.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our tools are intended to support learning, planning and everyday decision-making. They are not a substitute for professional financial, medical, legal, tax or other specialist advice.
              </p>
            </section>
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Free and Accessible Tools</h2>
              <p className="text-muted-foreground leading-relaxed">
                We aim to make our calculators accessible and easy to use. Our tools are available online, and users can access them without creating an account unless a particular feature states otherwise.
              </p>
            </section>
          </div>

          <Separator />

          {/* Our Commitment */}
          <section className="space-y-6 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-primary">Our Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              We are continually working to improve the clarity, usefulness and reliability of My Apex Calc. Feedback from users helps us identify errors, improve existing tools and consider new calculator ideas.
            </p>
            <p className="text-muted-foreground">
              If you have a question, notice a possible calculation error or want to suggest a feature, please visit our <Link href="/contact-us" className="text-primary font-bold hover:underline">Contact Us</Link> page.
            </p>
            <div className="pt-8">
              <p className="text-xl font-bold text-primary font-headline">My Apex Calc</p>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">Practical tools for everyday calculations.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
