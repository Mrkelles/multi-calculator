"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CompoundInterestPage() {
  const [initial, setInitial] = useState(10000);
  const [contribution, setContribution] = useState(500);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [frequency, setFrequency] = useState('12');
  const [futureValue, setFutureValue] = useState(0);

  useEffect(() => {
    const P = initial;
    const PMT = contribution;
    const r = rate / 100;
    const n = Number(frequency);
    const t = years;

    // A = P(1 + r/n)^(nt) + PMT * (((1 + r/n)^(nt) - 1) / (r/n))
    const compoundFactor = Math.pow(1 + r / n, n * t);
    const futureP = P * compoundFactor;
    const futurePMT = PMT * ((compoundFactor - 1) / (r / n));
    
    setFutureValue(futureP + (r === 0 ? PMT * n * t : futurePMT));
  }, [initial, contribution, rate, years, frequency]);

  return (
    <CalculatorWrapper
      title="Compound Interest Calculator"
      description="Visualize how your money grows over time with the magic of compound interest."
      icon={TrendingUp}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Investment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="initial">Initial Deposit</Label>
              <Input
                id="initial"
                type="number"
                value={initial}
                onChange={(e) => setInitial(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contribution">Monthly Contribution</Label>
              <Input
                id="contribution"
                type="number"
                value={contribution}
                onChange={(e) => setContribution(Number(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate">Annual Rate (%)</Label>
                <Input
                  id="rate"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years">Years to Grow</Label>
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Compounding Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Annually</SelectItem>
                  <SelectItem value="2">Semi-Annually</SelectItem>
                  <SelectItem value="4">Quarterly</SelectItem>
                  <SelectItem value="12">Monthly</SelectItem>
                  <SelectItem value="365">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary text-white">
            <CardHeader>
              <CardTitle className="text-primary-foreground/80 text-sm uppercase tracking-wider">Estimated Future Value</CardTitle>
            </CardHeader>
            <CardContent className="pb-8">
              <div className="text-5xl font-bold font-headline">
                ${futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Growth Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Total Contributions</span>
                <span className="font-semibold">${(initial + (contribution * 12 * years)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2 text-accent">
                <span className="text-muted-foreground font-medium">Total Interest Earned</span>
                <span className="font-bold">${(futureValue - (initial + (contribution * 12 * years))).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <p className="text-xs text-muted-foreground italic">
                Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorWrapper>
  );
}