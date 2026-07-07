"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Receipt, Info, ArrowRightLeft, DollarSign, Percent, History, Calculator } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

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
              <CardTitle className="text-sm font-bold flex items-center gap-2">
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

        {/* Informational Text Section */}
        <div className="lg:col-span-12 space-y-12 py-10">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <History className="w-6 h-6" />
                Understanding Sales Tax
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Sales tax is usually a percentage of the purchase price. At <strong>My Apex Calc</strong>, our tool is designed to help both consumers and business owners handle these calculations with precision. Whether you are budgeting for a large purchase or trying to figure out your business's net revenue from gross receipts, accuracy is key.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                In many countries, like the UK or Australia, sales tax is called <strong>Value Added Tax (VAT)</strong> or <strong>Goods and Services Tax (GST)</strong> and is often included in the displayed price. In the United States, however, sales tax is typically added at the register.
              </p>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Common Scenarios</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ArrowRightLeft className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Reverse Calculation</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">If you know the total amount you paid and the tax rate, use the <strong>Reverse Tax</strong> mode to find out how much the item actually cost before the government took its cut.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Receipt className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Business Budgeting</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Businesses often need to separate tax from revenue for accounting purposes. This calculator makes it easy to reconcile your books by extracting the net value from total sales.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
