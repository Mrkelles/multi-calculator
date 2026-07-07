"use client"

import { useState, useEffect, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Percent, TrendingUp, Info, History, Landmark, Target, DollarSign, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

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
                  <PieChart className="w-4 h-4 text-primary" />
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
        <div className="lg:col-span-12 space-y-12 py-10">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <History className="w-6 h-6" />
                Why Solve for Rate?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Most people start with a goal—saving for a house, retirement, or a child's education. While standard calculators tell you how much you'll have in the future, the **My Apex Interest Rate Calculator** works backward. It answers the critical question: *"What kind of risk and return do I need to look for in my investments to hit my target?"*
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Knowing the required interest rate helps you choose the right financial vehicles. For example, if you need a 2% rate, a high-yield savings account might suffice. If you need 8%, you may need to look at a diversified stock portfolio.
              </p>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Calculation Factors</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Compounding Power</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">The more frequently interest is compounded (e.g., daily), the lower the required annual rate will be to reach your goal, as your interest earns interest faster.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Contribution Timing</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Investing at the **Beginning** of a period gives your money more time to work. Over a long duration, this subtle shift can significantly lower the rate required to hit your target.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
