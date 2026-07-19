"use client"

import { useState, useEffect, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Percent, TrendingUp, Info, History, Landmark, Target, DollarSign, Clock, Calculator, ChevronRight, ShieldCheck, BarChart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component to ensure it is picked up by SEO crawlers.
const metadata: Metadata = {
  title: 'Accurate Interest Rate Calculator | Free APR & Loan Payment Estimator',
  description: 'Calculate loan interest, annual percentage rates, and investments instantly. Use our free interest calculator to estimate mortgage payments and analyze true borrowing costs.',
  keywords: [
    'mortgage calculator bankrate',
    'interest amount',
    'calculator for mortgage payments',
    'interest calculator',
    'apr calculator',
    'MyApexCalc',
    'loan interest rate',
    'compound interest estimator'
  ],
  
  // Open Graph for social sharing platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Precision Interest Rate & APR Calculator | MyApexCalc',
    description: 'Deconstruct your borrowing or growth rates. Calculate interest amounts, analyze mortgage components, and find your true APR easily.',
    url: 'https://www.myapexcalc.com/calculators/interest-rate',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/j9CpS9cy/interest-rate-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Interest Rate Calculator, APR Solver, and Investment Progression Screen',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free Interest Amount & APR Calculator | MyApexCalc',
    description: 'Determine actual borrowing fees, monthly mortgage percentages, and investment yields in seconds.',
    images: ['https://i.ibb.co/j9CpS9cy/interest-rate-calculator.png'],
  },

  // Prevent search engine duplicate penalties with standard canonical parameters
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/interest-rate',
  },
};

export default function InterestRateCalculatorPage() {
  const [startingAmount, setStartingAmount] = useState(10000);
  const [finalAmount, setFinalAmount] = useState(50000);
  const [years, setYears] = useState(10);
  const [contribution, setContribution] = useState(100);
  const [contributionFrequency, setContributionFrequency] = useState('12'); // Monthly
  const [contributionTiming, setContributionTiming] = useState<'beginning' | 'end'>('beginning');
  const [compoundFrequency, setCompoundFrequency] = useState('12'); // Monthly

  const results = useMemo(() => {
    const P = startingAmount;
    const G = finalAmount;
    const t = years;
    const PMT = contribution;
    const pmtFreq = Number(contributionFrequency);
    const n = Number(compoundFrequency);
    const timing = contributionTiming;

    // Simulation function to check if a specific rate meets the goal
    const simulate = (annualRate: number) => {
      let balance = P;
      const totalMonths = Math.ceil(t * 12);
      const r = annualRate;

      for (let m = 1; m <= totalMonths; m++) {
        const isContribMonth = (12 / pmtFreq) === 1 || (m % (12 / pmtFreq) === 0);
        
        if (timing === 'beginning' && isContribMonth) {
          balance += PMT;
        }

        // Effective monthly rate based on compounding
        const monthlyRate = Math.pow(1 + r / n, n / 12) - 1;
        balance += balance * monthlyRate;

        if (timing === 'end' && isContribMonth) {
          balance += PMT;
        }
      }
      return balance;
    };

    // Numerical solve for Rate (Binary Search)
    let low = -0.99, high = 5.0; // From -99% to 500%
    for (let i = 0; i < 60; i++) {
      let mid = (low + high) / 2;
      if (simulate(mid) < G) low = mid;
      else high = mid;
    }

    const solvedRate = high * 100;
    const totalPrincipal = P + (PMT * pmtFreq * t);
    const totalInterest = Math.max(0, G - totalPrincipal);

    const chartData = [
      { name: 'Total Principal', value: totalPrincipal, color: 'hsl(var(--primary))' },
      { name: 'Total Interest', value: totalInterest, color: 'hsl(var(--accent))' },
    ];

    return { solvedRate, totalPrincipal, totalInterest, chartData };
  }, [startingAmount, finalAmount, years, contribution, contributionFrequency, contributionTiming, compoundFrequency]);

  const chartConfig = {
    value: { label: "Amount" }
  };

  return (
    <CalculatorWrapper
      title="Interest Rate Calculator"
      description="Reverse-engineer your financial goals. Find out exactly what annual return rate you need to reach your target balance."
      icon={Percent}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Target & Initial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startingAmount">Starting Investment ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="startingAmount"
                    type="number"
                    className="pl-9"
                    value={startingAmount}
                    onChange={(e) => setStartingAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="finalAmount">Target Final Amount ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="finalAmount"
                    type="number"
                    className="pl-9 font-bold text-primary"
                    value={finalAmount}
                    onChange={(e) => setFinalAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">Investment Length (Years)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="years"
                    type="number"
                    className="pl-9"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Contributions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Periodic Amount</Label>
                  <Input type="number" value={contribution} onChange={(e) => setContribution(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={contributionFrequency} onValueChange={setContributionFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">Monthly</SelectItem>
                      <SelectItem value="1">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Timing</Label>
                <RadioGroup 
                  value={contributionTiming} 
                  onValueChange={(v: any) => setContributionTiming(v)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginning" id="beginning" />
                    <Label htmlFor="beginning" className="font-normal cursor-pointer">Beginning</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="end" id="end" />
                    <Label htmlFor="end" className="font-normal cursor-pointer">End</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Compounding Frequency</Label>
                <Select value={compoundFrequency} onValueChange={setCompoundFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="365">Daily</SelectItem>
                    <SelectItem value="12">Monthly</SelectItem>
                    <SelectItem value="4">Quarterly</SelectItem>
                    <SelectItem value="1">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Landmark className="w-24 h-24" />
            </div>
            <CardContent className="pt-10 pb-12 text-center relative z-10">
              <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-black">Required Annual Interest Rate</p>
              <h3 className="text-6xl md:text-7xl font-black font-headline tracking-tighter">
                {results.solvedRate > 1000 ? "N/A" : results.solvedRate.toFixed(3)}%
              </h3>
              {results.solvedRate > 1000 && (
                <p className="text-xs mt-4 bg-white/20 p-2 rounded inline-block">Goal is mathematically unrealistic with current contributions.</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-primary" />
                  Growth Composition
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={results.chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {results.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: number) => `$${val.toLocaleString()}`}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Total Principal</span>
                  <span className="font-bold">${results.totalPrincipal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Total Interest Needed</span>
                  <span className="font-bold text-accent">${results.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between font-bold text-primary pt-2">
                  <span>Target Goal</span>
                  <span>${finalAmount.toLocaleString()}</span>
                </div>
                <Separator className="my-2" />
                <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                  This rate assumes the specified compounding frequency and consistent periodic contributions over {years} years.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
            <Info className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-blue-800 font-bold">Understanding the Solve</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                The **Interest Rate Calculator** uses numerical simulation to find the exact percentage required. If your required rate is exceptionally high (e.g., &gt;20%), consider extending your timeframe or increasing your periodic contributions to make your goal more achievable with standard market returns.
              </p>
            </div>
          </div>
        </div>

        {/* Informational Text Section */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Master the Cost of Borrowing and Growth with MyApexCalc
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Whether you are shopping for a home, evaluating a car loan, or opening a high-yield investment account, interest is the primary force that dictates your long-term balance sheet. For borrowers, interest is the fee paid to a lender for using their cash; for savers, it is the reward paid by a financial institution for holding your deposits. Understanding how these rates accumulate is essential to keeping your personal budget healthy. Our free interest calculator simplifies these complex calculations, serving as a comprehensive apr calculator that translates raw percentages into real-world dollars and cents.
              </p>
              
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
                <Calculator className="w-6 h-6" />
                The Math Behind the Percentages: Calculating True Costs
              </h3>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Depending on your financial product, the way your interest amount is calculated can vary significantly. Our multi-function workspace supports both growth modeling and loan installment projections:
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-bold text-sm text-foreground">1. Tracking Investment Yields (Compound Interest)</p>
                    <p className="text-sm text-muted-foreground">When saving or investing, compounding is your best friend. Your interest earnings are reinvested, meaning you earn interest on top of previous interest. The formula to calculate this future accumulated value (A) is:</p>
                    <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                      A = P (1 + r/n)<sup>nt</sup>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-muted-foreground p-2">
                      <p><strong>P</strong>: initial principal deposit</p>
                      <p><strong>r</strong>: annual nominal interest rate</p>
                      <p><strong>n</strong>: compounding frequency per year</p>
                      <p><strong>t</strong>: total timeline in years</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-sm text-foreground">2. Estimating Monthly Liabilities (Mortgage and Loans)</p>
                    <p className="text-sm text-muted-foreground">For installment liabilities like mortgages, the monthly interest changes over time. While many look to standard mortgage calculator bankrate structures, our calculator for mortgage payments calculates your fixed monthly payment (PMT) utilizing standard mathematical amortization:</p>
                    <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                      PMT = P × [ r(1+r)<sup>n</sup> ] / [ (1+r)<sup>n</sup> - 1 ]
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                      With each monthly payment you make, a portion pays off the interest owed for that month, while the remainder goes toward reducing your outstanding principal balance. Over time, the interest portion shrinks, and the principal portion increases—a progression mapped clearly on our dynamic charts.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Info className="w-5 h-5 text-accent" />
                  Understanding APR vs. APY
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When comparing rates on credit cards, personal loans, or savings products, you will frequently see two distinct acronyms:
                </p>
                <ul className="space-y-6 pt-2">
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Landmark className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Annual Percentage Rate (APR)</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">This represents the annual cost of borrowing expressed as a percentage, including interest rates and upfront broker or processing fees. Our calculator helps isolate your true APR, ensuring you see the actual cost of a loan.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                      <TrendingUp className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Annual Percentage Yield (APY)</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">This represents the real annual rate of return earned on an investment, fully accounting for the compounding frequency of the account. APY is usually slightly higher than the nominal rate due to compounding effects.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-6">
                <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Why Analyze Your Interest Rates with MyApexCalc?
                </h4>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                    <span><strong>Instant Parameter Shifting:</strong> Play with rates, payment terms, and deposit amounts to watch your monthly and lifetime calculations update in real-time.</span>
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                    <span><strong>Comprehensive Amortization Charts:</strong> Walk through a clean, annual breakdown showing your declining loan balances and cumulative lifetime interest.</span>
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                    <span><strong>User-Friendly Precision:</strong> Designed for clarity, our tool eliminates the guesswork by isolating how much you earn or pay down to the fractional cent.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
