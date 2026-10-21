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
  Landmark,
  Lightbulb
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  twitter: {
    card: 'summary_large_image',
    title: 'Instant Home Loan & Mortgage Estimator | MyApexCalc',
    description: 'Accurately figure out your total monthly mortgage obligations, including taxes, interest, and insurance.',
    images: ['https://i.ibb.co/WLfWtgm/mortgage-calculator.png'],
  },
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/mortgage',
  },
};

export default function MortgagePage() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPaymentAmount, setDownPaymentAmount] = useState(80000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [homeInsurance, setHomeInsurance] = useState(1500); 
  const [hoaFee, setHoaFee] = useState(0); 
  const [pmiRate, setPmiRate] = useState(0.5); 

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
    
    let pi = 0;
    if (r === 0) {
      pi = P / n;
    } else {
      pi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const mTax = (homePrice * (propertyTaxRate / 100)) / 12;
    const mIns = homeInsurance / 12;
    const mHOA = hoaFee;
    const mPMI = downPaymentPercent < 20 ? (P * (pmiRate / 100)) / 12 : 0;

    const total = pi + mTax + mIns + mHOA + mPMI;
    const totalPayments = pi * n;
    const interestTotal = totalPayments - P;

    const chartData = [
      { name: 'P & I', value: Math.round(pi), color: 'hsl(var(--primary))' },
      { name: 'Taxes', value: Math.round(mTax), color: 'hsl(var(--accent))' },
      { name: 'Insurance', value: Math.round(mIns), color: '#10b981' }, 
      { name: 'HOA', value: Math.round(mHOA), color: '#f59e0b' }, 
    ];

    if (mPMI > 0) {
      chartData.push({ name: 'PMI', value: Math.round(mPMI), color: '#ef4444' }); 
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
    value: { label: "Monthly Cost" }
  };

  return (
    <CalculatorWrapper
      title="Advanced Mortgage Calculator"
      description="Calculate your total monthly home payment including taxes, insurance, and fees."
      icon={Home}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Purchase Details</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="homePrice">Home Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input id="homePrice" type="number" className="pl-9" value={homePrice} onChange={(e) => {
                    const val = Number(e.target.value);
                    setHomePrice(val);
                    setDownPaymentAmount((downPaymentPercent / 100) * val);
                  }} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Down Payment</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input type="number" className="pl-9" value={Math.round(downPaymentAmount)} onChange={(e) => updateDownPaymentAmount(Number(e.target.value))} />
                  </div>
                  <div className="relative">
                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input type="number" className="pr-9" value={downPaymentPercent.toFixed(1)} onChange={(e) => updateDownPaymentPercent(Number(e.target.value))} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loan Term</Label>
                  <Select value={String(loanTerm)} onValueChange={(v) => setLoanTerm(Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <Input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Taxes & Fees</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Property Tax (%)</Label><Input type="number" step="0.01" value={propertyTaxRate} onChange={(e) => setPropertyTaxRate(Number(e.target.value))} /></div>
                <div className="space-y-2"><Label>Home Insurance ($/yr)</Label><Input type="number" value={homeInsurance} onChange={(e) => setHomeInsurance(Number(e.target.value))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>HOA Fee ($/mo)</Label><Input type="number" value={hoaFee} onChange={(e) => setHoaFee(Number(e.target.value))} /></div>
                <div className="space-y-2"><Label>PMI Rate (%)</Label><Input type="number" step="0.01" value={pmiRate} disabled={downPaymentPercent >= 20} onChange={(e) => setPmiRate(Number(e.target.value))} /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl overflow-hidden">
            <div className="px-6 py-8 text-center bg-primary/95">
              <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-semibold">Total Monthly Payment</p>
              <h3 className="text-5xl font-bold font-headline">${results.totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><PieChartIcon className="w-4 h-4 text-primary" /> Monthly Breakdown</CardTitle></CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={results.chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {results.chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Loan Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Loan Amount</span><span className="font-semibold">${results.loanAmount.toLocaleString()}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Monthly P & I</span><span className="font-bold">${results.monthlyPI.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
                <div className="flex justify-between border-b pb-2 text-accent"><span className="font-medium">Monthly Taxes</span><span className="font-bold">${results.monthlyTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
                <div className="pt-4 mt-4 border-t-2 border-dashed"><div className="flex justify-between items-center"><span className="font-bold text-lg">Total Cost</span><span className="font-bold text-xl text-primary">${results.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div></div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-3">
            <h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Info size={16} /> Disclaimer
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              Mortgage payment and repayment estimates are provided for general planning purposes only. Actual mortgage costs may include property taxes, homeowners insurance, mortgage insurance, lender fees, closing costs, variable rates, and other expenses that may not be included in the calculation. The final terms depend on the lender, loan agreement, property, and borrower eligibility. This calculator is not a mortgage offer, credit approval, or financial recommendation. Consult your lender or a qualified mortgage professional before making a home-financing decision.
            </p>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
