"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { PiggyBank, Target, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

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
    </CalculatorWrapper>
  );
}
