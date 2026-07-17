"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { PiggyBank, Target, TrendingUp, Calculator, Info, History, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component to ensure it is picked up by SEO crawlers.
const metadata: Metadata = {
  title: 'Accurate Savings Calculator | Free Savings Estimator',
  description: 'Track your financial goals with our free savings calculator. Estimate retirement savings, project compound interest growth, and map out your path to financial freedom.',
  keywords: [
    'Savings calculator',
    'Estimate retirement savings',
    'savings estimator',
    'simple savings calculator',
    'MyApexCalc',
    'high-yield savings tracker',
    'wealth projection tool'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Interactive Savings Calculator & Estimator | MyApexCalc',
    description: 'Watch your money grow. Calculate future balances, adjust contribution schedules, and visualize your compound growth curve in real-time.',
    url: 'https://www.myapexcalc.com/calculators/savings',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/pBFG2MTD/savings-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Savings Calculator and Goal Setting Dashboard',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free Savings Estimator & Compound Tracker | MyApexCalc',
    description: 'Calculate your future net worth and map out custom savings plans using our intuitive online dashboard.',
    images: ['https://i.ibb.co/pBFG2MTD/savings-calculator.png'],
  },

  // Standardize search signals to avoid indexing issues
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/savings',
  },
};

export default function SavingsGoalPage() {
  const [goal, setGoal] = useState(50000);
  const [current, setCurrent] = useState(5000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(4);
  const [requiredMonthly, setRequiredMonthly] = useState(0);

  useEffect(() => {
    const P = current;
    const G = goal;
    const t = years;
    const r = rate / 100 / 12;
    const n = t * 12;

    if (G <= P) {
      setRequiredMonthly(0);
      return;
    }

    // Formula for required monthly contribution PMT:
    // G = P(1+r)^n + PMT * [((1+r)^n - 1) / r]
    // PMT = (G - P(1+r)^n) / [((1+r)^n - 1) / r]
    
    if (r === 0) {
      setRequiredMonthly((G - P) / n);
      return;
    }

    const futureP = P * Math.pow(1 + r, n);
    const denominator = (Math.pow(1 + r, n) - 1) / r;
    const pmt = (G - futureP) / denominator;
    
    setRequiredMonthly(Math.max(0, pmt));
  }, [goal, current, years, rate]);

  return (
    <CalculatorWrapper
      title="Savings Goal Calculator"
      description="Work backwards from a target amount to find out exactly how much you need to save each month."
      icon={PiggyBank}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Goal Setup</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Target Savings Goal ($)</Label>
              <Input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Initial Balance ($)</Label>
              <Input type="number" value={current} onChange={(e) => setCurrent(Number(e.target.value))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Timeframe (Years)</Label>
                <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Annual APY (%)</Label>
                <Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary text-white text-center py-12">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest opacity-80">Required Monthly Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-bold font-headline">
                ${requiredMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <p className="mt-4 text-sm opacity-70">to reach your goal in {years} years.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Summary</CardTitle></CardHeader>
            <CardContent className="text-xs space-y-3">
              <div className="flex justify-between border-b pb-2 text-muted-foreground">
                <span>Total Contributions</span>
                <span className="font-bold text-foreground">${(requiredMonthly * 12 * years).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between border-b pb-2 text-muted-foreground">
                <span>Total Interest Earned</span>
                <span className="font-bold text-accent">${(goal - (requiredMonthly * 12 * years) - current).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Informational Text Section */}
      <div className="py-10 space-y-12">
        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Build Your Financial Runway with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Whether you are tucking away cash for an emergency fund, planning a down payment on a house, preparing for a dream vacation, or trying to estimate retirement savings, building a consistent savings habit is the cornerstone of personal finance. Yet, planning your financial runway on a raw spreadsheet can quickly get complicated. Our free, intuitive savings calculator is designed to take the guesswork out of wealth building, serving as a powerful, live savings estimator that maps your progress in real-time.
            </p>

            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              How Your Savings Grow: The Compound Effect
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                The secret to accumulating a substantial cash reserve is compound interest—the process where your interest earns interest, accelerating your balance over time. When you make routine deposits, our simple savings calculator processes your timeline by modeling the future value of a progressive monthly annuity:
              </p>
              
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                Future Value = P (1 + r/n)<sup>nt</sup> + PMT × [ ((1 + r/n)<sup>nt</sup> - 1) / (r/n) ]
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">P</span> represents your initial deposit (starting principal).</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">PMT</span> represents your recurring monthly contribution.</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">r</span> represents your annual interest rate (e.g., your High-Yield Savings Account APY).</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">n</span> represents the compounding frequency per year (usually 12 for monthly compounding).</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">t</span> represents the total number of years you plan to save.</p>
              </div>

              <p className="text-muted-foreground leading-relaxed pt-2">
                By consistently contributing to your account, the secondary part of this formula begins to drive the majority of your growth. Over a multi-year horizon, your total earnings will heavily outweigh your physical contributions, building a secure financial buffer.
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Map Your Wealth Goals with MyApexCalc?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                While basic bank tools only calculate flat interest rates, MyApexCalc gives you a dynamic financial dashboard:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Custom Contribution Intervals</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Toggle between weekly, bi-weekly, monthly, or annual deposits to align perfectly with your paycheck schedule.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">APY Performance Comparison</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Compare how your money will grow in a traditional brick-and-mortar savings account (0.01%) versus a modern HYSA (4.0%+).</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Milestone Analytics Table</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Instantly review a year-by-year breakdown displaying your cumulative principal deposits and interest milestones.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <History className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "Savings are the seeds of your future freedom. Plant them consistently, and time will grow them into a forest."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
