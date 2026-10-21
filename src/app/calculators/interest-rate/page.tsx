"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Percent, 
  TrendingUp, 
  Info, 
  History, 
  Landmark, 
  Target, 
  DollarSign, 
  Clock, 
  Calculator, 
  ChevronRight, 
  ShieldCheck, 
  PieChart as PieChartIcon,
  Lightbulb
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import type { Metadata } from 'next';

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
  twitter: {
    card: 'summary_large_image',
    title: 'Free Interest Amount & APR Calculator | MyApexCalc',
    description: 'Determine actual borrowing fees, monthly mortgage percentages, and investment yields in seconds.',
    images: ['https://i.ibb.co/j9CpS9cy/interest-rate-calculator.png'],
  },
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/interest-rate',
  },
};

export default function InterestRateCalculatorPage() {
  const [startingAmount, setStartingAmount] = useState(10000);
  const [finalAmount, setFinalAmount] = useState(50000);
  const [years, setYears] = useState(10);
  const [contribution, setContribution] = useState(100);
  const [contributionFrequency, setContributionFrequency] = useState('12'); 
  const [contributionTiming, setContributionTiming] = useState<'beginning' | 'end'>('beginning');
  const [compoundFrequency, setCompoundFrequency] = useState('12'); 

  const results = useMemo(() => {
    const P = startingAmount;
    const G = finalAmount;
    const t = years;
    const PMT = contribution;
    const pmtFreq = Number(contributionFrequency);
    const n = Number(compoundFrequency);
    const timing = contributionTiming;

    const simulate = (annualRate: number) => {
      let balance = P;
      const totalMonths = Math.ceil(t * 12);
      const r = annualRate;

      for (let m = 1; m <= totalMonths; m++) {
        const isContribMonth = (12 / pmtFreq) === 1 || (m % (12 / pmtFreq) === 0);
        
        if (timing === 'beginning' && isContribMonth) {
          balance += PMT;
        }

        const monthlyRate = Math.pow(1 + r / n, n / 12) - 1;
        balance += balance * monthlyRate;

        if (timing === 'end' && isContribMonth) {
          balance += PMT;
        }
      }
      return balance;
    };

    let low = -0.99, high = 5.0; 
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

  return (
    <CalculatorWrapper
      title="Interest Rate Calculator"
      description="Reverse-engineer your financial goals. Find out exactly what annual return rate you need to reach your target balance."
      icon={Percent}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
              </CardContent>
            </Card>
          </div>

          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-3">
            <h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Info size={16} /> Disclaimer
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              The interest rate shown is a mathematical estimate of the rate required to reach your specified financial target under the assumptions entered. The actual rate available on a loan, savings account, or investment may differ. Fees, taxes, market conditions, changing contributions, and differences in compounding can affect the final outcome. A calculated required return is not a guarantee that such a return is achievable or available. Use the result as a planning reference rather than personalized financial advice.
            </p>
          </div>
        </div>

        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          <section className="space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-xl text-accent"><Lightbulb size={24} /></div>
              <h3 className="text-2xl font-bold text-primary">Worked Examples</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-lg">Scenario 1: Planning for a Million</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>A 25-year-old starts with <strong>$20,000</strong> and wants to hit <strong>$1,000,000</strong> by age 55 (30 years) with a <strong>$500 monthly contribution</strong>.</p>
                  <p>The calculator determines they need an annual return rate of <strong>8.34%</strong>.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-lg">Scenario 2: Down Payment Goal</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>A couple needs <strong>$80,000</strong> for a house down payment in <strong>5 years</strong>. They already have <strong>$30,000</strong> saved and can add <strong>$600 per month</strong>.</p>
                  <p>The tool reveals they only need a <strong>3.95% return rate</strong>.</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
