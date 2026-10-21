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
  Clock,
  Lightbulb
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

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
  twitter: {
    card: 'summary_large_image',
    title: 'Free Automobile Loan Calculator | MyApexCalc',
    description: 'Instantly calculate car payments, compare loan lengths, and see your total interest costs over time.',
    images: ['https://i.ibb.co/GQstbRww/autoloan-calculator.png'],
  },
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/auto-loan',
  },
};

export default function AutoLoanPage() {
  const [salePrice, setSalePrice] = useState(35000);
  const [loanTerm, setLoanTerm] = useState(60); 
  const [interestRate, setInterestRate] = useState(5.5);
  const [downPayment, setDownPayment] = useState(5000);
  const [tradeInValue, setTradeInValue] = useState(0);
  const [amountOwedOnTrade, setAmountOwedOnTrade] = useState(0);
  const [cashIncentives, setCashIncentives] = useState(0);
  const [salesTaxRate, setSalesTaxRate] = useState(7.0);
  const [fees, setFees] = useState(1500);
  const [includeFeesInLoan, setIncludeFeesInLoan] = useState(true);

  const [results, setResults] = useState({
    monthlyPayment: 0,
    loanAmount: 0,
    salesTax: 0,
    upfrontPayment: 0,
    totalInterest: 0,
    totalCost: 0,
  });

  useEffect(() => {
    const taxableAmount = Math.max(0, salePrice - tradeInValue);
    const salesTax = (taxableAmount * salesTaxRate) / 100;
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

    setResults({ monthlyPayment: monthly, loanAmount, salesTax, upfrontPayment, totalInterest, totalCost });
  }, [salePrice, loanTerm, interestRate, downPayment, tradeInValue, amountOwedOnTrade, cashIncentives, salesTaxRate, fees, includeFeesInLoan]);

  return (
    <CalculatorWrapper
      title="Auto Loan Calculator"
      description="Calculate your monthly car payment with precision, including trade-ins, taxes, and fees."
      icon={Car}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Vehicle & Loan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="salePrice">Auto Sale Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /><Input id="salePrice" type="number" className="pl-9" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Loan Term (Months)</Label><Input type="number" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} /></div>
                <div className="space-y-2"><Label>Interest Rate (%)</Label><Input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} /></div>
              </div>
              <div className="space-y-2">
                <Label>Down Payment</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /><Input type="number" className="pl-9" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2"><Checkbox id="includeFees" checked={includeFeesInLoan} onCheckedChange={(checked) => setIncludeFeesInLoan(!!checked)} /><Label htmlFor="includeFees" className="text-xs font-medium cursor-pointer">Include All Taxes & Fees in Loan</Label></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Taxes & Fees</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-xs">Sales Tax (%)</Label><Input type="number" step="0.1" className="h-9 text-xs" value={salesTaxRate} onChange={(e) => setSalesTaxRate(Number(e.target.value))} /></div>
                <div className="space-y-2"><Label className="text-xs">Registration & Fees</Label><div className="relative"><DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground w-3 h-3" /><Input type="number" className="pl-7 h-9 text-xs" value={fees} onChange={(e) => setFees(Number(e.target.value))} /></div></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl"><CardContent className="pt-8 pb-10 text-center"><p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-semibold">Estimated Monthly Payment</p><h3 className="text-6xl font-black font-headline tracking-tighter">${results.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3></CardContent></Card>
          
          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-3">
            <h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Info size={16} /> Disclaimer
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              Auto loan estimates are based on the vehicle price, down payment, trade-in value, interest rate, loan term, taxes, fees, and other inputs provided. Actual payments and total vehicle costs may vary because of lender terms, credit approval, dealer charges, insurance, registration costs, and jurisdiction-specific tax rules. The calculator may not include every cost of vehicle ownership, such as fuel, maintenance, or repairs. Confirm the final financing terms with your lender or dealer before purchasing a vehicle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ReceiptText className="w-4 h-4 text-primary" /> Financing Summary</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><div className="flex justify-between border-b pb-1.5"><span className="text-muted-foreground">Total Loan Amount</span><span className="font-bold">${results.loanAmount.toLocaleString()}</span></div><div className="flex justify-between border-b pb-1.5"><span className="text-muted-foreground">Total Interest</span><span className="font-medium">${results.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div></CardContent></Card>
            <Card className="bg-accent/5 border-accent/20"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2 text-accent"><TrendingUp className="w-4 h-4" /> Total Vehicle Cost</CardTitle></CardHeader><CardContent className="space-y-4"><div className="text-3xl font-bold font-headline text-primary">${results.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div></CardContent></Card>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
