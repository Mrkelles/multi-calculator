"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Receipt, 
  Info, 
  ArrowRightLeft, 
  DollarSign, 
  Percent, 
  History, 
  Calculator, 
  Landmark,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Lightbulb
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Accurate Sales Tax Calculator | Free Retail Tax Estimator',
  description: 'Calculate state, county, and local sales tax instantly. Use our free retail tax calculator to estimate sales tax and reverse-calculate pre-tax prices.',
  keywords: [
    'Sales Tax Calculator',
    'estimate sales tax',
    'retail tax calculator',
    'MyApexCalc',
    'reverse sales tax calculator',
    'sales tax lookup',
    'consumer tax estimator'
  ],
  openGraph: {
    title: 'Precision Sales Tax & Retail Calculator | MyApexCalc',
    description: 'Avoid surprises at the register. Calculate purchase totals, local sales taxes, and itemized receipts in seconds with our free online tool.',
    url: 'https://www.myapexcalc.com/calculators/sales-tax',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/pB0Zvy7K/sales-tax-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Sales Tax Calculator and Retail Pricing Amortization Screen',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Retail Sales Tax Calculator | MyApexCalc',
    description: 'Quickly estimate sales tax and final prices or reverse-calculate original prices before tax was added.',
    images: ['https://i.ibb.co/pB0Zvy7K/sales-tax-calculator.png'],
  },
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/sales-tax',
  },
};

const stateTaxRates = [
  { state: "Alabama", rate: "4.00%" },
  { state: "Alaska", rate: "0.00%" },
  { state: "Arizona", rate: "5.60%" },
  { state: "Arkansas", rate: "6.50%" },
  { state: "California", rate: "7.25%" },
  { state: "Colorado", rate: "2.90%" },
  { state: "Connecticut", rate: "6.35%" },
  { state: "Delaware", rate: "0.00%" },
  { state: "Florida", rate: "6.00%" },
  { state: "Georgia", rate: "4.00%" },
  { state: "Hawaii", rate: "4.00%" },
  { state: "Idaho", rate: "6.00%" },
  { state: "Illinois", rate: "6.25%" },
  { state: "Indiana", rate: "7.00%" },
  { state: "Iowa", rate: "6.00%" },
  { state: "Kansas", rate: "6.50%" },
  { state: "Kentucky", rate: "6.00%" },
  { state: "Louisiana", rate: "4.45%" },
  { state: "Maine", rate: "5.50%" },
  { state: "Maryland", rate: "6.00%" },
  { state: "Massachusetts", rate: "6.25%" },
  { state: "Michigan", rate: "6.00%" },
  { state: "Minnesota", rate: "6.875%" },
  { state: "Mississippi", rate: "7.00%" },
  { state: "Missouri", rate: "4.225%" },
  { state: "Montana", rate: "0.00%" },
  { state: "Nebraska", rate: "5.50%" },
  { state: "Nevada", rate: "6.85%" },
  { state: "New Hampshire", rate: "0.00%" },
  { state: "New Jersey", rate: "6.625%" },
  { state: "New Mexico", rate: "5.125%" },
  { state: "New York", rate: "4.00%" },
  { state: "North Carolina", rate: "4.75%" },
  { state: "North Dakota", rate: "5.00%" },
  { state: "Ohio", rate: "5.75%" },
  { state: "Oklahoma", rate: "4.50%" },
  { state: "Oregon", rate: "0.00%" },
  { state: "Pennsylvania", rate: "6.00%" },
  { state: "Rhode Island", rate: "7.00%" },
  { state: "South Carolina", rate: "6.00%" },
  { state: "South Dakota", rate: "4.50%" },
  { state: "Tennessee", rate: "7.00%" },
  { state: "Texas", rate: "6.25%" },
  { state: "Utah", rate: "4.85%" },
  { state: "Vermont", rate: "6.00%" },
  { state: "Virginia", rate: "5.30%" },
  { state: "Washington", rate: "6.50%" },
  { state: "West Virginia", rate: "6.00%" },
  { state: "Wisconsin", rate: "5.00%" },
  { state: "Wyoming", rate: "4.00%" },
];

export default function SalesTaxCalculatorPage() {
  const [mode, setMode] = useState<'before' | 'after'>('before');
  const [amount, setAmount] = useState(100);
  const [taxRate, setTaxRate] = useState(7.5);

  const results = useMemo(() => {
    let taxAmount = 0;
    let totalPrice = 0;
    let netPrice = 0;

    if (mode === 'before') {
      netPrice = amount;
      taxAmount = (netPrice * taxRate) / 100;
      totalPrice = netPrice + taxAmount;
    } else {
      totalPrice = amount;
      netPrice = totalPrice / (1 + taxRate / 100);
      taxAmount = totalPrice - netPrice;
    }

    return { taxAmount, totalPrice, netPrice };
  }, [mode, amount, taxRate]);

  return (
    <CalculatorWrapper
      title="Sales Tax Calculator"
      description="Easily calculate the tax amount and total price of an item, or reverse the calculation to find the original price before tax."
      icon={Receipt}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="before" className="font-bold">Add Tax</TabsTrigger>
                  <TabsTrigger value="after" className="font-bold">Reverse Tax</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  {mode === 'before' ? 'Amount Before Tax ($)' : 'Total Amount After Tax ($)'}
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input id="amount" type="number" className="pl-9" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Sales Tax Rate (%)</Label>
                <div className="relative">
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input id="taxRate" type="number" step="0.01" className="pr-9" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-primary text-white border-none shadow-lg">
              <CardContent className="pt-6">
                <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1 font-bold">Total Sales Tax</p>
                <h3 className="text-3xl font-bold font-headline">
                  ${results.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </CardContent>
            </Card>
            <Card className="bg-accent text-white border-none shadow-lg">
              <CardContent className="pt-6">
                <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1 font-bold">
                  {mode === 'before' ? 'Total Price' : 'Net Price'}
                </p>
                <h3 className="text-3xl font-bold font-headline">
                  ${(mode === 'before' ? results.totalPrice : results.netPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </CardContent>
            </Card>
          </div>

          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-3">
            <h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Info size={16} /> Disclaimer
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              Sales tax estimates are based on the tax rate and transaction details entered. Actual tax obligations may vary by jurisdiction, product or service category, exemptions, delivery location, local surcharges, and applicable tax rules. This calculator may not account for every tax provision or special circumstance. Confirm the relevant rates and requirements with the appropriate tax authority or a qualified tax professional before relying on the result for billing, reporting, or compliance.
            </p>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Calculator className="w-5 h-5 text-primary" /> Detailed Breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3"><span className="text-muted-foreground font-medium">Net Price (Excl. Tax)</span><span className="text-lg font-bold">${results.netPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
              <div className="flex justify-between items-center border-b pb-3"><div className="space-y-0.5"><span className="text-muted-foreground font-medium">Sales Tax</span><p className="text-[10px] text-accent font-bold uppercase tracking-wider">{taxRate}% applied</p></div><span className="text-lg font-bold text-accent">+ ${results.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
              <div className="flex justify-between items-center pt-2"><span className="text-xl font-black text-primary uppercase tracking-tighter">Total Price</span><span className="text-3xl font-black text-primary font-headline">${results.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          <section className="space-y-6 pt-10">
            <div className="flex items-center gap-2"><Landmark className="w-6 h-6 text-primary" /><h3 className="text-2xl font-bold text-primary">U.S. State Sales Tax Rates</h3></div>
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-muted/50 sticky top-0 z-10"><TableRow><TableHead className="font-bold">State</TableHead><TableHead className="text-right font-bold">Base Sales Tax Rate</TableHead></TableRow></TableHeader>
                  <TableBody>{stateTaxRates.map((item) => (<TableRow key={item.state} className="hover:bg-primary/5 transition-colors"><TableCell className="font-medium">{item.state}</TableCell><TableCell className="text-right font-mono font-bold text-primary">{item.rate}</TableCell></TableRow>))}</TableBody>
                </Table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
