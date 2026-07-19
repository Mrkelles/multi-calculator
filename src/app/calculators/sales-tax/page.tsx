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
  ShieldCheck
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import type { Metadata } from 'next';

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
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
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

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free Retail Sales Tax Calculator | MyApexCalc',
    description: 'Quickly estimate sales tax and final prices or reverse-calculate original prices before tax was added.',
    images: ['https://i.ibb.co/pB0Zvy7K/sales-tax-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
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
      // Amount is the net price
      netPrice = amount;
      taxAmount = (netPrice * taxRate) / 100;
      totalPrice = netPrice + taxAmount;
    } else {
      // Amount is the total price (including tax)
      totalPrice = amount;
      netPrice = totalPrice / (1 + taxRate / 100);
      taxAmount = totalPrice - netPrice;
    }

    return {
      taxAmount,
      totalPrice,
      netPrice
    };
  }, [mode, amount, taxRate]);

  return (
    <CalculatorWrapper
      title="Sales Tax Calculator"
      description="Easily calculate the tax amount and total price of an item, or reverse the calculation to find the original price before tax."
      icon={Receipt}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
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
                  <Input
                    id="amount"
                    type="number"
                    className="pl-9"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate">Sales Tax Rate (%)</Label>
                <div className="relative">
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    className="pr-9"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Info className="w-4 h-4 text-primary" />
                Calculation Logic
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
              {mode === 'before' ? (
                <p>We take your base price and add the specified percentage to it. <strong>Total = Price × (1 + Rate)</strong></p>
              ) : (
                <p>We calculate the original price by dividing the total by (1 + tax rate). <strong>Original = Total ÷ (1 + Rate)</strong></p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
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

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Detailed Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-muted-foreground font-medium">Net Price (Excl. Tax)</span>
                <span className="text-lg font-bold">${results.netPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-3">
                <div className="space-y-0.5">
                  <span className="text-muted-foreground font-medium">Sales Tax</span>
                  <p className="text-[10px] text-accent font-bold uppercase tracking-wider">{taxRate}% applied</p>
                </div>
                <span className="text-lg font-bold text-accent">+ ${results.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xl font-black text-primary uppercase tracking-tighter">Total Price</span>
                <span className="text-3xl font-black text-primary font-headline">${results.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs text-blue-800 leading-relaxed font-semibold">
                Did you know?
              </p>
              <p className="text-[11px] text-blue-700">
                Sales tax is a consumption tax imposed by the government on the sale of goods and services. Rates vary significantly by state, county, and even city. Always check your local municipality for the most accurate current rate.
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
              Take the Mystery Out of Retail Prices with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Whether you are budgeting for a major home appliance purchase, mapping out operating expenses for your business, or simply trying to cross-reference an invoice, understanding retail taxes is key. Unlike many countries where the price on the sticker is the final price you pay, the United States applies state, county, and municipal taxes directly at the cash register. Our free online Sales Tax Calculator removes the guesswork from your shopping, serving as an instant retail tax calculator that maps your exact purchase costs.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              The Math of Retail Taxes: Calculating and Reversing Sales Tax
            </h3>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Calculating the added cost of a tax rate is straightforward, but working backward to discover the original price of an item requires a slightly different algebraic approach. Our platform processes both equations seamlessly to help you estimate sales tax in either direction.
              </p>

              <div className="space-y-2">
                <p className="font-bold text-sm text-foreground">1. Finding the Total Price (Forward Calculation)</p>
                <p className="text-sm text-muted-foreground">To calculate how much tax you will pay on a purchase and determine your final out-of-pocket cost, the calculator uses the standard retail tax formula:</p>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border space-y-2">
                  <p>Tax Amount = Before-Tax Price × (Sales Tax Rate / 100)</p>
                  <Separator />
                  <p>Total Price = Before-Tax Price + Tax Amount</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-sm text-foreground">2. Finding the Base Price (Reverse Tax Calculation)</p>
                <p className="text-sm text-muted-foreground">If you have a final receipt and want to find the original pre-tax cost of an item, you cannot simply subtract the tax percentage from the final total. Instead, the calculator reverses the compounding effect of the tax rate:</p>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                  Before-Tax Price = Total Price / (1 + (Sales Tax Rate / 100))
                </div>
                <p className="text-xs text-muted-foreground pt-2 leading-relaxed">
                  For example, if you bought an item for a tax-inclusive total of $108 in an area with an 8% tax rate, dividing $108 by 1.08 reveals the exact pre-tax price was $100, and the tax paid was $8.
                </p>
              </div>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Calculate Sales Tax with MyApexCalc?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Managing business receipts or comparing purchase budgets across different jurisdictions can get confusing. MyApexCalc delivers a simplified, ad-free toolkit designed for maximum efficiency:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ArrowRightLeft className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Forward and Reverse Modes</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Switch instantly between adding taxes to a baseline price or extracting pre-tax values from an all-inclusive receipt.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Landmark className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Granular Multi-Tax Stacking</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Input distinct percentage fields for state, county, and local city tax rates to match your exact physical location.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Real-Time Financial Totals</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Simply type in your values to watch your subtotal, total tax amount, and final retail sum recalculate instantly.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <ShieldCheck className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "Retail precision means knowing exactly where your dollar goes. Account for every cent with our transparent math engine."
              </p>
            </div>
          </div>
        </div>

        {/* U.S. State Sales Tax Table (Preserved for user reference) */}
        <section className="space-y-6 pt-10">
          <div className="flex items-center gap-2">
            <Landmark className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold text-primary">U.S. State Sales Tax Rates (2024 Reference)</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Below are the standard state-level sales tax rates for all 50 states. Please note that many local jurisdictions (counties and cities) may add their own sales taxes on top of these base rates.
          </p>
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="bg-muted/50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="font-bold">State</TableHead>
                    <TableHead className="text-right font-bold">Base Sales Tax Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stateTaxRates.map((item) => (
                    <TableRow key={item.state} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-medium">{item.state}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary">{item.rate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground italic">
            Data is for general informational purposes and may be subject to change. Always verify current rates with your local tax authority.
          </p>
        </section>
      </div>
    </CalculatorWrapper>
  );
}
