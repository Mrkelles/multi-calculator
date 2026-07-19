"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Car, 
  Info, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  ReceiptText,
  Calculator,
  History,
  ShieldCheck,
  ChevronRight,
  Landmark,
  Clock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component.
const metadata: Metadata = {
  title: 'Accurate Auto Loan Calculator | Estimate Vehicle Payments',
  description: 'Calculate your monthly car payment instantly with our free auto loan calculator. Input vehicle price, down payment, interest rates, and loan terms to plan your budget.',
  keywords: [
    'auto loan calculator',
    'automobile loan calculator',
    'estimate vehicle payment',
    'MyApexCalc',
    'car payment estimator',
    'vehicle interest calculator',
    'car loan amortization'
  ],
  
  // Open Graph for social sharing platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Interactive Auto Loan & Car Payment Calculator | MyApexCalc',
    description: 'Avoid dealership surprises. Figure out your true monthly cost, calculate interest fees, and estimate vehicle payment options in seconds.',
    url: 'https://www.myapexcalc.com/calculators/auto-loan',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/GQstbRww/autoloan-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Auto Loan Calculator and Monthly Payment Estimator Dashboard',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free Automobile Loan Calculator | MyApexCalc',
    description: 'Instantly calculate car payments, compare loan lengths, and see your total interest costs over time.',
    images: ['https://i.ibb.co/GQstbRww/autoloan-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent duplicate indexing issues
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/auto-loan',
  },
};

export default function AutoLoanPage() {
  // Inputs
  const [salePrice, setSalePrice] = useState(35000);
  const [loanTerm, setLoanTerm] = useState(60); // months
  const [interestRate, setInterestRate] = useState(5.5);
  const [downPayment, setDownPayment] = useState(5000);
  const [tradeInValue, setTradeInValue] = useState(0);
  const [amountOwedOnTrade, setAmountOwedOnTrade] = useState(0);
  const [cashIncentives, setCashIncentives] = useState(0);
  const [salesTaxRate, setSalesTaxRate] = useState(7.0);
  const [fees, setFees] = useState(1500);
  const [includeFeesInLoan, setIncludeFeesInLoan] = useState(true);

  // Results
  const [results, setResults] = useState({
    monthlyPayment: 0,
    loanAmount: 0,
    salesTax: 0,
    upfrontPayment: 0,
    totalInterest: 0,
    totalCost: 0,
  });

  useEffect(() => {
    // 1. Calculate Taxable Amount (Most states tax on price minus trade-in)
    const taxableAmount = Math.max(0, salePrice - tradeInValue);
    const salesTax = (taxableAmount * salesTaxRate) / 100;

    // 2. Calculate Total Upfront (Net Price Adjustments)
    // Adjusted Price = Sale Price - Trade-in + Owed + Taxes + Fees - Incentives - DownPayment
    const netPurchasePrice = salePrice - tradeInValue + amountOwedOnTrade - cashIncentives;
    
    let loanAmount = 0;
    let upfrontPayment = downPayment;

    if (includeFeesInLoan) {
      loanAmount = netPurchasePrice + salesTax + fees - downPayment;
    } else {
      loanAmount = netPurchasePrice - downPayment;
      upfrontPayment = downPayment + salesTax + fees;
    }

    loanAmount = Math.max(0, loanAmount);

    // 3. Loan Calculation
    const r = interestRate / 100 / 12;
    const n = loanTerm;
    
    let monthly = 0;
    if (r === 0) {
      monthly = loanAmount / n;
    } else {
      monthly = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalInterest = (monthly * n) - loanAmount;
    const totalCost = salePrice + salesTax + fees + totalInterest - cashIncentives;

    setResults({
      monthlyPayment: monthly,
      loanAmount,
      salesTax,
      upfrontPayment,
      totalInterest,
      totalCost,
    });
  }, [salePrice, loanTerm, interestRate, downPayment, tradeInValue, amountOwedOnTrade, cashIncentives, salesTaxRate, fees, includeFeesInLoan]);

  return (
    <CalculatorWrapper
      title="Auto Loan Calculator"
      description="Calculate your monthly car payment with precision, including trade-ins, taxes, and fees."
      icon={Car}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle & Loan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="salePrice">Auto Sale Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="salePrice"
                    type="number"
                    className="pl-9"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loan Term (Months)</Label>
                  <Input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Interest Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Down Payment</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="number"
                    className="pl-9"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeFees" 
                    checked={includeFeesInLoan} 
                    onCheckedChange={(checked) => setIncludeFeesInLoan(!!checked)} 
                  />
                  <Label htmlFor="includeFees" className="text-xs font-medium leading-none cursor-pointer">
                    Include All Taxes & Fees in Loan
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trade-in & Incentives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Trade-in Value</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground w-3 h-3" />
                    <Input
                      type="number"
                      className="pl-7 h-9 text-xs"
                      value={tradeInValue}
                      onChange={(e) => setTradeInValue(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Amount Owed</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground w-3 h-3" />
                    <Input
                      type="number"
                      className="pl-7 h-9 text-xs"
                      value={amountOwedOnTrade}
                      onChange={(e) => setAmountOwedOnTrade(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Cash Incentives</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground w-3 h-3" />
                  <Input
                    type="number"
                    className="pl-7 h-9 text-xs"
                    value={cashIncentives}
                    onChange={(e) => setCashIncentives(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Taxes & Fees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Sales Tax (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    className="h-9 text-xs"
                    value={salesTaxRate}
                    onChange={(e) => setSalesTaxRate(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Registration & Fees</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground w-3 h-3" />
                    <Input
                      type="number"
                      className="pl-7 h-9 text-xs"
                      value={fees}
                      onChange={(e) => setFees(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl">
            <CardContent className="pt-8 pb-10 text-center">
              <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-semibold">Estimated Monthly Payment</p>
              <h3 className="text-6xl font-black font-headline tracking-tighter">
                ${results.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </h3>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ReceiptText className="w-4 h-4 text-primary" />
                  Financing Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Total Loan Amount</span>
                  <span className="font-bold">${results.loanAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Upfront Payment</span>
                  <span className="font-bold text-accent">${results.upfrontPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Sales Tax</span>
                  <span className="font-medium">${results.salesTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Total Interest</span>
                  <span>${results.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-accent">
                  <TrendingUp className="w-4 h-4" />
                  Total Vehicle Cost
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold font-headline text-primary">
                  ${results.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Includes sale price, taxes, registration fees, and total interest over the life of the loan.
                </p>
                <Separator />
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Payoff Date</p>
                  <p className="text-xs font-semibold">
                    {new Date(new Date().setMonth(new Date().getMonth() + loanTerm)).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs text-blue-800 leading-relaxed font-semibold">
                Calculation Logic Note
              </p>
              <p className="text-[11px] text-blue-700">
                Most states calculate sales tax based on the <strong>Sale Price minus Trade-in Value</strong>. Our calculator applies this rule. If your state taxes the full price, please adjust your input accordingly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Informational Text Section */}
      <div className="py-10 space-y-12">
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Take Control of Your Car Buying Budget with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Shopping for a new or used vehicle is an exciting milestone, but navigating dealership financing can quickly become overwhelming. Sales representatives often focus solely on the monthly payment, masking the overall long-term cost of the vehicle through extended loan terms and high interest rates. To negotiate confidently and protect your wallet, you need to know exactly how your loan parameters interact. Our free, interactive auto loan calculator acts as your personal financial advisor, allowing you to run numbers, bypass dealer pressure, and establish a clear budget before you ever step onto the showroom floor.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              The Amortization Math: How to Estimate Vehicle Payments
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                When you secure a car loan, you agree to pay back the borrowed principal amount plus interest over a fixed number of months. To estimate vehicle payment parameters, our mathematical engine processes your input data using the standard fixed-rate amortization formula:
              </p>
              
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                PMT = P × [ r(1+r)<sup>n</sup> ] / [ (1+r)<sup>n</sup> - 1 ]
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">PMT</span> represents your expected monthly car payment.</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">P</span> represents the total loan principal (the purchase price of the vehicle minus any down payments, trade-in values, or rebates, plus taxes and fees).</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">r</span> represents your monthly interest rate (your annual interest rate divided by 12 months).</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">n</span> represents the total number of monthly payments over the life of the loan (e.g., 60 months for a five-year loan).</p>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                By using this formula, our automobile loan calculator breaks down your exact payment, isolating how much of your hard-earned money goes toward reducing your actual principal balance versus how much is lost to bank interest.
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Smart Financing: What to Look Out For
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When running simulations on our dashboard, keep these key financial rules of thumb in mind:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">The Impact of the Loan Term</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Opting for a 72-month or 84-month loan will lower your monthly payment, but it drastically increases the total interest you pay over the life of the loan, often leaving you "underwater" (owing more than the car is worth).</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">The Power of the Down Payment</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Putting down at least 20% of the vehicle's price upfront protects you from immediate depreciation and lowers your overall monthly debt burden.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Total Cost of Ownership</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Remember that your monthly payment is only part of your vehicle expense. Always leave room in your budget for auto insurance, fuel, registration, and routine maintenance.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <Landmark className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "Knowing your real monthly payment before you visit a dealer puts you in the driver's seat of the negotiation."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
