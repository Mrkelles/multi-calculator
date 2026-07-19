"use client"

import { useState, useEffect, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  TrendingUp, 
  Table as TableIcon, 
  Info, 
  DollarSign, 
  Clock, 
  Calendar,
  History,
  Zap,
  Target,
  Calculator,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component.
const metadata: Metadata = {
  title: 'Accurate Investment Calculator | Free Investment Growth Calculator',
  description: 'Project your portfolio growth with our free investment calculator. Model compound interest, recurring contributions, and estimate investment growth over time.',
  keywords: [
    'Investment Calculator',
    'Investment Estimator',
    'Investment Growth Calculator',
    'MyApexCalc',
    'compound interest calculator',
    'portfolio growth estimator',
    'financial projection tool'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Interactive Investment Calculator & Growth Estimator | MyApexCalc',
    description: 'Visualize your path to financial freedom. Calculate future portfolio values, compare return rates, and track compound growth in real-time.',
    url: 'https://www.myapexcalc.com/calculators/investment',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/9H0bRpTQ/investment-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Investment Calculator Compound Growth Chart and Inputs',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free Investment Growth Calculator & Estimator | MyApexCalc',
    description: 'Map your long-term wealth goals. Adjust annual returns, initial principal, and regular contributions to see your portfolio grow.',
    images: ['https://i.ibb.co/9H0bRpTQ/investment-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent duplicate index penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/investment',
  },
};

type CalcMode = 'end-amount' | 'contribution' | 'return-rate' | 'starting-amount' | 'length';

export default function InvestmentCalculatorPage() {
  const [mode, setMode] = useState<CalcMode>('end-amount');

  // Inputs
  const [startingAmount, setStartingAmount] = useState(25000);
  const [targetAmount, setTargetAmount] = useState(100000);
  const [years, setYears] = useState(10);
  const [returnRate, setReturnRate] = useState(7);
  const [contribution, setContribution] = useState(500);
  const [compoundFrequency, setCompoundFrequency] = useState('12');
  const [contributionFrequency, setContributionFrequency] = useState('12');
  const [contributionTiming, setContributionTiming] = useState<'beginning' | 'end'>('beginning');

  const results = useMemo(() => {
    const P = startingAmount;
    const t = years;
    const r = returnRate / 100;
    const n = Number(compoundFrequency);
    const pmtFreq = Number(contributionFrequency);
    const timing = contributionTiming;
    const G = targetAmount;

    let solvedValue = 0;
    let finalP = P;
    let finalYears = t;
    let finalRate = r;
    let finalContribution = contribution;

    // Simulation logic to calculate future value
    const simulate = (p: number, yrs: number, rate: number, contrib: number) => {
      let balance = p;
      let totalContrib = p;
      const monthlyData = [];
      const totalMonths = Math.ceil(yrs * 12);
      
      for (let m = 1; m <= totalMonths; m++) {
        const isContribMonth = (12 / pmtFreq) === 1 || (m % (12 / pmtFreq) === 0);
        
        if (timing === 'beginning' && isContribMonth) {
          balance += contrib;
          totalContrib += contrib;
        }

        const monthlyRate = Math.pow(1 + rate / n, n / 12) - 1;
        const interest = balance * monthlyRate;
        balance += interest;

        if (timing === 'end' && isContribMonth) {
          balance += contrib;
          totalContrib += contrib;
        }

        monthlyData.push({ period: m, balance, totalContrib });
      }
      return { balance, totalContrib, monthlyData };
    };

    if (mode === 'end-amount') {
      const sim = simulate(P, t, r, contribution);
      solvedValue = sim.balance;
    } else if (mode === 'starting-amount') {
      let low = 0, high = G * 2;
      for (let i = 0; i < 40; i++) {
        let mid = (low + high) / 2;
        if (simulate(mid, t, r, contribution).balance < G) low = mid;
        else high = mid;
      }
      solvedValue = high;
      finalP = solvedValue;
    } else if (mode === 'contribution') {
      let low = 0, high = G;
      for (let i = 0; i < 40; i++) {
        let mid = (low + high) / 2;
        if (simulate(P, t, r, mid).balance < G) low = mid;
        else high = mid;
      }
      solvedValue = high;
      finalContribution = solvedValue;
    } else if (mode === 'return-rate') {
      let low = 0, high = 1; // 0% to 100%
      for (let i = 0; i < 40; i++) {
        let mid = (low + high) / 2;
        if (simulate(P, t, mid, contribution).balance < G) low = mid;
        else high = mid;
      }
      solvedValue = high * 100;
      finalRate = high;
    } else if (mode === 'length') {
      let low = 0, high = 100; // 0 to 100 years
      for (let i = 0; i < 40; i++) {
        let mid = (low + high) / 2;
        if (simulate(P, mid, r, contribution).balance < G) low = mid;
        else high = mid;
      }
      solvedValue = high;
      finalYears = solvedValue;
    }

    // Final Schedules based on solved parameters
    const finalSim = simulate(finalP, finalYears, finalRate, finalContribution);
    const yearlySchedule = [];
    const monthlySchedule = [];

    finalSim.monthlyData.forEach((item, idx) => {
      if ((idx + 1) % 12 === 0 || (idx + 1) === finalSim.monthlyData.length) {
        yearlySchedule.push({
          period: Math.ceil((idx + 1) / 12),
          balance: item.balance,
          interest: item.balance - item.totalContrib,
          totalPrincipal: item.totalContrib
        });
      }
      if (idx < 120) { // Limit monthly to first 10 years for performance
        monthlySchedule.push({
          period: idx + 1,
          balance: item.balance,
          interest: item.balance - item.totalContrib,
          totalPrincipal: item.totalContrib
        });
      }
    });

    return { 
      solvedValue, 
      finalBalance: finalSim.balance, 
      totalPrincipal: finalSim.totalContrib, 
      totalInterest: finalSim.balance - finalSim.totalContrib,
      yearlySchedule,
      monthlySchedule
    };
  }, [mode, startingAmount, targetAmount, years, returnRate, contribution, compoundFrequency, contributionFrequency, contributionTiming]);

  return (
    <CalculatorWrapper
      title="Investment Calculator"
      description="Advanced financial modeling to determine target end amounts, required contributions, or timeframes needed to hit your goals."
      icon={TrendingUp}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
                <TabsList className="grid grid-cols-3 md:grid-cols-5 h-auto py-1 px-1">
                  <TabsTrigger value="end-amount" className="text-[10px] md:text-xs">End Amt</TabsTrigger>
                  <TabsTrigger value="contribution" className="text-[10px] md:text-xs">Contrib</TabsTrigger>
                  <TabsTrigger value="return-rate" className="text-[10px] md:text-xs">Rate</TabsTrigger>
                  <TabsTrigger value="starting-amount" className="text-[10px] md:text-xs">Start</TabsTrigger>
                  <TabsTrigger value="length" className="text-[10px] md:text-xs">Years</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 mb-2">
                <p className="text-[10px] uppercase font-black text-primary tracking-widest flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> Solving For: {mode.replace('-', ' ')}
                </p>
              </div>

              {mode !== 'starting-amount' && (
                <div className="space-y-2">
                  <Label>Starting Amount ($)</Label>
                  <Input type="number" value={startingAmount} onChange={(e) => setStartingAmount(Number(e.target.value))} />
                </div>
              )}

              {mode !== 'end-amount' && (
                <div className="space-y-2">
                  <Label>Target End Amount ($)</Label>
                  <Input type="number" value={targetAmount} onChange={(e) => setTargetAmount(Number(e.target.value))} />
                </div>
              )}

              {mode !== 'length' && (
                <div className="space-y-2">
                  <Label>Investment Length (Years)</Label>
                  <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
                </div>
              )}

              {mode !== 'return-rate' && (
                <div className="space-y-2">
                  <Label>Expected Return Rate (%)</Label>
                  <Input type="number" step="0.1" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
                </div>
              )}

              {mode !== 'contribution' && (
                <div className="space-y-2">
                  <Label>Periodic Contribution ($)</Label>
                  <Input type="number" value={contribution} onChange={(e) => setContribution(Number(e.target.value))} />
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Compounding</Label>
                  <Select value={compoundFrequency} onValueChange={setCompoundFrequency}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="365">Daily</SelectItem>
                      <SelectItem value="12">Monthly</SelectItem>
                      <SelectItem value="4">Quarterly</SelectItem>
                      <SelectItem value="2">Semiannually</SelectItem>
                      <SelectItem value="1">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Contribution Freq</Label>
                  <Select value={contributionFrequency} onValueChange={setContributionFrequency}>
                    <SelectTrigger className="h-9 text-xs">
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
                <Label className="text-xs flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Contribution Timing
                </Label>
                <RadioGroup 
                  value={contributionTiming} 
                  onValueChange={(v: any) => setContributionTiming(v)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginning" id="beginning" />
                    <Label htmlFor="beginning" className="text-xs cursor-pointer">Beginning</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="end" id="end" />
                    <Label htmlFor="end" className="text-xs cursor-pointer">End</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl">
            <CardContent className="pt-10 pb-10 text-center">
              <p className="text-xs uppercase tracking-widest opacity-70 mb-2 font-bold">
                {mode === 'end-amount' ? 'Projected End Balance' : 
                 mode === 'contribution' ? 'Required Contribution' :
                 mode === 'return-rate' ? 'Required Return Rate' :
                 mode === 'starting-amount' ? 'Required Starting Principal' :
                 'Required Investment Time'}
              </p>
              <h3 className="text-5xl md:text-6xl font-black font-headline tracking-tighter">
                {mode === 'return-rate' ? 
                  `${results.solvedValue.toFixed(2)}%` : 
                  mode === 'length' ? 
                  `${results.solvedValue.toFixed(1)} Years` :
                  `$${results.solvedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                }
              </h3>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs uppercase text-muted-foreground font-bold">Total Principal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${results.totalPrincipal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs uppercase text-accent font-bold">Total Interest</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">${results.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-primary" />
                Accumulation Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="yearly">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="yearly">Yearly Breakdown</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
                </TabsList>
                
                <TabsContent value="yearly">
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>Year</TableHead>
                          <TableHead>Principal</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.yearlySchedule.map((row) => (
                          <TableRow key={row.period}>
                            <TableCell className="font-medium">{row.period}</TableCell>
                            <TableCell className="text-xs">${row.totalPrincipal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                            <TableCell className="text-xs">${row.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                            <TableCell className="text-right font-bold text-xs">${row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="monthly">
                  <div className="rounded-md border overflow-hidden max-h-[400px] overflow-y-auto">
                    <Table>
                      <TableHeader className="bg-muted/50 sticky top-0 z-10">
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Principal</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.monthlySchedule.map((row) => (
                          <TableRow key={row.period}>
                            <TableCell className="font-medium">{row.period}</TableCell>
                            <TableCell className="text-xs">${row.totalPrincipal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                            <TableCell className="text-xs">${row.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                            <TableCell className="text-right font-bold text-xs">${row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Informational Text Section */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Map Your Path to Wealth and Financial Freedom with MyApexCalc
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Building long-term wealth is rarely about finding a single, overnight windfall. Instead, the most reliable path to financial independence relies on a proven mathematical force: consistency and compound growth over time. Whether you are building a retirement nest egg, saving for a major milestone, or investing in a diversified index fund, understanding how your money multiplies is essential. Our free, interactive Investment Calculator is engineered to serve as your personal Investment Estimator, showing you exactly how small, regular contributions build life-changing momentum.
              </p>
              
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
                <Calculator className="w-6 h-6" />
                The Power of Compounding: How Your Wealth Multiplies
              </h3>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Compound interest is often described as a snowball rolling down a hill; as it moves, it gathers more snow, growing larger at an accelerating pace. When you invest, your principal earns returns, and those returns are reinvested to earn even more.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  To model this, our Investment Growth Calculator processes your timeline by calculating the future value of your initial principal combined with your recurring monthly contributions:
                </p>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                  Future Value = P(1 + r)ⁿ + PMT × [ ((1 + r)ⁿ - 1) / r ]
                </div>
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">P</span> represents your starting investment (initial principal).</p>
                  <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">PMT</span> represents your recurring monthly contribution amount.</p>
                  <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">r</span> represents your expected periodic rate of return.</p>
                  <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">n</span> represents the total number of compounding periods over your investment horizon.</p>
                </div>
                <p className="text-muted-foreground leading-relaxed pt-2">
                  Over short horizons, your total balance is heavily dictated by the physical cash you deposit (PMT). However, over a 10, 20, or 30-year window, the compounding growth curve takes over, turning your earned returns into the primary driver of your portfolio's value.
                </p>
              </div>
            </section>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Info className="w-5 h-5 text-accent" />
                  Key Factors to Maximize Your Portfolio Growth
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When adjusting the parameters on our interactive dashboard, keep these essential investment principles in mind:
                </p>
                <ul className="space-y-6 pt-2">
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">The Advantage of Starting Early</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Thanks to compounding, a person who starts investing a modest amount in their twenties can end up with a significantly larger portfolio than someone who contributes double starting in their late thirties.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                      <ChevronRight className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Consistency Beats Timing</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Setting up automated, recurring monthly contributions (known as dollar-cost averaging) helps you build wealth steadily in all market conditions.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Accounting for Inflation</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Inflation gradually erodes purchasing power. Use a conservative real return rate (e.g., 7% instead of 10%) to see your future wealth in today's dollars.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-6">
                <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Why Project Your Wealth with MyApexCalc?
                </h4>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                    <span><strong>Dynamic Real-Time Projections:</strong> Instantly slide your initial principal and monthly contributions to watch your trajectory recalculate as you type.</span>
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                    <span><strong>Detailed Breakdown Tables:</strong> Access a yearly breakdown highlighting your cumulative contributions, total interest, and ending balances.</span>
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                    <span><strong>Multi-Variable Solving:</strong> Solve for any variable—end amount, required contributions, return rate, or length of time.</span>
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
