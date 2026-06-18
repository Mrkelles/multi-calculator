
"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Percent, Wallet, Briefcase, Info, ArrowDownRight, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// 2024 Tax Year Data (Estimates)
const TAX_DATA = {
  single: {
    standardDeduction: 14600,
    brackets: [
      { limit: 11600, rate: 0.10 },
      { limit: 47150, rate: 0.12 },
      { limit: 100525, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243725, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
      { limit: Infinity, rate: 0.37 },
    ]
  },
  married: {
    standardDeduction: 29200,
    brackets: [
      { limit: 23200, rate: 0.10 },
      { limit: 94300, rate: 0.12 },
      { limit: 201050, rate: 0.22 },
      { limit: 383900, rate: 0.24 },
      { limit: 487450, rate: 0.32 },
      { limit: 731200, rate: 0.35 },
      { limit: Infinity, rate: 0.37 },
    ]
  },
  headOfHousehold: {
    standardDeduction: 21900,
    brackets: [
      { limit: 16550, rate: 0.10 },
      { limit: 63100, rate: 0.12 },
      { limit: 100500, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243700, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
      { limit: Infinity, rate: 0.37 },
    ]
  }
};

const FICA_RATES = {
  socialSecurity: 0.062,
  ssLimit: 168600,
  medicare: 0.0145,
};

export default function TaxPage() {
  const [income, setIncome] = useState(75000);
  const [status, setStatus] = useState('single');
  
  const [results, setResults] = useState({
    taxableIncome: 0,
    federalTax: 0,
    socialSecurityTax: 0,
    medicareTax: 0,
    totalTax: 0,
    netIncome: 0,
    effectiveRate: 0,
    marginalRate: 0,
    bracketsReached: [] as any[],
  });

  useEffect(() => {
    const config = TAX_DATA[status as keyof typeof TAX_DATA];
    const taxable = Math.max(0, income - config.standardDeduction);
    
    // Calculate Federal Progressive Tax
    let federalTax = 0;
    let prevLimit = 0;
    let marginalRate = 0;
    const bracketsReached = [];

    for (const bracket of config.brackets) {
      const taxableInBracket = Math.min(bracket.limit - prevLimit, Math.max(0, taxable - prevLimit));
      if (taxableInBracket > 0) {
        const taxForBracket = taxableInBracket * bracket.rate;
        federalTax += taxForBracket;
        marginalRate = bracket.rate;
        bracketsReached.push({
          range: `${prevLimit.toLocaleString()} - ${bracket.limit === Infinity ? '∞' : bracket.limit.toLocaleString()}`,
          rate: (bracket.rate * 100).toFixed(0) + '%',
          amount: taxForBracket
        });
      }
      prevLimit = bracket.limit;
      if (taxable <= prevLimit) break;
    }

    // FICA
    const ssTax = Math.min(income, FICA_RATES.ssLimit) * FICA_RATES.socialSecurity;
    const medTax = income * FICA_RATES.medicare;
    
    const totalTax = federalTax + ssTax + medTax;
    const net = income - totalTax;

    setResults({
      taxableIncome: taxable,
      federalTax,
      socialSecurityTax: ssTax,
      medicareTax: medTax,
      totalTax,
      netIncome: net,
      effectiveRate: income > 0 ? (totalTax / income) * 100 : 0,
      marginalRate: marginalRate * 100,
      bracketsReached,
    });
  }, [income, status]);

  return (
    <CalculatorWrapper
      title="Income Tax Calculator"
      description="Calculate your 2024 federal income tax, FICA taxes, and take-home pay based on current IRS tax brackets."
      icon={Percent}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Income Details
              </CardTitle>
              <CardDescription>Enter your gross annual earnings before deductions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="income">Gross Annual Income</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="income"
                    type="number"
                    className="pl-7"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                  />
                </div>
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
                    <SelectItem value="headOfHousehold">Head of Household</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Standard Deduction:</span>
                  <span className="font-semibold">${TAX_DATA[status as keyof typeof TAX_DATA].standardDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxable Income:</span>
                  <span className="font-bold text-primary">${results.taxableIncome.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Quick Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>Take Home ({(100 - results.effectiveRate).toFixed(1)}%)</span>
                  <span>${results.netIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <Progress value={100 - results.effectiveRate} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-destructive">
                  <span>Total Tax ({results.effectiveRate.toFixed(1)}%)</span>
                  <span>${results.totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <Progress value={results.effectiveRate} className="h-2 bg-muted [&>div]:bg-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-primary text-white border-none shadow-lg overflow-hidden">
              <CardContent className="pt-6 relative">
                <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Total Annual Tax</p>
                <h3 className="text-3xl font-bold font-headline">
                  ${results.totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </h3>
                <div className="mt-4 flex gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-none">
                    {results.effectiveRate.toFixed(1)}% Effective
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-none">
                    {results.marginalRate}% Marginal
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-600 text-white border-none shadow-lg overflow-hidden">
              <CardContent className="pt-6">
                <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Net Take-Home</p>
                <h3 className="text-3xl font-bold font-headline">
                  ${results.netIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </h3>
                <div className="mt-4 text-sm opacity-90 flex items-center gap-1">
                  <Briefcase size={14} />
                  ${(results.netIncome / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })} / Month
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Tax Liability Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Federal Income Tax</TableCell>
                    <TableCell className="text-right font-mono">${results.federalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Social Security (FICA)</TableCell>
                    <TableCell className="text-right font-mono">${results.socialSecurityTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Medicare (FICA)</TableCell>
                    <TableCell className="text-right font-mono">${results.medicareTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/30">
                    <TableCell className="font-bold">Total Estimated Tax</TableCell>
                    <TableCell className="text-right font-bold font-mono text-destructive">
                      -${results.totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Progressive Brackets Applied</CardTitle>
              <CardDescription>See how much of your income fell into each federal tax bracket.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.bracketsReached.map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{b.rate}</span>
                        <span className="text-muted-foreground text-xs">Bracket</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">on income between ${b.range}</p>
                    </div>
                    <span className="font-mono font-medium">${b.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs text-blue-800 leading-relaxed font-semibold">
                Marginal vs. Effective Rate
              </p>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Your <strong>Marginal Rate</strong> ({results.marginalRate}%) is the tax on the last dollar you earned. Your <strong>Effective Rate</strong> ({results.effectiveRate.toFixed(1)}%) is the actual percentage of your total income that goes to the IRS after all progressive brackets and deductions are applied.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
