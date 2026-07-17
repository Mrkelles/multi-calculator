
"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Wallet, 
  Info, 
  Landmark, 
  ShieldCheck, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Calculator, 
  History, 
  ChevronRight 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// these would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component to ensure they are picked up by SEO crawlers.
const metadata: Metadata = {
  title: 'Accurate Income Tax Calculator | MyApexCalc',
  description: 'Estimate your federal, state, and local tax liabilities with our free income tax calculator. Easily calculate salary deductions and find your true take-home pay.',
  keywords: [
    'income tax calculator',
    'calculate salary',
    'calculator for tax',
    'federal income tax',
    'take home pay calculator',
    'tax brackets 2026',
    'MyApexCalc'
  ],
  
  openGraph: {
    title: 'Free Income Tax Calculator | MyApexCalc',
    description: 'Stop guessing your tax bill. Calculate salary take-home pay, federal withholdings, and total deductions using our free calculator for tax planning.',
    url: 'https://www.myapexcalc.com/calculators/tax',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/V0VC2RQK/income-tax-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Income Tax Calculator User Interface',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Federal & State Income Tax Calculator | MyApexCalc',
    description: 'Instantly calculate your salary deductions and project your annual take-home income with ease.',
    images: ['https://i.ibb.co/V0VC2RQK/income-tax-calculator.png'],
  },

  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/tax',
  },
};

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
    ],
    addlMedicareThreshold: 200000
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
    ],
    addlMedicareThreshold: 250000
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
    ],
    addlMedicareThreshold: 200000
  }
};

const FICA_RATES = {
  socialSecurity: 0.062,
  ssLimit: 168600,
  medicare: 0.0145,
  addlMedicare: 0.009,
};

export default function TaxPage() {
  const [income, setIncome] = useState(75000);
  const [preTaxDeductions, setPreTaxDeductions] = useState(0); // 401k, HSA
  const [status, setStatus] = useState('single');
  const [deductionType, setDeductionType] = useState('standard');
  const [itemizedAmount, setItemizedAmount] = useState(0);
  const [stateTaxRate, setStateTaxRate] = useState(5.0); // Estimated flat state tax
  const [taxCredits, setTaxCredits] = useState(0); // e.g., Child Tax Credit
  
  const [results, setResults] = useState({
    taxableIncome: 0,
    federalTax: 0,
    socialSecurityTax: 0,
    medicareTax: 0,
    addlMedicareTax: 0,
    stateTax: 0,
    totalTax: 0,
    netIncome: 0,
    effectiveRate: 0,
    marginalRate: 0,
    bracketsReached: [] as any[],
    totalDeductions: 0,
  });

  useEffect(() => {
    const config = TAX_DATA[status as keyof typeof TAX_DATA];
    
    // Adjusted Gross Income (AGI) - Simplified
    const agi = Math.max(0, income - preTaxDeductions);
    
    // Deductions (Standard or Itemized)
    const deductionValue = deductionType === 'standard' ? config.standardDeduction : itemizedAmount;
    
    // Taxable Income
    const taxable = Math.max(0, agi - deductionValue);
    
    // 1. Calculate Federal Progressive Tax
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

    // Apply Tax Credits (after federal tax calculation)
    federalTax = Math.max(0, federalTax - taxCredits);

    // 2. FICA (Calculated on gross income after pre-tax deductions for Medicare, but usually SS is on gross)
    const ssTax = Math.min(agi, FICA_RATES.ssLimit) * FICA_RATES.socialSecurity;
    const medTax = agi * FICA_RATES.medicare;
    
    // Additional Medicare Tax
    const addlMedTax = agi > config.addlMedicareThreshold 
      ? (agi - config.addlMedicareThreshold) * FICA_RATES.addlMedicare 
      : 0;

    // 3. State Tax (Estimated)
    const stateTax = taxable * (stateTaxRate / 100);
    
    const totalTax = federalTax + ssTax + medTax + addlMedTax + stateTax;
    const net = income - totalTax;

    setResults({
      taxableIncome: taxable,
      federalTax,
      socialSecurityTax: ssTax,
      medicareTax: medTax,
      addlMedicareTax: addlMedTax,
      stateTax,
      totalTax,
      netIncome: net,
      effectiveRate: income > 0 ? (totalTax / income) * 100 : 0,
      marginalRate: marginalRate * 100,
      bracketsReached,
      totalDeductions: deductionValue + preTaxDeductions,
    });
  }, [income, preTaxDeductions, status, deductionType, itemizedAmount, stateTaxRate, taxCredits]);

  return (
    <CalculatorWrapper
      title="Advanced Tax Calculator"
      description="Estimate your 2024 federal and state income tax liability, FICA, and take-home pay with detailed precision."
      icon={Landmark}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Income & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="income">Annual Gross Income</Label>
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
                <Label htmlFor="preTax">Pre-tax Deductions (401k, HSA, etc.)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="preTax"
                    type="number"
                    className="pl-7"
                    value={preTaxDeductions}
                    onChange={(e) => setPreTaxDeductions(Number(e.target.value))}
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
                <Label className="text-sm font-semibold">Standard vs Itemized Deduction</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="itemizedAmount">Total Itemized Amount</Label>
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

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="stateTax">Est. State Tax (%)</Label>
                  <Input
                    id="stateTax"
                    type="number"
                    step="0.1"
                    value={stateTaxRate}
                    onChange={(e) => setStateTaxRate(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxCredits">Tax Credits ($)</Label>
                  <Input
                    id="taxCredits"
                    type="number"
                    value={taxCredits}
                    onChange={(e) => setTaxCredits(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Taxable Income Math</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gross Income</span>
                <span className="font-medium">${income.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pre-tax Deductions</span>
                <span className="font-medium">-${preTaxDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Filing Deductions</span>
                <span className="font-medium">-${(results.totalDeductions - preTaxDeductions).toLocaleString()}</span>
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
              <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-semibold">Total Estimated Annual Tax</p>
              <h3 className="text-6xl font-bold font-headline mb-6">
                ${results.totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
              
              <div className="w-full max-w-md space-y-4">
                <div className="flex justify-between text-xs font-medium opacity-90">
                  <span>Take Home Pay (Annual)</span>
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
                Detailed Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Federal Income Tax</div>
                      <div className="text-[10px] text-muted-foreground">Adjusted for {taxCredits > 0 ? `$${taxCredits.toLocaleString()} in credits` : 'no credits'}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">${results.federalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">State Income Tax</div>
                      <div className="text-[10px] text-muted-foreground">Estimated at {stateTaxRate}% of taxable income</div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">${results.stateTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Social Security</div>
                      <div className="text-[10px] text-muted-foreground uppercase">6.2% up to limit</div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">${results.socialSecurityTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Medicare {results.addlMedicareTax > 0 && "+ Addl Tax"}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">1.45%{results.addlMedicareTax > 0 ? " + 0.9% for high earners" : ""}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">${(results.medicareTax + results.addlMedicareTax).toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                  </TableRow>
                  <TableRow className="bg-primary/5">
                    <TableCell className="font-bold text-primary">Total Annual Liability</TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary">${results.totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Progressive Federal Brackets</CardTitle>
              <CardDescription>Visualizing how your taxable income is taxed across various levels.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.bracketsReached.map((b, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{b.rate} Bracket ({b.range})</span>
                      <span className="font-mono text-primary">${b.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
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
                Monthly Breakdown
              </p>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="text-[11px] text-blue-700">
                  <span className="font-bold">Monthly Take-home:</span> ${(results.netIncome / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[11px] text-blue-700">
                  <span className="font-bold">Monthly Tax:</span> ${(results.totalTax / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informational Text Section */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Take Control of Your Finances with MyApexCalc
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Navigating the complexities of marginal tax brackets, deductions, and payroll withholdings can make managing your personal finances feel overwhelming. Our comprehensive income tax calculator is designed to demystify your tax obligations. Whether you want to project your annual return or accurately calculate salary deductions, this free online calculator for tax offers the precise estimates you need to make informed financial decisions.
              </p>
              
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
                <Calculator className="w-6 h-6" />
                How Your Income Tax is Calculated
              </h3>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Most federal and state systems utilize a progressive tax model, meaning your income is taxed in layers (or "brackets") at progressively higher rates. To find your true tax liability, the tool processes your financial metrics using two core formulas:
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">1. Determine Taxable Income</p>
                  <p className="text-sm text-muted-foreground">First, we determine your total taxable income by subtracting your standard or itemized deductions from your gross earnings:</p>
                  <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                    Taxable Income = Gross Income - Deductions
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">2. Calculate Net Take-Home Pay</p>
                  <p className="text-sm text-muted-foreground">Next, we calculate your net take-home pay by factoring in your progressive tax bracket liability, state taxes, and FICA withholdings (Social Security and Medicare):</p>
                  <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                    Net Income = Gross Income - (Federal Tax + State Tax + FICA + Local Tax)
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  By automating these formulas, our platform eliminates manual math errors and accounts for progressive marginal rate changes instantly.
                </p>
              </div>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Plan Your Taxes with MyApexCalc?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Using an updated financial tool allows you to proactively structure your savings and avoid surprise bills during tax season. Our calculator provides:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">True Take-Home Salary Insights</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Know exactly how a raise, a new job offer, or a bonus will impact your actual take-home pay after federal, state, and local withholdings.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Landmark className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Filing Status Customization</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Compare the tax implications of filing as single, married filing jointly, married filing separately, or head of household.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Instant, Responsive Results</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Adjust your income or deduction sliders and see your financial breakdown update in real-time.</p>
                  </div>
                </li>
              </ul>
              <Separator />
              <div className="bg-primary/5 p-4 rounded-xl">
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Disclaimer</p>
                <p className="text-[10px] text-muted-foreground leading-tight italic">
                  Calculations are based on 2024 IRS tax brackets and standard FICA rates. This tool is for educational purposes and does not constitute professional tax advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
