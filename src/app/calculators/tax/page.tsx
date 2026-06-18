
"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Percent, Wallet, Briefcase, Info, TrendingUp, Landmark, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// 2024 Tax Year Data (Official IRS Brackets)
const TAX_DATA = {
  single: {
    standardDeduction: 14600,
    brackets: [
      { min: 0, limit: 11600, rate: 0.10 },
      { min: 11600, limit: 47150, rate: 0.12 },
      { min: 47150, limit: 100525, rate: 0.22 },
      { min: 100525, limit: 191950, rate: 0.24 },
      { min: 191950, limit: 243725, rate: 0.32 },
      { min: 243725, limit: 609350, rate: 0.35 },
      { min: 609350, limit: Infinity, rate: 0.37 },
    ]
  },
  married: {
    standardDeduction: 29200,
    brackets: [
      { min: 0, limit: 23200, rate: 0.10 },
      { min: 23200, limit: 94300, rate: 0.12 },
      { min: 94300, limit: 201050, rate: 0.22 },
      { min: 201050, limit: 383900, rate: 0.24 },
      { min: 383900, limit: 487450, rate: 0.32 },
      { min: 487450, limit: 731200, rate: 0.35 },
      { min: 731200, limit: Infinity, rate: 0.37 },
    ]
  },
  headOfHousehold: {
    standardDeduction: 21900,
    brackets: [
      { min: 0, limit: 16550, rate: 0.10 },
      { min: 16550, limit: 63100, rate: 0.12 },
      { min: 63100, limit: 100500, rate: 0.22 },
      { min: 100500, limit: 191950, rate: 0.24 },
      { min: 191950, limit: 243700, rate: 0.32 },
      { min: 243700, limit: 609350, rate: 0.35 },
      { min: 609350, limit: Infinity, rate: 0.37 },
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
  const [deductionType, setDeductionType] = useState('standard');
  const [itemizedAmount, setItemizedAmount] = useState(0);
  
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
    totalDeductions: 0,
  });

  useEffect(() => {
    const config = TAX_DATA[status as keyof typeof TAX_DATA];
    const deductionValue = deductionType === 'standard' ? config.standardDeduction : itemizedAmount;
    const taxable = Math.max(0, income - deductionValue);
    
    // Calculate Federal Progressive Tax
    let federalTax = 0;
    let marginalRate = 0;
    const bracketsReached = [];

    for (const bracket of config.brackets) {
      if (taxable > bracket.min) {
        const taxableInBracket = Math.min(taxable, bracket.limit) - bracket.min;
        const taxForBracket = taxableInBracket * bracket.rate;
        federalTax += taxForBracket;
        marginalRate = bracket.rate;
        
        bracketsReached.push({
          range: `$${bracket.min.toLocaleString()} - ${bracket.limit === Infinity ? '∞' : '$' + bracket.limit.toLocaleString()}`,
          rate: (bracket.rate * 100).toFixed(0) + '%',
          amount: taxForBracket,
          taxableInBracket
        });
      }
    }

    // FICA (Note: These are on gross income, not taxable income)
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
      totalDeductions: deductionValue,
    });
  }, [income, status, deductionType, itemizedAmount]);

  return (
    <CalculatorWrapper
      title="Income Tax Calculator"
      description="Estimate your 2024 federal income tax liability and take-home pay based on current IRS tax laws."
      icon={Landmark}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="income">Annual Household Income</Label>
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

              <div className="space-y-4 pt-4 border-t">
                <Label className="text-sm font-semibold">Deductions</Label>
                <RadioGroup 
                  value={deductionType} 
                  onValueChange={setDeductionType}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="cursor-pointer">Standard</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="itemized" id="itemized" />
                    <Label htmlFor="itemized" className="cursor-pointer">Itemized</Label>
                  </div>
                </RadioGroup>

                {deductionType === 'itemized' && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="itemizedAmount">Total Itemized Deductions</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="itemizedAmount"
                        type="number"
                        className="pl-7"
                        value={itemizedAmount}
                        onChange={(e) => setItemizedAmount(Number(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Calculation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gross Income</span>
                <span className="font-medium">${income.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deductions</span>
                <span className="font-medium">-${results.totalDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-bold text-primary">
                <span>Taxable Income</span>
                <span>${results.taxableIncome.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl">
            <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
              <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-semibold">Total Estimated Tax</p>
              <h3 className="text-6xl font-bold font-headline mb-6">
                ${results.totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
              
              <div className="w-full max-w-md space-y-4">
                <div className="flex justify-between text-xs font-medium opacity-90">
                  <span>Take Home Pay</span>
                  <span>${results.netIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <Progress value={100 - results.effectiveRate} className="h-3 bg-white/20 [&>div]:bg-emerald-400" />
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <p className="text-[10px] uppercase opacity-70">Effective Rate</p>
                    <p className="text-xl font-bold">{results.effectiveRate.toFixed(1)}%</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <p className="text-[10px] uppercase opacity-70">Marginal Rate</p>
                    <p className="text-xl font-bold">{results.marginalRate.toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Tax Liability Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableHeader>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Federal Income Tax</div>
                      <div className="text-[10px] text-muted-foreground uppercase">Based on taxable income</div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">${results.federalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Social Security</div>
                      <div className="text-[10px] text-muted-foreground uppercase">6.2% of gross income up to $168,600</div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">${results.socialSecurityTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Medicare</div>
                      <div className="text-[10px] text-muted-foreground uppercase">1.45% of gross income</div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">${results.medicareTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                  </TableRow>
                  <TableRow className="bg-primary/5">
                    <TableCell className="font-bold text-primary">Total Annual Tax</TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary">${results.totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Progressive Tax Bracket Table</CardTitle>
              <CardDescription>How your taxable income (${results.taxableIncome.toLocaleString()}) was distributed across brackets.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.bracketsReached.map((b, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{b.rate} Bracket ({b.range})</span>
                      <span className="font-mono">${b.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <Progress value={(b.taxableInBracket / results.taxableIncome) * 100} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs text-blue-800 leading-relaxed font-semibold">
                Marginal Rate vs. Effective Rate
              </p>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Your <strong>Marginal Tax Rate</strong> is the tax percentage on the highest dollar of your income. Your <strong>Effective Tax Rate</strong> is the actual percentage of your <em>gross</em> income that goes to taxes after all deductions and lower brackets are applied.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
