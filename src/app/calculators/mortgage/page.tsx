"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Home, 
  PieChart as PieChartIcon, 
  Info, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Calculator, 
  History, 
  ChevronRight,
  ShieldCheck,
  Landmark
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
} from '@/components/ui/chart';
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Accurate Mortgage Calculator | Free Home Payment Estimator',
  description: 'Estimate your monthly home payments instantly with our free mortgage calculator. Figure out mortgage payments including principal, interest, property taxes, and home insurance.',
  keywords: [
    'mortgage calculator',
    'bankrate mortgage calculator',
    'figure out mortgage payment',
    'MyApexCalc',
    'home loan calculator',
    'p&i calculator',
    'monthly housing costs'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Advanced Mortgage Payment Calculator | MyApexCalc',
    description: 'Break down your home loan costs in seconds. Figure out mortgage payments, interest structures, and taxes with our interactive calculation tool.',
    url: 'https://www.myapexcalc.com/calculators/mortgage',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/WLfWtgm/mortgage-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Advanced Mortgage Calculator and Monthly Breakdown Dashboard',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Instant Home Loan & Mortgage Estimator | MyApexCalc',
    description: 'Accurately figure out your total monthly mortgage obligations, including taxes, interest, and insurance.',
    images: ['https://i.ibb.co/WLfWtgm/mortgage-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/mortgage',
  },
};

export default function MortgagePage() {
  // Inputs
  const [homePrice, setHomePrice] = useState(400000);
  const [downPaymentAmount, setDownPaymentAmount] = useState(80000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [homeInsurance, setHomeInsurance] = useState(1500); // Annual
  const [hoaFee, setHoaFee] = useState(0); // Monthly
  const [pmiRate, setPmiRate] = useState(0.5); // Applied if down payment < 20%

  // Results
  const [results, setResults] = useState({
    monthlyPI: 0,
    monthlyTax: 0,
    monthlyInsurance: 0,
    monthlyHOA: 0,
    monthlyPMI: 0,
    totalMonthly: 0,
    loanAmount: 0,
    totalInterest: 0,
    totalCost: 0,
    chartData: [] as any[],
  });

  // Sync Down Payment
  const updateDownPaymentAmount = (val: number) => {
    setDownPaymentAmount(val);
    setDownPaymentPercent(homePrice > 0 ? (val / homePrice) * 100 : 0);
  };

  const updateDownPaymentPercent = (val: number) => {
    setDownPaymentPercent(val);
    setDownPaymentAmount((val / 100) * homePrice);
  };

  useEffect(() => {
    const P = homePrice - downPaymentAmount;
    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;
    
    // Principal & Interest
    let pi = 0;
    if (r === 0) {
      pi = P / n;
    } else {
      pi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    // Taxes & Insurance
    const mTax = (homePrice * (propertyTaxRate / 100)) / 12;
    const mIns = homeInsurance / 12;
    const mHOA = hoaFee;
    
    // PMI logic: standard 0.5% - 1% annually if LTV > 80%
    const mPMI = downPaymentPercent < 20 ? (P * (pmiRate / 100)) / 12 : 0;

    const total = pi + mTax + mIns + mHOA + mPMI;
    const totalPayments = pi * n;
    const interestTotal = totalPayments - P;

    const chartData = [
      { name: 'P & I', value: Math.round(pi), color: 'hsl(var(--primary))' },
      { name: 'Taxes', value: Math.round(mTax), color: 'hsl(var(--accent))' },
      { name: 'Insurance', value: Math.round(mIns), color: '#10b981' }, // green-500
      { name: 'HOA', value: Math.round(mHOA), color: '#f59e0b' }, // amber-500
    ];

    if (mPMI > 0) {
      chartData.push({ name: 'PMI', value: Math.round(mPMI), color: '#ef4444' }); // red-500
    }

    setResults({
      monthlyPI: pi,
      monthlyTax: mTax,
      monthlyInsurance: mIns,
      monthlyHOA: mHOA,
      monthlyPMI: mPMI,
      totalMonthly: total,
      loanAmount: P,
      totalInterest: interestTotal,
      totalCost: totalPayments + (mTax * n) + (mIns * n) + (mHOA * n) + (mPMI * n),
      chartData: chartData,
    });
  }, [homePrice, downPaymentAmount, downPaymentPercent, loanTerm, interestRate, propertyTaxRate, homeInsurance, hoaFee, pmiRate]);

  const chartConfig = {
    value: {
      label: "Monthly Cost",
    }
  };

  return (
    <CalculatorWrapper
      title="Advanced Mortgage Calculator"
      description="Calculate your total monthly home payment including taxes, insurance, and fees."
      icon={Home}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Purchase Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="homePrice">Home Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="homePrice"
                    type="number"
                    className="pl-9"
                    value={homePrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setHomePrice(val);
                      setDownPaymentAmount((downPaymentPercent / 100) * val);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Down Payment</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="number"
                      className="pl-9"
                      value={Math.round(downPaymentAmount)}
                      onChange={(e) => updateDownPaymentAmount(Number(e.target.value))}
                    />
                  </div>
                  <div className="relative">
                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="number"
                      className="pr-9"
                      value={downPaymentPercent.toFixed(1)}
                      onChange={(e) => updateDownPaymentPercent(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loan Term</Label>
                  <Select value={String(loanTerm)} onValueChange={(v) => setLoanTerm(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 Years</SelectItem>
                      <SelectItem value="20">20 Years</SelectItem>
                      <SelectItem value="15">15 Years</SelectItem>
                      <SelectItem value="10">10 Years</SelectItem>
                    </SelectContent>
                  </Select>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Taxes & Fees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Property Tax (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={propertyTaxRate}
                    onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Home Insurance ($/yr)</Label>
                  <Input
                    type="number"
                    value={homeInsurance}
                    onChange={(e) => setHomeInsurance(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>HOA Fee ($/mo)</Label>
                  <Input
                    type="number"
                    value={hoaFee}
                    onChange={(e) => setHoaFee(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>PMI Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={pmiRate}
                    disabled={downPaymentPercent >= 20}
                    onChange={(e) => setPmiRate(Number(e.target.value))}
                  />
                </div>
              </div>
              {downPaymentPercent >= 20 && (
                <p className="text-[10px] text-green-600 font-medium italic">
                  PMI waived with 20% down payment.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl overflow-hidden">
            <div className="px-6 py-8 text-center bg-primary/95">
              <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-semibold">Total Monthly Payment</p>
              <h3 className="text-5xl font-bold font-headline">
                ${results.totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-primary" />
                  Monthly Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={results.chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {results.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Loan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Loan Amount</span>
                  <span className="font-semibold">${results.loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Down Payment</span>
                  <span className="font-semibold">${downPaymentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2 text-primary">
                  <span className="font-medium">Monthly P & I</span>
                  <span className="font-bold">${results.monthlyPI.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between border-b pb-2 text-accent">
                  <span className="font-medium">Monthly Taxes</span>
                  <span className="font-bold">${results.monthlyTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Total Interest Paid</span>
                  <span>${results.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="pt-4 mt-4 border-t-2 border-dashed">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total Cost</span>
                    <span className="font-bold text-xl text-primary">${results.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Includes all P&I, Taxes, Insurance, and HOA over {loanTerm} years.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Pro Tip:</strong> Most lenders require <strong>Private Mortgage Insurance (PMI)</strong> if your down payment is less than 20% of the home price. This is included in our calculation automatically when applicable.
            </p>
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
              Take the Stress Out of Home Buying with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Purchasing a home is one of the most significant financial decisions you will ever make. Before looking at listings or contacting a lender, it is critical to evaluate what you can comfortably afford each month. Our free, intuitive mortgage calculator is designed to simplify this process. Rather than guessing your long-term housing costs, our dashboard lets you project your true financial commitment in seconds.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              How to Figure Out Mortgage Payments
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                A standard home payment consists of more than just paying down your loan's balance. Real-world housing costs typically bundle four key components—collectively known as PITI (Principal, Interest, Taxes, and Insurance).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                To calculate your monthly Principal and Interest (M), our interactive tool runs the standard amortization formula:
              </p>
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                M = P [ r(1+r)^n ] / [ (1+r)^n - 1 ]
              </div>
              <div className="space-y-2 pt-2">
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">P</span> represents your total loan principal (purchase price minus down payment).</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">r</span> represents your monthly interest rate (annual rate divided by 12 months).</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">n</span> represents the total number of monthly payments (e.g., 360 for a 30-year term).</p>
              </div>
              <p className="text-muted-foreground leading-relaxed pt-2">
                Once the base payment is determined, our system dynamically layers in your property taxes, home insurance premiums, and any relevant HOA fees to give you a complete and realistic monthly budget.
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Use MyApexCalc Over Generic Tools?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                While resources like the standard bankrate mortgage calculator offer excellent high-level projections, MyApexCalc is built for customization and speed:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Customize Every Metric</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Adjust property tax rates, insurance costs, and HOA variables in real-time to match your target neighborhood.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Down Payment Thresholds</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">See instant updates when your down payment hits 20%, which automatically waives costly PMI fees.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Lifetime Cost Analysis</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">View a comprehensive breakdown of the total interest paid, helping you compare 15-year vs. 30-year terms.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <Landmark className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "Knowing your real monthly payment before you visit a bank puts you in the driver's seat of your home-buying journey."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
