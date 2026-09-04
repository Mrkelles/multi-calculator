"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Briefcase, TrendingUp, History, Info, ChevronRight, Lightbulb } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

export default function RetirementPage() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(65);
  const [savings, setSavings] = useState(50000);
  const [contribution, setContribution] = useState(1000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [result, setResult] = useState(0);

  useEffect(() => {
    const years = Math.max(0, retireAge - currentAge);
    const r = expectedReturn / 100 / 12;
    const n = years * 12;
    
    // Future Value of single deposit + future value of series
    const fvSavings = savings * Math.pow(1 + r, n);
    const fvContributions = contribution * ((Math.pow(1 + r, n) - 1) / r);
    
    setResult(fvSavings + (r === 0 ? contribution * n : fvContributions));
  }, [currentAge, retireAge, savings, contribution, expectedReturn]);

  return (
    <CalculatorWrapper
      title="Retirement Planner"
      description="Calculate how much you'll have saved for retirement based on your current savings and future plans."
      icon={Briefcase}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Age</Label>
                <Input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Retirement Age</Label>
                <Input type="number" value={retireAge} onChange={(e) => setRetireAge(Number(e.target.value))} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Current Savings Balance ($)</Label>
              <Input type="number" value={savings} onChange={(e) => setSavings(Number(e.target.value))} />
            </div>

            <div className="space-y-2">
              <Label>Monthly Contribution ($)</Label>
              <Input type="number" value={contribution} onChange={(e) => setContribution(Number(e.target.value))} />
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <Label>Expected Annual Return (%)</Label>
                <span className="font-bold text-primary">{expectedReturn}%</span>
              </div>
              <Slider 
                value={[expectedReturn]} 
                min={1} 
                max={15} 
                step={0.5} 
                onValueChange={(val) => setExpectedReturn(val[0])} 
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary text-white py-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest opacity-80 text-center">Projected Retirement Nest Egg</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold font-headline">
                ${result.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <p className="mt-4 text-primary-foreground/70">at age {retireAge}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Monthly Income Estimate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Safe Withdrawal (4%)</span>
                <span className="font-bold text-accent">${((result * 0.04) / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The "4% Rule" suggests you can safely withdraw 4% of your nest egg annually for a 30-year retirement.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Informational Text Section */}
      <div className="py-10 space-y-12">
        <Separator />

        {/* Worked Examples Section */}
        <section className="space-y-6 text-left">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl text-accent"><Lightbulb size={24} /></div>
            <h3 className="text-2xl font-bold text-primary">Worked Examples</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Scenario 1: Early Saver Momentum</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>A <strong>25-year-old</strong> starting with <strong>$10,000</strong> and saving <strong>$500 per month</strong> at a <strong>7% return</strong> until age 65.</p>
                <p>The calculator reveals a projected nest egg of <strong>$1,313,222</strong>. This reveals that their total physical contributions were only $240,000, while compound interest provided over $1M in growth.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Scenario 2: Catch-Up Strategy</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>A <strong>45-year-old</strong> starting with <strong>$100,000</strong> but needing <strong>$1,000,000</strong> by age 65 (20 years). They assume an <strong>8% return</strong>.</p>
                <p>The tool shows that with a <strong>$1,500 monthly contribution</strong>, they will reach <strong>$1,353,000</strong>. This helps them realize they could potentially retire earlier or lower their monthly savings if they hit their million-dollar target sooner.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Secure Your Financial Future with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Planning for retirement is one of the most vital long-term financial commitments you will ever make. The difference between an average retirement and a comfortable, stress-free lifestyle comes down to one powerful concept: starting early to let time do the heavy lifting. Our free, intuitive retirement planner acts as a personal roadmap, helping you estimate the size of your future nest egg, set realistic savings milestones, and see exactly how your portfolio can grow before you stop working.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <History className="w-6 h-6" />
              How Compound Interest Powers Your Retirement
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                To understand how a retirement fund accumulates, it is helpful to look at it through the lens of a compound interest calculator. Your savings do not grow in a straight, simple line. Instead, they leverage the math of compound interest—where the returns you earn on your investments are reinvested to earn even more returns in subsequent years.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                When running a composite interest calculation for retirement, your projected nest egg is built on a variation of the standard compound interest formula:
              </p>
              
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                A = P(1 + r/n)^(nt) + PMT × [ ((1 + r/n)^(nt) - 1) / (r/n) ]
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">P</span> represents your current retirement savings balance (starting principal).</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">PMT</span> is your recurring contribution amount (monthly or annual savings).</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">r</span> is your expected annual rate of return (interest rate).</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">n</span> is the compounding frequency per year.</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">t</span> is the number of years left until your target retirement age.</p>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                Over a 30-to-40-year career, this exponential formula means that the interest earned toward the end of your timeline will dwarf your actual physical contributions, forming the vast majority of your final retirement balance.
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Plan Your Retirement with MyApexCalc?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                While the math behind multi-decade financial modeling is complex, our platform presents your retirement trajectory in a clean, visual format. With MyApexCalc, you can easily:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Simulate Market Scenarios</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Adjust your expected annual rate of return to see how different investment portfolios (conservative, moderate, or aggressive) affect your final nest egg.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Optimize Contributions</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Test how small, incremental increases to your monthly savings rate today can yield hundreds of thousands of additional dollars by the time you retire.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Visualize Long-Term Growth</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Get a clear picture of your capital accumulation over 10, 20, or 30+ years, allowing you to establish a concrete target retirement number.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <Briefcase className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "The best time to plant a tree was 20 years ago. The second best time is now. Start your retirement planning today."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
