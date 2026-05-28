"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

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
    </CalculatorWrapper>
  );
}