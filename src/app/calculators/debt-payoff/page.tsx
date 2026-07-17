"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  CreditCard, 
  TrendingDown, 
  Info, 
  History, 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight,
  Target
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component to ensure it is picked up by SEO crawlers.
const metadata: Metadata = {
  title: 'Accurate Debt Payoff Calculator | Free Debt Payoff Planner',
  description: 'Eliminate your debt faster with our free debt payoff calculator. Plan your debt-free journey, estimate credit card payoff timelines, and compare snowball vs. avalanche payoff methods.',
  keywords: [
    'debt payoff calculator',
    'estimate credit card payoff',
    'debt payoff planner',
    'MyApexCalc',
    'get out of debt',
    'snowball vs avalanche calculator',
    'credit card payoff tracker'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Interactive Debt Payoff Calculator & Planner | MyApexCalc',
    description: 'Take control of your liabilities. Calculate your exact debt-free date, model extra payments, and build a customized debt payoff planner.',
    url: 'https://www.myapexcalc.com/calculators/debt-payoff',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/TxT1XQRL/debt-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Debt Payoff Calculator and Interactive Payment Amortization Dashboard',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free Credit Card & Loan Payoff Planner | MyApexCalc',
    description: 'Estimate your credit card payoff dates and calculate how extra monthly payments can save you thousands in interest fees.',
    images: ['https://i.ibb.co/TxT1XQRL/debt-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/debt-payoff',
  },
};

export default function DebtPayoffPage() {
  const [balance, setBalance] = useState(10000);
  const [interest, setInterest] = useState(19.99);
  const [payment, setPayment] = useState(300);
  const [months, setMonths] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    const P = balance;
    const r = interest / 100 / 12;
    const PMT = payment;

    if (P <= 0) {
      setMonths(0);
      setTotalPaid(0);
      return;
    }

    if (PMT <= P * r) {
      setMonths(-1); // Infinite debt
      return;
    }

    // Formula: n = -ln(1 - (P*r/PMT)) / ln(1+r)
    const n = -Math.log(1 - (P * r) / PMT) / Math.log(1 + r);
    setMonths(Math.ceil(n));
    setTotalPaid(Math.ceil(n) * PMT);
  }, [balance, interest, payment]);

  return (
    <CalculatorWrapper
      title="Debt Payoff Calculator"
      description="Find out how long it will take to pay off your credit card or loan and how much interest you'll save by paying more."
      icon={CreditCard}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Debt Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Current Balance ($)</Label>
              <Input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Annual Interest Rate (%)</Label>
              <Input type="number" value={interest} onChange={(e) => setInterest(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Monthly Payment ($)</Label>
              <Input type="number" value={payment} onChange={(e) => setPayment(Number(e.target.value))} />
            </div>
            {payment > 0 && payment <= (balance * (interest / 100 / 12)) && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 flex gap-3">
                <Info size={16} className="shrink-0" />
                <span>Warning: Monthly payment is too low. Debt will never be paid off because it doesn't cover the monthly interest.</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary text-white text-center py-10 shadow-xl border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest opacity-80 font-bold">Estimated Time to Pay Off</CardTitle>
            </CardHeader>
            <CardContent>
              {months === -1 ? (
                <div className="text-4xl font-black font-headline">Never (Infinite)</div>
              ) : (
                <>
                  <div className="text-7xl font-black font-headline tracking-tighter">{months}</div>
                  <p className="mt-2 text-xl font-medium opacity-80 uppercase tracking-widest">Months</p>
                  <p className="mt-6 text-sm font-bold opacity-60 bg-white/10 py-2 px-4 rounded-full inline-block border border-white/10">
                    ≈ {(months / 12).toFixed(1)} Years
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {months !== -1 && balance > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                  <TrendingDown className="w-4 h-4" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Total Amount Paid</span>
                  <span className="font-bold">${totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between border-b pb-2 text-red-500">
                  <span className="font-medium">Total Interest Paid</span>
                  <span className="font-bold">${(totalPaid - balance).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="pt-2 flex items-center gap-3 text-blue-700 bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <TrendingUp size={18} className="shrink-0" />
                  <p className="text-[10px] leading-relaxed">
                    Increasing your monthly payment by just <strong>$100</strong> could save you months of time and thousands in interest.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Informational Text Section */}
      <div className="py-10 space-y-12">
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Take Control of Your Financial Freedom with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Carrying high-interest debt can feel like swimming against a strong current. Every month, interest fees accumulate, eating up your hard-earned income and pushing your financial milestones further out of reach. Breaking free from this cycle requires more than just making minimum payments—it demands a clear, customized strategy. Our free online debt payoff calculator serves as a personalized financial roadmap, letting you map out your liabilities, track your progress, and visualize your exact path to zero debt.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              The Amortization Math: How to Estimate Credit Card Payoff Timelines
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Credit card accounts calculate interest daily based on your Average Daily Balance (ADB). Because card issuers set minimum monthly payments as a small percentage of your outstanding balance (typically 1% to 3% of the principal plus monthly interest), paying only the minimum ensures you stay in debt for decades.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                To estimate credit card payoff schedules when paying a fixed monthly amount (PMT) that exceeds the minimum requirement, our calculator uses the standard loan amortization timeline formula:
              </p>
              
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                N = - [ ln(1 - (r * PV) / PMT) ] / ln(1 + r)
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">N</span> represents the total number of months required to wipe out the debt balance.</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">PV</span> represents your current outstanding debt balance (present value).</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">PMT</span> represents your recurring monthly payment.</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">r</span> represents your monthly interest rate (your annual APR divided by 12 months).</p>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                By inputting your current card balances and interest rates, this tool determines exactly how many months you have left until your balances hit zero, showing you precisely how much money you will save by adding just a small extra amount to your monthly payments.
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <History className="w-5 h-5 text-accent" />
                Build Your Custom Strategy
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To accelerate your journey, our advanced calculator lets you model and compare the two most popular, mathematically validated debt-reduction strategies:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">The Debt Avalanche Method</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">This strategy mathematically prioritizes your debts by ordering them from the highest interest rate to the lowest. By focusing extra payments on your most expensive balances first, you minimize total accrued interest and save the maximum amount of cash over time.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">The Debt Snowball Method</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">This behavioral strategy prioritizes your debts by balance size, focusing on the smallest balances first. By wiping out smaller accounts quickly, you build psychological momentum and secure quick wins that keep you motivated over the long haul.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-6">
              <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Why Map Your Journey with MyApexCalc?
              </h4>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span><strong>Interactive Timeline Projections:</strong> Adjust your total monthly debt budget to see your exact "Debt-Free Date" pull closer in real-time.</span>
                </li>
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span><strong>Interest Savings Calculations:</strong> Discover exactly how much money you keep in your own pocket by avoiding interest fees when making extra monthly payments.</span>
                </li>
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span><strong>Secure and Private:</strong> No personal data is stored on our servers. Your financial calculations remain local to your browser session.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
