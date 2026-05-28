"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Percent } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TaxPage() {
  const [income, setIncome] = useState(75000);
  const [status, setStatus] = useState('single');
  const [tax, setTax] = useState(0);
  const [effectiveRate, setEffectiveRate] = useState(0);

  useEffect(() => {
    // Simplified US-style progressive brackets (mock)
    let totalTax = 0;
    const brackets = status === 'single' ? 
      [
        { limit: 11000, rate: 0.10 },
        { limit: 44725, rate: 0.12 },
        { limit: 95375, rate: 0.22 },
        { limit: 182100, rate: 0.24 },
        { limit: 231250, rate: 0.32 },
        { limit: 578125, rate: 0.35 },
        { limit: Infinity, rate: 0.37 },
      ] :
      [
        { limit: 22000, rate: 0.10 },
        { limit: 89450, rate: 0.12 },
        { limit: 190750, rate: 0.22 },
        { limit: 364200, rate: 0.24 },
        { limit: 462500, rate: 0.32 },
        { limit: 693750, rate: 0.35 },
        { limit: Infinity, rate: 0.37 },
      ];

    let remainingIncome = income;
    let prevLimit = 0;

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;
      const taxableInBracket = Math.min(bracket.limit - prevLimit, remainingIncome);
      totalTax += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
      prevLimit = bracket.limit;
    }

    setTax(totalTax);
    setEffectiveRate(income > 0 ? (totalTax / income) * 100 : 0);
  }, [income, status]);

  return (
    <CalculatorWrapper
      title="Tax Calculator"
      description="Estimate your progressive income tax burden based on your annual earnings and filing status."
      icon={Percent}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tax Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="income">Gross Annual Income ($)</Label>
              <Input
                id="income"
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Filing Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married Filing Jointly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest opacity-80">Estimated Federal Tax</CardTitle>
            </CardHeader>
            <CardContent className="py-6">
              <div className="text-5xl font-bold font-headline">
                ${tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-lg opacity-90 mt-2">
                {effectiveRate.toFixed(1)}% Effective Rate
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Take-home Estimate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Annual Net Income</span>
                <span className="font-bold text-green-600">${(income - tax).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Monthly Take-home</span>
                <span className="font-semibold">${((income - tax) / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <p className="text-[10px] text-muted-foreground italic mt-4">
                This is a simplified estimation using current US tax bracket percentages. It does not account for deductions, state taxes, or specific local tax laws.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorWrapper>
  );
}