"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

export default function MortgagePage() {
  const [principal, setPrincipal] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const p = principal;
    if (r === 0) {
      setMonthlyPayment(p / n);
      return;
    }
    const payment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setMonthlyPayment(payment);
  }, [principal, rate, years]);

  return (
    <CalculatorWrapper
      title="Mortgage Calculator"
      description="Calculate your monthly home mortgage payments and see how interest rates affect your budget."
      icon={Home}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="principal">Loan Amount</Label>
                  <span className="text-sm font-semibold text-primary">${principal.toLocaleString()}</span>
                </div>
                <Input
                  id="principal"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="rate">Interest Rate (%)</Label>
                  <span className="text-sm font-semibold text-primary">{rate}%</span>
                </div>
                <Slider
                  value={[rate]}
                  min={0.1}
                  max={15}
                  step={0.1}
                  onValueChange={(val) => setRate(val[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="years">Loan Term (Years)</Label>
                  <span className="text-sm font-semibold text-primary">{years} Years</span>
                </div>
                <Slider
                  value={[years]}
                  min={1}
                  max={40}
                  step={1}
                  onValueChange={(val) => setYears(val[0])}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Home size={120} />
            </div>
            <CardHeader>
              <CardTitle className="text-primary-foreground/80 text-sm uppercase tracking-wider font-semibold">Estimated Monthly Payment</CardTitle>
            </CardHeader>
            <CardContent className="pb-8">
              <div className="text-5xl font-bold font-headline mb-2">
                ${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <p className="text-primary-foreground/70 text-sm">Principal & Interest only</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Total Payments</span>
                <span className="font-semibold">${(monthlyPayment * years * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Total Interest</span>
                <span className="font-semibold text-accent">${((monthlyPayment * years * 12) - principal).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest Ratio</span>
                <span className="font-semibold">{Math.round((((monthlyPayment * years * 12) - principal) / (monthlyPayment * years * 12)) * 100)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorWrapper>
  );
}