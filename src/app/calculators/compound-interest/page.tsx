"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { TrendingUp, History, Info, Calculator, ChevronRight, Lightbulb } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator | Exponential Wealth Growth',
  description: 'Visualize the power of compounding. Calculate future investment value with monthly contributions and custom compounding frequencies.',
  keywords: ['compound interest calculator', 'investment growth', 'future value estimator', 'wealth building tool', 'APY calculator'],
};

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
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Informational Text Section */}
      <div className="py-10 space-y-12">
        <Separator />

        {/* Worked Examples Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl text-accent"><Lightbulb size={24} /></div>
            <h3 className="text-2xl font-bold text-primary">Worked Examples</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Scenario 1: Retirement Savings Growth</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>An investor starts with <strong>$10,000</strong> and contributes <strong>$500 per month</strong> for 30 years. At a <strong>7% return rate</strong>, their final balance would be <strong>$686,110</strong>.</p>
                <p>By increasing that return rate to <strong>10%</strong>, the final balance balloons to <strong>$1,260,344</strong>—demonstrating how even small differences in percentage yield massive changes over long horizons.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Scenario 2: The Power of Initial Capital</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Comparing two investors saving for 20 years at 8%. Investor A starts with <strong>$1,000</strong>; Investor B starts with <strong>$10,000</strong>. Both contribute $200/mo.</p>
                <p>Investor A ends with <strong>$118,525</strong>. Investor B ends with <strong>$160,568</strong>. That extra $9,000 initial seed results in over <strong>$42,000 additional dollars</strong> after 20 years of compounding.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Build Generational Wealth with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Albert Einstein famously referred to compound interest as the eighth wonder of the world—stating that those who understand it, earn it, and those who don't, pay it. Whether you are setting money aside for retirement, building an emergency fund, or tracking a stock portfolio, watching your money work for you over time is the ultimate key to financial freedom. Our free, interactive compound interest calculator helps you project, visualize, and map out your long-term wealth growth in seconds.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              The Math Behind the Magic: The Compound Interest Formula
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Unlike simple interest, which only calculates returns on your initial deposit, a composite interest calculation factors in the interest you have already accumulated. This means your interest earns interest, creating an accelerating curve of exponential growth.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                To determine the future value (A) of your investment, our tool processes your parameters using the standard compound interest formula:
              </p>
              
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                A = P(1 + r/n)^(nt)
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">P</span> represents your principal (the starting amount you deposit).</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">r</span> represents your annual nominal interest rate (as a decimal).</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">n</span> represents the compounding frequency per year (e.g., 12 for monthly, 4 for quarterly, or 1 for annually).</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">t</span> represents the total number of years the money is left to grow.</p>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                By automating this calculation, our platform allows you to layer in routine monthly contributions alongside your compounding cycle, giving you an exact projection of your future savings balance.
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Map Your Growth with MyApexCalc?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                While calculating standard savings rate changes on paper can get incredibly complicated, MyApexCalc is built to give you visual clarity instantly. Our tool offers:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Custom Compounding Frequencies</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Easily compare how your money grows when compounding daily, monthly, quarterly, or annually.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Flexible Monthly Deposits</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Add ongoing monthly contributions to see how even small, consistent deposits dramatically accelerate your timeline.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Interactive Breakdown Tables</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Access annual milestone reports detailing your exact principal, accumulated interest, and total balance year by year.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <Calculator className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "Small contributions made early are worth far more than large contributions made late. Start your compounding journey today."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
